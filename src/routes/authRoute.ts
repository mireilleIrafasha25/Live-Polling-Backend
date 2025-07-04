import express, { Router } from 'express';
import { 
  SignIn,SignUp,Validateopt,ForgotPassword,ResetPassword,
  getAllusers ,test,deleteUser} from '../controllers/UserController';
import { validate } from '../middleware/validation.middleware';
import { signupSchema,verifyEmailSchema,loginSchema,forgotPasswordSchema,resetPasswordSchema,} from '../schemas/auth.schemas';
import {authenticateToken,authorize} from "../middleware/authenthicateToken"

const router: Router = express.Router();
router.get("/Test",test)
router.post('/signup', validate(signupSchema), SignUp);
router.post('/validateOtp',validate(verifyEmailSchema),Validateopt);
router.post('/signin', validate(loginSchema), SignIn);
router.post('/forgotPassword', validate(forgotPasswordSchema), ForgotPassword);
router.post('/resetPassword/:token/:id', validate(resetPasswordSchema), ResetPassword);
router.get('/listAll',getAllusers);
router.delete('/deleteUser/:id',authenticateToken,authorize("admin"),deleteUser);

export default router;