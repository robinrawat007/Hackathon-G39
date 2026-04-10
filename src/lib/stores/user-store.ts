"use client"

import { create } from "zustand"

import type { UserProfile } from "@/types/user"

interface UserState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

