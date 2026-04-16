import { create } from "zustand";

export interface Citizen {
  id: string;
  fullName: string;
  phone: string;
  biNumber: string;
  ward: string;
  totalReports: number;
  resolvedReports: number;
  memberSince: string;
}

interface AuthState {
  citizen: Citizen | null;
  token: string | null;
  isAuthenticated: boolean;
  setCitizen: (citizen: Citizen, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  citizen: {
    id: "c1",
    fullName: "Ana Ferreira",
    phone: "+244 923 456 789",
    biNumber: "005234567LA042",
    ward: "Maianga",
    totalReports: 7,
    resolvedReports: 4,
    memberSince: "Janeiro 2025",
  },
  token: "mock-token",
  isAuthenticated: true,
  setCitizen: (citizen, token) => set({ citizen, token, isAuthenticated: true }),
  logout: () => set({ citizen: null, token: null, isAuthenticated: false }),
}));
