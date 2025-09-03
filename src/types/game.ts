export type PlantType = 'dill' | 'parsley' | 'onion' | 'cucumber' | 'tomato';

export interface PlantData {
  type: PlantType;
  name: string;
  image: string;
  requiredLevel: number;
  growTime: number;
  buyPrice: number;
  sellPrice: number;
  experience: number;
}

export interface Plant {
  id: string;
  type: PlantType;
  timeLeft: number;
  totalTime: number;
  isReady: boolean;
  plantedAt: number;
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
  dill: number;
  parsley: number;
  onion: number;
  cucumber: number;
  tomato: number;
}

export interface FarmPlot {
  id: string;
  isUnlocked: boolean;
  plant: Plant | null;
  unlockPrice: number;
}

export interface GameState {
  user: User;
  currentPlant: Plant | null;
  warehouse: Warehouse;
  activeTab: 'farm' | 'warehouse';
  isGameRunning: boolean;
  isHarvesting: boolean;
  farmPlots: FarmPlot[];
  selectedPlantType: PlantType | null;
}

export interface GameActions {
  // Plant actions
  createNewPlant: () => void;
  clickPlant: (plotId: string) => void;
  harvestPlant: (plotId: string) => void;
  plantSeed: (plotId: string, plantType: PlantType) => void;
  
  // User actions
  addExperience: (amount: number) => void;
  addCoins: (amount: number) => void;
  levelUp: () => void;
  
  // Warehouse actions
  sellProduct: (product: keyof Warehouse, amount: number) => void;
  
  // Farm actions
  unlockPlot: (plotId: string) => void;
  selectPlantType: (plantType: PlantType | null) => void;
  
  // UI actions
  setActiveTab: (tab: 'farm' | 'warehouse') => void;
  startGame: () => void;
  stopGame: () => void;
  
  // Timer actions
  decrementTimer: () => void;
  
  // State management
  forceStateUpdate: () => void;
}
