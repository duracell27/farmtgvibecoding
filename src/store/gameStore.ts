import { create } from 'zustand';
import { GameState, GameActions, Plant, User, Warehouse } from '@/types/game';

const initialUser: User = {
  id: '1',
  firstName: 'Тестовий',
  lastName: 'Користувач',
  username: 'test_user',
  avatarUrl: '',
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  coins: 0,
};

const initialWarehouse: Warehouse = {
  onion: 0,
};

const createPlant = (): Plant => ({
  id: Date.now().toString(),
  type: 'onion',
  timeLeft: 45,
  totalTime: 45,
  isReady: false,
});

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // Initial state
  user: initialUser,
  currentPlant: createPlant(),
  warehouse: initialWarehouse,
  activeTab: 'farm',
  isGameRunning: false,

  // Plant actions
  createNewPlant: () => {
    set({ currentPlant: createPlant() });
  },

  clickPlant: () => {
    const { currentPlant } = get();
    if (currentPlant && currentPlant.timeLeft > 0) {
      const newTimeLeft = Math.max(0, currentPlant.timeLeft - 1);
      set({
        currentPlant: {
          ...currentPlant,
          timeLeft: newTimeLeft,
          isReady: newTimeLeft === 0,
        },
      });
    }
  },

  harvestPlant: () => {
    const { currentPlant, warehouse, addExperience, addCoins } = get();
    if (currentPlant && currentPlant.isReady) {
      // Add to warehouse
      set({
        warehouse: {
          ...warehouse,
          onion: warehouse.onion + 1,
        },
      });

      // Add experience and coins
      addExperience(10);
      addCoins(5);

      // Create new plant
      get().createNewPlant();
    }
  },

  // User actions
  addExperience: (amount: number) => {
    const { user } = get();
    const newExperience = user.experience + amount;
    const newLevel = Math.floor(newExperience / user.experienceToNextLevel) + 1;
    const experienceToNextLevel = newLevel * 100;

    set({
      user: {
        ...user,
        experience: newExperience,
        level: newLevel,
        experienceToNextLevel,
      },
    });
  },

  addCoins: (amount: number) => {
    const { user } = get();
    set({
      user: {
        ...user,
        coins: user.coins + amount,
      },
    });
  },

  levelUp: () => {
    const { user } = get();
    set({
      user: {
        ...user,
        level: user.level + 1,
        experience: 0,
        experienceToNextLevel: (user.level + 1) * 100,
      },
    });
  },

  // Warehouse actions
  sellProduct: (product: keyof Warehouse, amount: number) => {
    const { warehouse, addCoins } = get();
    if (warehouse[product] >= amount) {
      const price = product === 'onion' ? 3 : 0; // 3 coins per onion
      set({
        warehouse: {
          ...warehouse,
          [product]: warehouse[product] - amount,
        },
      });
      addCoins(price * amount);
    }
  },

  // UI actions
  setActiveTab: (tab: 'farm' | 'warehouse') => {
    set({ activeTab: tab });
  },

  startGame: () => {
    set({ isGameRunning: true });
  },

  stopGame: () => {
    set({ isGameRunning: false });
  },

  // Timer actions
  decrementTimer: () => {
    const { currentPlant, harvestPlant } = get();
    if (currentPlant && currentPlant.timeLeft > 0) {
      const newTimeLeft = currentPlant.timeLeft - 1;
      set({
        currentPlant: {
          ...currentPlant,
          timeLeft: newTimeLeft,
          isReady: newTimeLeft === 0,
        },
      });

      // Auto harvest when ready
      if (newTimeLeft === 0) {
        harvestPlant();
      }
    }
  },
}));
