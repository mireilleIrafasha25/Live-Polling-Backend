import express, { Router } from 'express'
import { createPoll,becomeAdmin,getMyPolls,getPollByCode,updatePoll} from '../controllers/poolController'
import { authenticateToken,authorize} from '../middleware/authenthicateToken'
const router :Router = express.Router()

router.post('/createPoll',authenticateToken,authorize("admin"), createPoll)
router.patch('/becomeAdmin', authenticateToken, becomeAdmin);
router.get('/myPolls', authenticateToken, getMyPolls);
router.get('/getpoll', getPollByCode);
router.put('/updatePoll/:pollid', authenticateToken, updatePoll);
export default router
