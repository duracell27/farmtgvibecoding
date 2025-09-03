import { create } from 'zustand';
import { GameState, GameActions, Plant, User, Warehouse, PlantData, PlantType, FarmPlot, Achievement, AchievementType } from '@/types/game';

const initialUser: User = {
  id: '1',
  firstName: 'Тестовий',
  lastName: 'Користувач',
  username: 'test_user',
  avatarUrl: '',
  level: 1,
  experience: 0,
  experienceToNextLevel: 50, // Level 2 requires 50 exp
  coins: 10, // Start with 10 coins
  totalClicks: 0,
  totalHarvests: 0,
};

// Plant data configuration
export const PLANT_DATA: Record<PlantType, PlantData> = {
  dill: {
    type: 'dill',
    name: 'Кріп',
    image: '/images/dill.png',
    requiredLevel: 1,
    growTime: 15,
    buyPrice: 1,
    sellPrice: 2,
    experience: 3,
  },
  parsley: {
    type: 'parsley',
    name: 'Петрушка',
    image: '/images/parsley.png',
    requiredLevel: 2,
    growTime: 25,
    buyPrice: 3,
    sellPrice: 5,
    experience: 5,
  },
  onion: {
    type: 'onion',
    name: 'Цибуля',
    image: '/images/onion.png',
    requiredLevel: 3,
    growTime: 35,
    buyPrice: 4,
    sellPrice: 7,
    experience: 7,
  },
  cucumber: {
    type: 'cucumber',
    name: 'Огірок',
    image: '/images/cucumber.png',
    requiredLevel: 4,
    growTime: 60,
    buyPrice: 7,
    sellPrice: 13,
    experience: 15,
  },
  tomato: {
    type: 'tomato',
    name: 'Томати',
    image: '/images/tomato.png',
    requiredLevel: 5,
    growTime: 100,
    buyPrice: 12,
    sellPrice: 23,
    experience: 24,
  },
};

// Level experience requirements
export const LEVEL_EXPERIENCE_REQUIREMENTS = {
  2: 50,
  3: 75,
  4: 155,
  5: 280,
  6: 550,
};

// Achievement data configuration
export const ACHIEVEMENT_DATA: Record<AchievementType, Achievement> = {
  clicks: {
    type: 'clicks',
    name: 'Клікер',
    description: 'Кількість кліків',
    icon: '👆',
    levels: [
      { level: 1, requirement: 100, reward: 10, description: '100 кліків' },
      { level: 2, requirement: 500, reward: 25, description: '500 кліків' },
      { level: 3, requirement: 1000, reward: 50, description: '1,000 кліків' },
      { level: 4, requirement: 10000, reward: 300, description: '10,000 кліків' },
      { level: 5, requirement: 50000, reward: 1000, description: '50,000 кліків' },
      { level: 6, requirement: 100000, reward: 2500, description: '100,000 кліків' },
      { level: 7, requirement: 1000000, reward: 12500, description: '1,000,000 кліків' },
    ],
    currentLevel: 0,
    currentProgress: 0,
    claimedLevels: [],
  },
  harvests: {
    type: 'harvests',
    name: 'Збирач',
    description: 'Кількість зібраних урожаїв',
    icon: '🌾',
    levels: [
      { level: 1, requirement: 10, reward: 10, description: '10 урожаїв' },
      { level: 2, requirement: 50, reward: 25, description: '50 урожаїв' },
      { level: 3, requirement: 100, reward: 50, description: '100 урожаїв' },
      { level: 4, requirement: 1000, reward: 300, description: '1,000 урожаїв' },
      { level: 5, requirement: 5000, reward: 1000, description: '5,000 урожаїв' },
      { level: 6, requirement: 10000, reward: 2500, description: '10,000 урожаїв' },
      { level: 7, requirement: 100000, reward: 12500, description: '100,000 урожаїв' },
    ],
    currentLevel: 0,
    currentProgress: 0,
    claimedLevels: [],
  },
  plots: {
    type: 'plots',
    name: 'Землевласник',
    description: 'Кількість куплених грядок',
    icon: '🏡',
    levels: [
      { level: 1, requirement: 3, reward: 10, description: '3 грядки' },
      { level: 2, requirement: 5, reward: 25, description: '5 грядок' },
      { level: 3, requirement: 8, reward: 50, description: '8 грядок' },
      { level: 4, requirement: 12, reward: 300, description: '12 грядок' },
      { level: 5, requirement: 20, reward: 1000, description: '20 грядок' },
      { level: 6, requirement: 30, reward: 2500, description: '30 грядок' },
      { level: 7, requirement: 50, reward: 12500, description: '50 грядок' },
    ],
    currentLevel: 0,
    currentProgress: 0,
    claimedLevels: [],
  },
};

const initialWarehouse: Warehouse = {
  dill: 0,
  parsley: 0,
  onion: 0,
  cucumber: 0,
  tomato: 0,
};

const createPlant = (type: PlantType = 'dill'): Plant => {
  const plantData = PLANT_DATA[type];
  return {
    id: Date.now().toString(),
    type,
    timeLeft: plantData.growTime,
    totalTime: plantData.growTime,
    isReady: false,
    plantedAt: Date.now(),
  };
};

const createFarmPlot = (id: string, isUnlocked: boolean = false, unlockPrice: number = 0): FarmPlot => ({
  id,
  isUnlocked,
  plant: null,
  unlockPrice,
});

// Generate farm plots with original pricing (7 plots total)
const generateFarmPlots = (): FarmPlot[] => {
  const plots: FarmPlot[] = [];
  
  // First plot is free
  plots.push(createFarmPlot('plot-1', true, 0));
  
  // Original pricing for 7 plots
  const prices = [50, 250, 500, 1000, 3000, 5000];
  
  for (let i = 2; i <= 7; i++) {
    const unlockPrice = prices[i - 2];
    plots.push(createFarmPlot(`plot-${i}`, false, unlockPrice));
  }
  
  return plots;
};

// Helper function to calculate level progression with new requirements
const calculateLevelProgression = (currentLevel: number, currentExp: number, expToAdd: number) => {
  let newLevel = currentLevel;
  let newExp = currentExp + expToAdd;
  
  // Get experience requirement for next level
  const getExpForNextLevel = (level: number) => {
    return LEVEL_EXPERIENCE_REQUIREMENTS[level + 1 as keyof typeof LEVEL_EXPERIENCE_REQUIREMENTS] || 1000;
  };
  
  let newExpToNextLevel = getExpForNextLevel(newLevel);
  
  console.log('calculateLevelProgression: Starting calculation', {
    currentLevel,
    currentExp,
    expToAdd,
    newExp,
    newExpToNextLevel
  });
  
  // Check if we need to level up
  while (newExp >= newExpToNextLevel) {
    console.log('calculateLevelProgression: Leveling up!', {
      oldLevel: newLevel,
      newLevel: newLevel + 1,
      expBefore: newExp,
      expAfter: newExp - newExpToNextLevel
    });
    
    newExp -= newExpToNextLevel; // Subtract the experience needed for current level
    newLevel += 1;
    newExpToNextLevel = getExpForNextLevel(newLevel); // Update experience needed for next level
  }
  
  const result = {
    level: newLevel,
    experience: newExp,
    experienceToNextLevel: newExpToNextLevel,
  };
  
  console.log('calculateLevelProgression: Final result', result);
  
  return result;
};

export const useGameStore = create<GameState & GameActions>()((set, get) => ({
  // Initial state
  user: initialUser,
  currentPlant: null, // No current plant in new system
  warehouse: initialWarehouse,
  activeTab: 'farm',
  isGameRunning: false,
  isHarvesting: false,
  farmPlots: generateFarmPlots(),
  selectedPlantType: null,
  achievements: Object.values(ACHIEVEMENT_DATA),

  // Plant actions
  createNewPlant: () => {
    set({ currentPlant: createPlant() });
  },

  clickPlant: (plotId: string) => {
    const { farmPlots, isHarvesting, harvestPlant, user } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    // Increment total clicks
    set({ user: { ...user, totalClicks: user.totalClicks + 1 } });
    
    // Update achievements after click
    setTimeout(() => get().updateAchievements(), 0);
    
    if (plot && plot.plant && !isHarvesting) {
      if (plot.plant.timeLeft > 0) {
        const newTimeLeft = Math.max(0, plot.plant.timeLeft - 1);
        const updatedPlots = farmPlots.map(p => 
          p.id === plotId 
            ? { ...p, plant: { ...p.plant!, timeLeft: newTimeLeft, isReady: newTimeLeft === 0 } }
            : p
        );
        
        set({ farmPlots: updatedPlots });
        
        // If time reaches 0, harvest immediately
        if (newTimeLeft === 0) {
          harvestPlant(plotId);
        }
      } else if (plot.plant.isReady) {
        // If plant is ready, harvest it
        harvestPlant(plotId);
      }
    }
  },

  harvestPlant: (plotId: string) => {
    const { farmPlots, warehouse, user, isHarvesting, selectedPlantType } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (plot && plot.plant && plot.plant.isReady && !isHarvesting) {
      // Set harvesting flag to prevent multiple calls
      set({ isHarvesting: true });

      const plantData = PLANT_DATA[plot.plant.type];
      
      // Calculate new level progression
      const levelProgression = calculateLevelProgression(user.level, user.experience, plantData.experience);
      
      // Update all state at once to prevent flickering
      const newUser = {
        ...user,
        level: levelProgression.level,
        experience: levelProgression.experience,
        experienceToNextLevel: levelProgression.experienceToNextLevel,
        totalHarvests: user.totalHarvests + 1,
        // No coins for harvesting - only for selling in warehouse
      };

      // Update warehouse - add harvested plant to warehouse
      const newWarehouse = {
        ...warehouse,
        [plot.plant.type]: warehouse[plot.plant.type] + 1,
      };

      // Create new plant if we have a selected plant type and enough coins
      let newPlant = null;
      if (selectedPlantType) {
        const plantData = PLANT_DATA[selectedPlantType];
        if (newUser.coins >= plantData.buyPrice) {
          newPlant = createPlant(selectedPlantType);
          // Deduct coins for auto-planting
          newUser.coins -= plantData.buyPrice;
        }
      }

      // Update farm plots
      const updatedPlots = farmPlots.map(p => 
        p.id === plotId 
          ? { ...p, plant: newPlant }
          : p
      );

      set({
        warehouse: newWarehouse,
        user: newUser,
        farmPlots: updatedPlots,
        isHarvesting: false,
      });
      
      // Update achievements after harvest
      setTimeout(() => get().updateAchievements(), 0);

      // Force state update for Telegram WebApp
      setTimeout(() => {
        const state = get();
        set({ ...state });
      }, 100);
    }
  },

  plantSeed: (plotId: string, plantType: PlantType) => {
    const { farmPlots, user } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    const plantData = PLANT_DATA[plantType];
    
    console.log('plantSeed called:', {
      plotId,
      plantType,
      plot: plot ? { id: plot.id, isUnlocked: plot.isUnlocked, hasPlant: !!plot.plant } : null,
      userCoins: user.coins,
      plantPrice: plantData.buyPrice,
      canAfford: user.coins >= plantData.buyPrice
    });
    
    if (plot && plot.isUnlocked && !plot.plant && user.coins >= plantData.buyPrice) {
      console.log('Planting seed - deducting coins:', {
        before: user.coins,
        price: plantData.buyPrice,
        after: user.coins - plantData.buyPrice
      });
      
      const newPlant = createPlant(plantType);
      
      const updatedPlots = farmPlots.map(p => 
        p.id === plotId 
          ? { ...p, plant: newPlant }
          : p
      );

      set({
        farmPlots: updatedPlots,
        user: {
          ...user,
          coins: user.coins - plantData.buyPrice, // Deduct plant cost when planting
        },
      });

      // Force state update for Telegram WebApp
      setTimeout(() => {
        const state = get();
        set({ ...state });
      }, 100);
    } else {
      console.log('Cannot plant seed - conditions not met:', {
        plotExists: !!plot,
        plotUnlocked: plot?.isUnlocked,
        plotEmpty: !plot?.plant,
        hasEnoughCoins: user.coins >= plantData.buyPrice
      });
    }
  },

  // User actions
  addExperience: (amount: number) => {
    const { user } = get();
    
    // Calculate new level progression
    const levelProgression = calculateLevelProgression(user.level, user.experience, amount);

    set({
      user: {
        ...user,
        level: levelProgression.level,
        experience: levelProgression.experience,
        experienceToNextLevel: levelProgression.experienceToNextLevel,
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
    
    // Calculate new level progression (manual level up)
    const levelProgression = calculateLevelProgression(user.level, user.experience, 0);
    
    set({
      user: {
        ...user,
        level: levelProgression.level + 1,
        experience: 0,
        experienceToNextLevel: (levelProgression.level + 1) * 100,
      },
    });
  },

  // Warehouse actions
  sellProduct: (product: keyof Warehouse, amount: number) => {
    const { warehouse, user } = get();
    if (warehouse[product] >= amount) {
      // Find the plant data to get sell price
      const plantType = product as PlantType;
      const plantData = PLANT_DATA[plantType];
      const totalCoins = plantData.sellPrice * amount;
      
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

  // Farm actions
  unlockPlot: (plotId: string) => {
    const { farmPlots, user } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (plot && !plot.isUnlocked && user.coins >= plot.unlockPrice) {
      const updatedPlots = farmPlots.map(p => 
        p.id === plotId 
          ? { ...p, isUnlocked: true }
          : p
      );

      set({
        farmPlots: updatedPlots,
        user: {
          ...user,
          coins: user.coins - plot.unlockPrice,
        },
      });
      
      // Update achievements after unlocking plot
      setTimeout(() => get().updateAchievements(), 0);
    }
  },

  selectPlantType: (plantType: PlantType | null) => {
    set({ selectedPlantType: plantType });
  },

  // UI actions
  setActiveTab: (tab: 'farm' | 'warehouse' | 'achievements') => {
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
    const { farmPlots, harvestPlant, isHarvesting } = get();
    
    // Update all plants on all plots
    const updatedPlots = farmPlots.map(plot => {
      if (plot.plant && plot.plant.timeLeft > 0 && !isHarvesting) {
        const newTimeLeft = plot.plant.timeLeft - 1;
        const updatedPlant = {
          ...plot.plant,
          timeLeft: newTimeLeft,
          isReady: newTimeLeft === 0,
        };
        
        // Auto harvest when ready (only once)
        if (newTimeLeft === 0) {
          setTimeout(() => {
            harvestPlant(plot.id);
          }, 0);
        }
        
        return { ...plot, plant: updatedPlant };
      }
      return plot;
    });
    
    set({ farmPlots: updatedPlots });
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

  // Achievement actions
  claimAchievementReward: (achievementType: AchievementType, level: number) => {
    const { achievements, user } = get();
    const achievement = achievements.find(a => a.type === achievementType);
    
    if (!achievement) return;
    
    const levelData = achievement.levels.find(l => l.level === level);
    if (!levelData || achievement.claimedLevels.includes(level)) return;
    
    // Check if user has reached this level
    let currentProgress = 0;
    switch (achievementType) {
      case 'clicks':
        currentProgress = user.totalClicks;
        break;
      case 'harvests':
        currentProgress = user.totalHarvests;
        break;
      case 'plots':
        currentProgress = get().farmPlots.filter(p => p.isUnlocked).length;
        break;
    }
    
    if (currentProgress >= levelData.requirement) {
      // Add reward coins
      set({ 
        user: { ...user, coins: user.coins + levelData.reward },
        achievements: achievements.map(a => 
          a.type === achievementType 
            ? { ...a, claimedLevels: [...a.claimedLevels, level] }
            : a
        )
      });
    }
  },

  updateAchievements: () => {
    const { achievements, user, farmPlots } = get();
    
    const updatedAchievements = achievements.map(achievement => {
      let currentProgress = 0;
      let currentLevel = 0;
      
      switch (achievement.type) {
        case 'clicks':
          currentProgress = user.totalClicks;
          break;
        case 'harvests':
          currentProgress = user.totalHarvests;
          break;
        case 'plots':
          currentProgress = farmPlots.filter(p => p.isUnlocked).length;
          break;
      }
      
      // Find current level based on progress
      for (let i = achievement.levels.length - 1; i >= 0; i--) {
        if (currentProgress >= achievement.levels[i].requirement) {
          currentLevel = achievement.levels[i].level;
          break;
        }
      }
      
      return {
        ...achievement,
        currentLevel,
        currentProgress,
      };
    });
    
    set({ achievements: updatedAchievements });
  },
}));
