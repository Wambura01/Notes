import { TUserProfile } from "@/shared/types";
import { create } from "zustand";

interface IStore {
  userProfile: TUserProfile | null;
  setUserProfile: (profile: TUserProfile | null) => void;
}

const useStore = create<IStore>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
}));

export default useStore;
