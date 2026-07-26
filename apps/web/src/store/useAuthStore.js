import { create } from 'zustand';
import { StorageUtil } from '../utils/storage.util';

const DEFAULT_USER = {
  name: 'Alex Morgan',
  email: 'alex.morgan@roomia.app',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'Expat / Profesional',
  isLoggedIn: true
};

export const useAuthStore = create((set, get) => ({
  user: StorageUtil.get('roomia_user_profile', DEFAULT_USER),
  isAuthModalOpen: false,

  setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),

  login: (email, password) => {
    const updated = {
      name: email.split('@')[0].replace('.', ' '),
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
    const loggedOutUser = {
      name: 'Invitado',
      email: '',
      avatar: '',
      role: 'Invitado',
      isLoggedIn: false
    };
    StorageUtil.set('roomia_user_profile', loggedOutUser);
    set({ user: loggedOutUser, isAuthModalOpen: false });
  },

  updateProfile: (name, role) => {
    const updated = { ...get().user, name, role };
    StorageUtil.set('roomia_user_profile', updated);
    set({ user: updated });
  }
}));
