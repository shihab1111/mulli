import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { discoveryServices } from "./discovery.service.js";

// GET: normal OR saved filters
// /discovery/batch?filtered=true
const getDiscoveryBatch = catchAsync(async (req, res) => {
  const result = await discoveryServices.getDiscoveryBatchService(req.user, req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Discovery batch fetched successfully!",
    data: result,
  });
});

// POST: customer sends custom filters in body (temporary apply, no save)
// /discovery/batch
const getDiscoveryBatchWithCustomFilters = catchAsync(async (req, res) => {
  const result = await discoveryServices.getDiscoveryBatchWithCustomFiltersService(
    req.user,
    req.query,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Discovery batch fetched successfully (custom filters)!",
    data: result,
  });
});

export const discoveryControllers = {
  getDiscoveryBatch,
  getDiscoveryBatchWithCustomFilters,
};
