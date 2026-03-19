// JWT Utility Functions
import jwt from "jsonwebtoken";

import { config } from "../config/env";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload as object,
    config.jwtSecret as jwt.Secret,
    {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions,
  );
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload as object,
    config.jwtRefreshSecret as jwt.Secret,
    {
      expiresIn: config.refreshTokenExpiresIn,
    } as jwt.SignOptions,
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
