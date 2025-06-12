const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
// app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend origin
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'https://restaurant-qr-ordering-system-mvf7hqav6.vercel.app/'
//   ]
// }));
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));


const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

// Test Route
app.get('/', (req, res) => res.send('API is running'));

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
