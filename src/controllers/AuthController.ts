import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../database/prisma";
import { auth } from "../config/AuthConfig";

export class AuthController {
  async Register(request: Request, response: Response) {
    const { name, username, email, password, avatar } = request.body;

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      return response.status(401).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const createUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        avatar,
      },
    });

    const userResponse = {
      ...createUser,
      password: undefined,
    };

    return response.json(userResponse);
  }

  async Login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.status(401).json({
        message: "Your email or password are incorrect.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return response.status(401).json({
        message: "Your email or password are incorrect.",
      });
    }

    const payload = { userId: user.id };

    const token = jwt.sign(payload, auth.secret, {
      expiresIn: "60m",
      subject: user.id,
    });

    const userResponse = {
      token,
      user: {
        ...user,
        password: undefined,
      },
    };

    return response.json(userResponse);
  }
}
