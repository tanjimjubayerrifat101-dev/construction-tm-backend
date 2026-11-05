"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const validateRequest = (schema) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        // If request body was sent as form-data containing JSON string in 'data' field, parse it
        if (req.body && typeof req.body.data === "string") {
            try {
                req.body = JSON.parse(req.body.data);
            }
            catch (err) {
                // keep as is if not valid JSON
            }
        }
        await schema.parseAsync({
            body: req.body,
            cookies: req.cookies,
            query: req.query,
            params: req.params,
        });
        next();
    });
};
exports.validateRequest = validateRequest;
