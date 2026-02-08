import { Router } from "express";
import { getMatches } from "./match.controller.js";


const router = Router();

router.get("/matches", getMatches);

export const matchRoutes = router;
