import UserRoute from "./authRoute";
import PollRoute from "./poolRoute";
import VoteRoute from "./voteRoute";
import express ,{Router} from "express";

const router:Router=express.Router();
router.use("/user",UserRoute);
router.use("/poll",PollRoute);
router.use("/vote",VoteRoute);
export default router;
