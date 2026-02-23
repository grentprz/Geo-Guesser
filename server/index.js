const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - USING YOUR PASSWORD Brent246
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geoguessr',
  password: 'Brent246',
  port: 5432,
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to PostgreSQL');
  }
});

// Make db available to routes
app.set('db', pool);

// ============= AUTH ROUTES =============

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // Create token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============= GAME ROUTES =============

// Save game result
app.post('/api/games/save', async (req, res) => {
  try {
    const { userId, mode, score, distance, rounds, opponentId } = req.body;
    const pool = req.app.get('db');

    // Save game
    const game = await pool.query(
      `INSERT INTO games (user_id, mode, score, distance, rounds, opponent_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id`,
      [userId, mode, score, distance, JSON.stringify(rounds), opponentId]
    );

    // Update leaderboard with penalty system
    await pool.query(`
      INSERT INTO leaderboard (user_id, mode, score, games_played, last_played)
      VALUES ($1, $2, $3, 1, NOW())
      ON CONFLICT (user_id, mode) 
      DO UPDATE SET 
        score = leaderboard.score + $3,
        games_played = leaderboard.games_played + 1,
        last_played = NOW()
    `, [userId, mode, score]);

    res.json({ success: true, gameId: game.rows[0].id });
  } catch (error) {
    console.error('Save game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user game history
app.get('/api/games/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = req.app.get('db');

    const games = await pool.query(
      `SELECT * FROM games WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [userId]
    );

    res.json(games.rows);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============= LEADERBOARD ROUTES =============

// Get leaderboard by mode
app.get('/api/leaderboard/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const { limit = 50 } = req.query;
    
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        COALESCE(l.score, 0) as score,
        COALESCE(l.games_played, 0) as games_played,
        RANK() OVER (ORDER BY COALESCE(l.score, 0) DESC) as rank
      FROM users u
      LEFT JOIN leaderboard l ON u.id = l.user_id AND l.mode = $1
      WHERE l.score IS NOT NULL
      ORDER BY l.score DESC
      LIMIT $2
    `, [mode, limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user rank
app.get('/api/leaderboard/rank/:userId/:mode', async (req, res) => {
  try {
    const { userId, mode } = req.params;
    
    const result = await pool.query(`
      WITH ranked AS (
        SELECT 
          u.id,
          u.username,
          l.score,
          RANK() OVER (ORDER BY l.score DESC) as rank
        FROM users u
        JOIN leaderboard l ON u.id = l.user_id
        WHERE l.mode = $1
      )
      SELECT * FROM ranked WHERE id = $2
    `, [mode, userId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ rank: 'N/A', score: 0 });
    }
  } catch (error) {
    console.error('Rank error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'GeoGuessr API is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
});