import { Router } from "express";
import { discoveryControllers } from "./discovery.controller.js";


const router = Router();

// GET: normal feed OR saved filters with ?filtered=true
router.get("/batch",  discoveryControllers.getDiscoveryBatch);

// POST: customer-provided filters (temporary)
router.post("/batch",  discoveryControllers.getDiscoveryBatchWithCustomFilters);

export const discoveryRouter= router;
