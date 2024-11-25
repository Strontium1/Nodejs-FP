import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "./env";
import { Request, Response } from "express";

export interface IUserToken
  extends Omit<
    User,
    | "email"
    | "password"
    | "profilePicture"
    | "orders"
  > {
  id?: Types.ObjectId;
}

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};
export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as JwtPayload;
  return user;
};
export const getUserID = (req: Request): string => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    throw new Error('Unauthorized, please login first.');
  }

  const [prefix, token] = authorization.split(' ');
  if (!(prefix === 'Bearer' && token)) {
    throw new Error('Wrong type of token');
  }

  const user = jwt.verify(token, SECRET) as JwtPayload;
  return user.id;
};
export const getUserUsername = (req: Request): string => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    throw new Error('Unauthorized, please login first.');
  }

  const [prefix, token] = authorization.split(' ');
  if (!(prefix === 'Bearer' && token)) {
    throw new Error('Wrong type of token');
  }

  const user = jwt.verify(token, SECRET) as JwtPayload;
  return user.username;
};
export const getUserRoles = (req: Request): string => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    throw new Error('Unauthorized, please login first.');
  }

  const [prefix, token] = authorization.split(' ');
  if (!(prefix === 'Bearer' && token)) {
    throw new Error('Wrong type of token');
  }

  const user = jwt.verify(token, SECRET) as JwtPayload;
  return user.roles;
};