import { Router } from 'express';
import { voteOnPoll } from '../controllers/voteController';
import { authenticateToken } from '../middleware/authenthicateToken';

const router = Router();

// Anyone who is logged in can vote
router.post('/newVote',voteOnPoll);

export default router;
