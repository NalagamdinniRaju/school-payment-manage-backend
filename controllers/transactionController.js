

const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ created_at: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionsBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const transactions = await Transaction.find({ school_id }).sort({ created_at: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;
    const transaction = await Transaction.findOne({ custom_order_id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, status, order_amount, transaction_amount, gateway } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { collect_id: order_id },
      { status, order_amount, transaction_amount, gateway },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.manualStatusUpdate = async (req, res) => {
  try {
    const { custom_order_id, status } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { custom_order_id },
      { status },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

