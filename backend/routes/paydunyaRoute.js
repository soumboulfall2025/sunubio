import express from 'express';
import { handlePaydunyaCallback } from '../controllers/paydunyaController.js';

const router = express.Router();

router.post('/callback', handlePaydunyaCallback);

export default router;
