import jwt from "jsonwebtoken";
import { auth } from "../config/AuthConfig";
import { NextFunction, Request, Response } from "express";

export const AuthMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token not present.",
    });
  }

  const token = authHeader.replace("Bearer", "").trim();

  if (!token) {
    return response.status(401).json({
      message: "Token not present.",
    });
  }

  try {
    const decoded = jwt.verify(token, auth.secret);
    request.user = decoded;
    next();
  } catch (err) {
    throw new Error("Invalid Token.");
  }
};
