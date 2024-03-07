import express from 'express';
import {SignIn, SignOut} from '../../middleware/auth.js';

const router = express.Router();

router.post('/signIn', SignIn);
router.post('/signOut', SignOut);

export default router