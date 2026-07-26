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
  }
}));
