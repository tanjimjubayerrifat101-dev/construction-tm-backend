"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res) => {
    return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
    });
};
exports.notFound = notFound;
