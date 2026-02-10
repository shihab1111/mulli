import { Router } from "express";
import { getMatches } from "./match.controller.js";
import { checkAuth } from "../../middlewars/checkAuth.js";


const router = Router();

router.get("/matches",checkAuth("user","admin"), getMatches);

export const matchRoutes = router;
