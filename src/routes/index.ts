import UserRoute from "./authRoute";
import express ,{Router} from "express";

const router:Router=express.Router();
router.use("/user",UserRoute)
export default router;
