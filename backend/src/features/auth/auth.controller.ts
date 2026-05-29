import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from "express";
import { supabase } from "../../config/supabase";
import { AuthRequest } from "../../shared/types";

export const getAuth = (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(Boom.badRequest("refreshToken required"));

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
      return next(Boom.unauthorized("Invalid or expired refresh token"));
    }

    res.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.json({ message: "Logout exitoso" });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name || "New User", role: role || "user" },
      },
    });

    if (error) {
      return next(Boom.badRequest(error.message));
    }

    if (!data.session) {
      return next(Boom.badRequest("Email verification required"));
    }

    res.status(201).json({
      message: "Usuario registrado",
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: name || "New User",
        role: role || "user",
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
      .select("role, name")
      .eq("id", data.user.id)
      .single();

    res.status(200).json({
      message: "Login exitoso",
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name ?? data.user.user_metadata?.full_name ?? data.user.email,
        role: profile?.role ?? "user",
      },
    });
  } catch (err) {
    next(err);
  }
};
