"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorSources = [
        {
            path: "",
            message: `${extractedMessage || "Resource"} already exists`,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Duplicate key error",
        errorSources,
    };
};
exports.handleDuplicateError = handleDuplicateError;
