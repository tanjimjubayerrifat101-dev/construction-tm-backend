"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        oldPassword: zod_1.z.string().min(1, "Old password is required"),
        newPassword: zod_1.z
            .string()
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
    })
        .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New password and Confirm password do not match",
        path: ["confirmPassword"],
    }),
});
const forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Please provide a valid email"),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        token: zod_1.z.string().min(1, "Reset token is required"),
        newPassword: zod_1.z
            .string()
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
    })
        .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        phoneNumber: zod_1.z.string().optional(),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
    updateProfileValidationSchema,
};
