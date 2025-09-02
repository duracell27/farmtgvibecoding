export interface Plant {
  id: string;
  type: 'onion';
  timeLeft: number;
  totalTime: number;
  isReady: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  coins: number;
}

export interface Warehouse {
  onion: number;
}

export interface GameState {
  user: User;
  currentPlant: Plant | null;
  warehouse: Warehouse;
  activeTab: 'farm' | 'warehouse';
  isGameRunning: boolean;
}

export interface GameActions {
  // Plant actions
  createNewPlant: () => void;
  clickPlant: () => void;
  harvestPlant: () => void;
  
  // User actions
  addExperience: (amount: number) => void;
  addCoins: (amount: number) => void;
  levelUp: () => void;
  
  // Warehouse actions
  sellProduct: (product: keyof Warehouse, amount: number) => void;
  
  // UI actions
  setActiveTab: (tab: 'farm' | 'warehouse') => void;
  startGame: () => void;
  stopGame: () => void;
  
  // Timer actions
  decrementTimer: () => void;
}
