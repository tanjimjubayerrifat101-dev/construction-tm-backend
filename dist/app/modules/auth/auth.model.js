"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: "",
    },
    avatar: {
        url: {
            type: String,
            default: "",
        },
        public_id: {
            type: String,
            default: "",
        },
    },
    role: {
        type: String,
        enum: ["ADMIN"],
        default: "ADMIN",
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE",
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.passwordResetToken;
            delete ret.passwordResetExpires;
            return ret;
        },
    },
});
// Hash password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    user.password = await bcryptjs_1.default.hash(user.password, config_1.default.bcrypt_salt_rounds);
    next();
});
// Check if user exists by email
userSchema.statics.isUserExistsByEmail = async function (email) {
    return await this.findOne({ email }).select("+password");
};
// Check if password matches
userSchema.statics.isPasswordMatched = async function (plainPassword, hashedPassword) {
    return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
// Check if JWT was issued before password changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangeTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangeTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)("User", userSchema);
