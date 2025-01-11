
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const csvParser = require('csv-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const Transaction = require('./models/Transaction');


dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    credentials: true
}));
app.use(express.json());

// Utility function to load data from a CSV file
const loadCSVData = async (filePath, schema) => {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const formattedRow = new schema(row);
                data.push(formattedRow);
            })
            .on('end', () => resolve(data))
            .on('error', (error) => reject(error));
    });
};

app.use(express.static('public'));

mongoose.connect("mongodb+srv://NRSRaju:Raju9398@cluster0.0n9qgog.mongodb.net/school-management?retryWrites=true&w=majority&appName=Cluster0")
.then(async () => {
  console.log('Connected to MongoDB');
  await User.createDummyUser();

  // // Load and insert CSV data into MongoDB
  // // Delete existing transactions before inserting new ones
  // await Transaction.deleteMany({}); // This will remove all existing records in the Transaction collection

  const transactionCount = await Transaction.countDocuments();
  
  if (transactionCount === 0) {
    try {

      const transactions = await loadCSVData('./public/test.collect_request.csv', Transaction);
      console.log(transactions)
      await Transaction.insertMany(transactions);
      console.log(`${transactions.length} transactions inserted from the CSV file.`);
    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  } else {
    console.log(`${transactionCount} transactions already exist in the database.`);
  }
})
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
