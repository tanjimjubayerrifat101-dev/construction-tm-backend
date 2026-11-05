import { Model } from "mongoose";

export type IUserRole = "ADMIN";
export type IUserStatus = "ACTIVE" | "BLOCKED";

export interface IImage {
  url: string;
  public_id?: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  avatar?: IImage;
  role: IUserRole;
  status: IUserStatus;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}

export interface ILoginUser {
  email: string;
  password?: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateAdminProfile {
  name?: string;
  phoneNumber?: string;
  avatar?: IImage;
}
