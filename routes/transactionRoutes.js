const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/', authenticateJWT, transactionController.getAllTransactions);
router.get('/school/:school_id', authenticateJWT, transactionController.getTransactionsBySchool);
router.get('/check-status/:custom_order_id', authenticateJWT, transactionController.checkTransactionStatus);
router.post('/webhook', transactionController.updateTransactionStatus);
router.post('/manual-update', authenticateJWT, transactionController.manualStatusUpdate);

module.exports = router;

