import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from "express";
import { supabase } from "../../config/supabase";
import { AuthRequest } from "../../shared/types";

export const getAuth = (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name || "New User" },
      },
    });

    if (error) {
      return next(Boom.badRequest(error.message));
    }

    res.status(201).json({
      message: "Usuario registrado",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: "user",
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      return next(Boom.unauthorized("Credenciales inválidas"));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    res.status(200).json({
      message: "Login exitoso",
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role ?? "user",
      },
    });
  } catch (err) {
    next(err);
  }
};
