import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
  // Initial state
  user: initialUser,
  currentPlant: createPlant(),
  warehouse: initialWarehouse,
  activeTab: 'farm',
  isGameRunning: false,
  isHarvesting: false,

  // Plant actions
  createNewPlant: () => {
    set({ currentPlant: createPlant() });
  },

  clickPlant: () => {
    const { currentPlant, isHarvesting, harvestPlant } = get();
    if (currentPlant && !isHarvesting) {
      if (currentPlant.timeLeft > 0) {
        const newTimeLeft = Math.max(0, currentPlant.timeLeft - 1);
        set({
          currentPlant: {
            ...currentPlant,
            timeLeft: newTimeLeft,
            isReady: newTimeLeft === 0,
          },
        });
        
        // If time reaches 0, harvest immediately
        if (newTimeLeft === 0) {
          harvestPlant();
        }
      } else if (currentPlant.isReady) {
        // If plant is ready, harvest it
        harvestPlant();
      }
    }
  },

  harvestPlant: () => {
    const { currentPlant, warehouse, user, isHarvesting } = get();
    if (currentPlant && currentPlant.isReady && !isHarvesting) {
      // Set harvesting flag to prevent multiple calls
      set({ isHarvesting: true });

      // Update all state at once to prevent flickering
      const newUser = {
        ...user,
        experience: user.experience + 10,
        coins: user.coins + 5,
      };

      set({
        warehouse: {
          ...warehouse,
          onion: warehouse.onion + 1,
        },
        user: newUser,
        currentPlant: createPlant(),
        isHarvesting: false,
      });

      // Force state update for Telegram WebApp
      setTimeout(() => {
        const state = get();
        set({ ...state });
      }, 100);
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
    const { warehouse, user } = get();
    if (warehouse[product] >= amount) {
      const price = product === 'onion' ? 3 : 0; // 3 coins per onion
      const totalCoins = price * amount;
      
      // Update warehouse and coins at once to prevent flickering
      set({
        warehouse: {
          ...warehouse,
          [product]: warehouse[product] - amount,
        },
        user: {
          ...user,
          coins: user.coins + totalCoins,
        },
      });

      // Force state update for Telegram WebApp
      setTimeout(() => {
        const state = get();
        set({ ...state });
      }, 100);
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
    const { currentPlant, harvestPlant, isHarvesting } = get();
    if (currentPlant && currentPlant.timeLeft > 0 && !isHarvesting) {
      const newTimeLeft = currentPlant.timeLeft - 1;
      set({
        currentPlant: {
          ...currentPlant,
          timeLeft: newTimeLeft,
          isReady: newTimeLeft === 0,
        },
      });

      // Auto harvest when ready (only once)
      if (newTimeLeft === 0) {
        // Use setTimeout to ensure state is updated before harvesting
        setTimeout(() => {
          harvestPlant();
        }, 0);
      }
    }
  },

  // Force state update for Telegram WebApp
  forceStateUpdate: () => {
    const state = get();
    console.log('forceStateUpdate: Forcing state update', {
      user: state.user,
      warehouse: state.warehouse,
      currentPlant: state.currentPlant
    });
    set({ ...state });
  },
    }),
    {
      name: 'farm-game-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential game data, not UI state
      partialize: (state) => ({
        user: state.user,
        warehouse: state.warehouse,
        currentPlant: state.currentPlant,
      }),
    }
  )
);
