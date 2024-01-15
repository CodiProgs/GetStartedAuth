import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"


export interface Global {
  token: string,
}

export interface GlobalActions {
  setToken: (token: string) => void,
}

export const useGlobalStore = create<Global & GlobalActions>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (token: string) => set((state) => ({ ...state, token })),
      }), {
      name: "global-storage",
    }
    )
  )
)