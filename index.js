require('dotenv').config({ path: './.env' });
console.log("JWT_SECRET:", process.env.JWT_SECRET); // ✅ Debugging line
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Changed to bcryptjs
const User = require('./models/user.model');
const Complaint = require('./models/schema');
const app = express();
const router = express.Router();
const userRoutes = require('./routes/user.routes');
const complaintRoutes = require('./routes/complaintRoutes');
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require('path');
const port = process.env.PORT || 1337;

app.use(express.json());

// CORS (optional if frontend and backend are on the same domain)
app.use(
    cors({
        origin: [
            'https://teenage-ocelot-qualitycomplaince360-cde4fbf8.koyeb.app/', // Frontend URL on Koyeb
            'http://localhost:3000', // For local testing
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);



  // Create a router instance
// Middleware

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("uploads")); // Serve uploaded files statically
app.use(express.static(path.join(__dirname, 'build'))); // Serve React build folder statically


// Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);


app.get('/', (req, res) => {
  res.send('Hello from your server!'); 
  // Or render an initial HTML page if you have a frontend
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // Skip serving React for API routes
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Database Connection 

 const uri ="mongodb+srv://wardarajpoot050:warda1234@complaintsystem.u8ebr.mongodb.net/?retryWrites=true&w=majority&appName=ComplaintSystem";// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongoose connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas with Mongoose:", err);
  });
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';


// Generate JWT Tokens

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      status: user.status,
      name: user.name // Add the name field here
    },
    JWT_SECRET,
    { expiresIn: '10h' }
  );
};

//Multer Things
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|mp4|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});
// Middleware to check token validity
const authenticateToken = (req, res, next) => {
  const token = req.header('x-access-token');
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};


// Register Route
app.post('/api/register', async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create new user object
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword, // Save the hashed password
      role,
      status: role === 'admin' ? 'approved' : 'pending' // Auto-approve admins
    });

    // Save user to database
    await newUser.save();

    // Send success response
    res.status(201).json({ status: 'ok', message: 'Registration successful. Awaiting approval if applicable.' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again.' });
  }
});


// Login Route
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
      // Find user by email or username
      const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
          console.log('Login failed: User not found');
          return res.status(400).json({ error: 'Invalid username/email or password' });
      }
      

      // Compare password
      const match = await bcrypt.compare(password, user.password);
if (!match) {
    // Rehash password to make sure it's consistent
    const rehashedPassword = await bcrypt.hash(password, 10);
    user.password = rehashedPassword;
    await user.save();  // Save rehashed password
    return res.status(400).json({ error: 'Invalid username/email or password' });
}


      // Generate JWT token
      const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      console.log('User logged in successfully:', user.username || user.email);

      // Respond with token and user info
      res.json({
          status: 'ok',
          message: 'Login successful',
          token: token,
          user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
      });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
});


// Quote Routes
app.get('/api/quote', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.quote) {
      return res.json({ status: 'error', error: 'No quote found' });
    }
    return res.json({ status: 'ok', quote: user.quote });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', error: 'Invalid token or no quote found' });
  }
});

app.post('/api/quote', authenticateToken, async (req, res) => {
  try {
    const newQuote = req.body.quote;

    if (!newQuote || newQuote.trim().length === 0) {
      return res.json({ status: 'error', error: 'Quote cannot be empty' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { quote: newQuote },
      { new: true }
    );

    return res.json({ status: 'ok', quote: updatedUser.quote });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', error: 'Failed to update quote' });
  }
});

//User Management APIs

// Update user details
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email } = req.body;

    // Validate input
    if (!name || !username || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Find the user by ID and update their details
    const user = await User.findByIdAndUpdate(id, { name, username, email }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});
// Fetch regular approved users
app.get('/api/admin/approved-users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user', status: 'approved' });
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Fetch admins (non-editable list)
app.get('/api/admin/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});
// Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

//Pending Button APIs

// GET /api/admin/pending-users
app.get('/api/admin/pending-users', async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' });
    res.json({ users: pendingUsers });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending users' });
  }
});

// PUT /api/admin/approve-user/:id
app.put('/api/admin/approve-user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: 'approved' },
      { new: true }
    );
    res.json({ message: 'User approved', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error approving user' });
  }
});

  // DELETE /api/admin/reject-user/:id
app.delete('/api/admin/reject-user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting user' });
  }
});

//Add User API by User management Dashbaord
app.post('/api/admin/add-users', async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;

    // Validate input data (optional but recommended)
    if (!name || !email || !username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      status: 'approved',  // Assuming the user should be approved by default
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//User Dashbaord ...
//View Profile 
app.get('/api/profile-data', authenticateToken, async (req, res) => {
  try {
      const user = await User.findOne({ username: req.user.username });
      if (!user) {
          console.error('User not found:', req.user.username);
          return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      res.json({
          status: 'ok',
          profile: {
              name: user.name,
              username: user.username,
              email: user.email,
              role: user.role,
              status: user.status,
          },
      });
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ status: 'error', message: 'Server error' });
  }
}); 

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
      const { name, username, email } = req.body;
      const user = await User.findOneAndUpdate(
          { username: req.user.username },
          { name, username, email },
          { new: true }
      );
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

      res.json({ status: 'ok', message: 'Profile updated successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
  }
});


// Complaint form API

app.post("/api/complaints", upload.array("files", 5), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      nic,
      phone,
      address,
      category,
      subCategory,
      details,
      location,
      date,
      time,
    } = req.body;

    const files = req.files.map(file => ({
      fileName: file.originalname,
      fileSize: file.size,
      filePath: file.path,
    }));

    const complaintId = `CMP-${uuidv4()}`;

    const newComplaint = new Complaint({
      complaintId,
      firstName,
      lastName,
      email,
      nic,
      phone,
      address,
      category,
      subCategory,
      details,
      location,
      date,
      time,
      files,
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaintId,
      files,
    });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ error: error.message });
  }
});

// API to fetch all complaints (optional)
app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Complaint Management 

app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching complaints', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});