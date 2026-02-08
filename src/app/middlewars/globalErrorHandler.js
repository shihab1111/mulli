/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */




import { handlerDuplicateError } from "../helpers/handlerDuplicateError.js";

import AppError from "../errorHelpers/AppError.js";
import { handleCastError } from "../helpers/handleCastError.js";
import { envVars } from "../config/env.js";


export const globalErrorHandler = (err, req, res, next) => {
    if (envVars.NODE_ENV === "development") {
        console.log(err);
    }

    let errorSources = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }


    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}