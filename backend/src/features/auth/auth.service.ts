import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';

export const refreshSessionService = async (refreshToken: string) => {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) throw Boom.unauthorized('Invalid or expired refresh token');
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  };
};

export const registerService = async (email: string, password: string, name: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, role } },
  });
  if (error) throw Boom.badRequest(error.message);
  if (!data.session || !data.user) throw Boom.badRequest('Email verification required');

  await supabase.from('profiles').upsert({
    id: data.user.id,
    email,
    name,
    role,
  });

  return {
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
    user: {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
    },
  };
};

export const loginService = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) throw Boom.unauthorized('Credenciales inválidas');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', data.user.id)
    .single();

  return {
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
    user: {
      id: data.user.id,
      email: data.user.email,
      name: profile?.name ?? data.user.user_metadata?.full_name ?? data.user.email,
      role: profile?.role ?? 'user',
    },
  };
};
