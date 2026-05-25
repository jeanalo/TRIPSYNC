import { supabase } from '../../config/supabase';
import { User, UpdateUserRequest } from './users.types';

export const getUsersService = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role');

  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name ?? '',
    email: p.email ?? '',
    role: p.role ?? 'user'
  }));
};

export const updateUserService = async (id: string, data: UpdateUserRequest): Promise<User | null> => {
  if (data.password) {
    const { error: authError } = await supabase.auth.admin.updateUserById(id, {
      password: data.password
    });
    if (authError) return null;
  }

  const profileUpdates: Record<string, unknown> = {};
  if (data.fullName) profileUpdates.name = data.fullName;

  if (Object.keys(profileUpdates).length > 0) {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', id)
      .select('id, name, email, role')
      .single();

    if (error) return null;

    return {
      id: updated.id,
      name: updated.name ?? '',
      email: updated.email ?? '',
      role: updated.role ?? 'user'
    };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', id)
    .single();

  if (error) return null;

  return {
    id: profile.id,
    name: profile.name ?? '',
    email: profile.email ?? '',
    role: profile.role ?? 'user'
  };
};
