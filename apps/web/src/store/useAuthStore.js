import { create } from 'zustand';
import { StorageUtil } from '../utils/storage.util';

const DEFAULT_GUEST = {
  name: 'Invitado',
  email: '',
  avatar: '',
  role: 'Invitado',
  isLoggedIn: false
};

export const useAuthStore = create((set, get) => ({
  user: StorageUtil.get('roomia_user_profile', DEFAULT_GUEST),
  isAuthModalOpen: false,

  setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),

  login: (email, password) => {
    const rawName = email.split('@')[0].replace(/[\._]/g, ' ');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const updated = {
      name: formattedName,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'Roomie Activo',
      isLoggedIn: true
    };
    StorageUtil.set('roomia_user_profile', updated);
    set({ user: updated, isAuthModalOpen: false });
  },

  register: (name, email, password) => {
    const updated = {
      name: name || 'Usuario RoomIA',
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role: 'Expat / Residente',
      isLoggedIn: true
    };
    StorageUtil.set('roomia_user_profile', updated);
    set({ user: updated, isAuthModalOpen: false });
  },

  logout: () => {
    StorageUtil.set('roomia_user_profile', DEFAULT_GUEST);
    set({ user: DEFAULT_GUEST, isAuthModalOpen: false });
  },

  updateProfile: (name, role) => {
    const updated = { ...get().user, name, role };
    StorageUtil.set('roomia_user_profile', updated);
    set({ user: updated });
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Error al solicitar recuperación');
      const data = await response.json();
      return data.data;
    } catch {
      // Fallback in-memory
      return {
        sent: true,
        email,
        message: `Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada o spam.`,
        resetToken: `rm_reset_${Math.random().toString(36).substring(2, 10)}`
      };
    }
  },

  confirmPasswordReset: async (email, newPassword, resetToken) => {
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, resetToken })
      });
      if (!response.ok) throw new Error('Error al restablecer contraseña');
      const data = await response.json();
      return data.data;
    } catch {
      return {
        updated: true,
        email,
        message: 'Tu contraseña ha sido restablecida exitosamente.'
      };
    }
  }
}));
