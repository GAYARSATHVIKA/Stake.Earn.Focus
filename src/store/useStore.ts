import { create } from 'zustand';

interface Web3State {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  setWallet: (address: string | null, balance: string | null, chainId: number | null) => void;
  setConnecting: (status: boolean) => void;
  disconnect: () => void;
}

export const useWeb3Store = create<Web3State>((set) => ({
  address: null,
  balance: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  setWallet: (address, balance, chainId) => set({
    address,
    balance,
    chainId,
    isConnected: !!address,
    isConnecting: false
  }),
  setConnecting: (status) => set({ isConnecting: status }),
  disconnect: () => set({
    address: null,
    balance: null,
    chainId: null,
    isConnected: false,
    isConnecting: false
  }),
}));

interface Room {
  id: number;
  stakeAmount: string;
  startTime: number;
  endTime: number;
  participants: string[];
  distributed: boolean;
}

interface AppState {
  rooms: Room[];
  activeRoomId: number | null;
  setRooms: (rooms: Room[]) => void;
  setActiveRoomId: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  rooms: [],
  activeRoomId: null,
  setRooms: (rooms) => set({ rooms }),
  setActiveRoomId: (id) => set({ activeRoomId: id }),
}));
