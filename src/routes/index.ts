import UserRoute from "./authRoute";
import PollRoute from "./poolRoute";
import express ,{Router} from "express";

const router:Router=express.Router();
router.use("/user",UserRoute);
router.use("/poll",PollRoute);
export default router;
