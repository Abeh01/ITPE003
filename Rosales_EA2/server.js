const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse form data (if needed)
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/patientdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Patient model
const Patient = mongoose.model('Patient', {
  name: String,
  age: Number,
  gender: String,
  diagnosis: String,
  dateAdmitted: String
});

// Set view engine
app.set('view engine', 'ejs');

// Route to display patients
app.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.render('index', { patients });
  } catch (err) {
    console.error('❌ Error fetching patients:', err);
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
