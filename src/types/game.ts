export type PlantType = string;

export type FertilizerType = 'humus' | 'azofoska' | 'pidsilivach' | 'katalizator';

export type AchievementType = 'clicks' | 'harvests' | 'plots' | 'waterings' | 'fertilizers';

export interface AchievementLevel {
  level: number;
  requirement: number;
  reward: number;
  description: string;
}

export interface Achievement {
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  levels: AchievementLevel[];
  currentLevel: number;
  currentProgress: number;
  claimedLevels: number[];
}

export interface PlantData {
  type: PlantType;
  name: string;
  image: string;
  requiredLevel: number;
  growTime: number;
  buyPrice: number;
  sellPrice: number;
  experience: number;
  fruitsPerHarvest: number;
}

export interface FertilizerData {
  type: FertilizerType;
  name: string;
  image: string;
  requiredLevel: number;
  timeReduction: number; // in minutes
  price: number;
  experience: number; // experience gained when using fertilizer
  description: string;
}

export interface Plant {
  id: string;
  type: PlantType;
  timeLeft: number;
  totalTime: number;
  isReady: boolean;
  plantedAt: number;
  lastWateredAt: number;
  fertilizerApplied?: FertilizerType; // Track if fertilizer was applied
  lastFertilizedAt?: number; // Track when fertilizer was last applied
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
  emeralds: number;
  totalClicks: number;
  totalHarvests: number;
  totalWaterings: number;
  totalFertilizers: number;
}

export type RatingType = 'level' | 'harvests' | 'clicks';

export interface RatingEntry {
  user: User;
  rank: number;
  value: number;
}

export interface RatingData {
  type: RatingType;
  entries: RatingEntry[];
  totalUsers: number;
}

export type Warehouse = Record<string, number>;

export interface FarmPlot {
  id: string;
  isUnlocked: boolean;
  plant: Plant | null;
  unlockPrice: number;
  unlockCurrency?: 'coins' | 'emeralds';
}

export interface GameState {
  user: User;
  currentPlant: Plant | null;
  warehouse: Warehouse;
  warehouseLevel: number;
  warehouseCapacity: number;
  toastMessage?: string | null;
  toastType?: 'info' | 'warning' | 'error' | null;
  activeTab: 'farm' | 'warehouse' | 'achievements' | 'rating';
  isGameRunning: boolean;
  isHarvesting: boolean;
  farmPlots: FarmPlot[];
  selectedPlantType: PlantType | null;
  selectedFertilizerType: FertilizerType | null;
  achievements: Achievement[];
  syncStatus: 'idle' | 'saving' | 'loading' | 'error';
  lastSyncTime: number | null;
  initialSyncDone?: boolean;
  ratingData: RatingData | null;
  activeRatingType: RatingType;
  levelUpModal: {
    isOpen: boolean;
    newLevel: number;
    newPlantType: PlantType | null;
    rewardCoins: number;
  };
  // Daily exchange state
  exchange: {
    usedToday: number; // emeralds exchanged today
    resetAt: number;   // timestamp for next reset (midnight)
  };
}

export interface GameActions {
  // Plant actions
  createNewPlant: () => void;
  clickPlant: (plotId: string) => void;
  harvestPlant: (plotId: string) => void;
  plantSeed: (plotId: string, plantType: PlantType) => void;
  waterPlant: (plotId: string) => void;
  clearPlot: (plotId: string) => void;
  
  // User actions
  addExperience: (amount: number) => void;
  addCoins: (amount: number) => void;
  levelUp: () => void;
  
  // Warehouse actions
  sellProduct: (product: keyof Warehouse, amount: number) => void;
  upgradeWarehouse: () => void;

  // UI
  showToast: (message: string, type?: 'info' | 'warning' | 'error') => void;
  clearToast: () => void;
  
  // Farm actions
  unlockPlot: (plotId: string) => void;
  selectPlantType: (plantType: PlantType | null) => void;
  selectFertilizerType: (fertilizerType: FertilizerType | null) => void;
  applyFertilizer: (plotId: string, fertilizerType: FertilizerType) => void;
  
  // UI actions
  setActiveTab: (tab: 'farm' | 'warehouse' | 'achievements' | 'rating') => void;
  startGame: () => void;
  stopGame: () => void;
  
  // Timer actions
  decrementTimer: () => void;
  
  // Achievement actions
  claimAchievementReward: (achievementType: AchievementType, level: number) => void;
  updateAchievements: () => void;
  
  // Database sync actions
  saveGameState: () => Promise<void>;
  loadGameState: () => Promise<void>;
  setSyncStatus: (status: 'idle' | 'saving' | 'loading' | 'error') => void;
  setLastSyncNow: () => void;
  
  // Rating actions
  loadRatingData: (type: RatingType) => Promise<void>;
  setActiveRatingType: (type: RatingType) => void;
  
  // Level up modal actions
  showLevelUpModal: (newLevel: number, newPlantType: PlantType | null, rewardCoins: number) => void;
  closeLevelUpModal: () => void;
  
  // State management
  forceStateUpdate: () => void;

  // Exchange actions
  exchangeCoinsForEmeraldsByCoins: (coinsAmount: number) => void;
  exchangeMaxToday: () => void;
  getExchangeRemainingToday: () => number;
}
