import { Request } from "express";
import { User } from "../features/users/users.types";

export interface AuthRequest extends Request {
  user?: User;
}
