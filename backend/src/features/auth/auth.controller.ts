import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAuthService } from './auth.service';
import { usersMock } from '../users/users.service';

export const getAuth = (req: Request, res: Response) => {
  const authData = getAuthService();
  res.json(authData);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      name: name || "New User",
      role: "user" as const,
      password: hashedPassword
    };
    
    usersMock.push(newUser);

    res.status(201).json({
      message: 'Usuario registrado',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registrando usuario'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = usersMock.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    if (user.password && user.password !== password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ message: 'Credenciales inválidas' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'secretkey',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error en login'
    });
  }
};