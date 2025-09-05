import { create } from 'zustand';
import { GameState, GameActions, Plant, User, Warehouse, PlantData, PlantType, FarmPlot, Achievement, AchievementType, RatingType, FertilizerType, FertilizerData } from '@/types/game';
import { getApiUrl } from '@/lib/api';

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
  totalWaterings: 0,
  totalFertilizers: 0,
};

// Fertilizer data configuration
export const FERTILIZER_DATA: Record<FertilizerType, FertilizerData> = {
  humus: {
    type: 'humus',
    name: 'Гум\'юс',
    image: '/images/fertilizer/gumus.png',
    requiredLevel: 1,
    timeReduction: 15, // 15 minutes
    price: 50,
    experience: 15,
    description: 'Базове органічне добриво, що ідеально підходить для прискорення росту ранніх культур.',
  },
  azofoska: {
    type: 'azofoska',
    name: 'Азофоска',
    image: '/images/fertilizer/azofoska.png',
    requiredLevel: 10,
    timeReduction: 45, // 45 minutes
    price: 200,
    experience: 50,
    description: 'Комплексне добриво, що значно прискорює ріст рослин на середніх етапах гри.',
  },
  pidsilivach: {
    type: 'pidsilivach',
    name: 'Підсилювач',
    image: '/images/fertilizer/pidsilivach.png',
    requiredLevel: 15,
    timeReduction: 180, // 3 hours
    price: 800,
    experience: 500,
    description: 'Потужна суміш для швидкого отримання врожаю від довгозростаючих культур.',
  },
  katalizator: {
    type: 'katalizator',
    name: 'Каталізатор',
    image: '/images/fertilizer/katalizator.png',
    requiredLevel: 20,
    timeReduction: 420, // 7 hours
    price: 2000,
    experience: 1000,
    description: 'Екстремально ефективний комплекс, який дозволяє отримати фінальний врожай майже миттєво.',
  },
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
  waterings: {
    type: 'waterings',
    name: 'Поливальник',
    description: 'Кількість поливів',
    icon: '💧',
    levels: [
      { level: 1, requirement: 10, reward: 10, description: '10 поливів' },
      { level: 2, requirement: 50, reward: 25, description: '50 поливів' },
      { level: 3, requirement: 100, reward: 50, description: '100 поливів' },
      { level: 4, requirement: 1000, reward: 300, description: '1,000 поливів' },
      { level: 5, requirement: 5000, reward: 1000, description: '5,000 поливів' },
      { level: 6, requirement: 10000, reward: 2500, description: '10,000 поливів' },
      { level: 7, requirement: 100000, reward: 12500, description: '100,000 поливів' },
    ],
    currentLevel: 0,
    currentProgress: 0,
    claimedLevels: [],
  },
  fertilizers: {
    type: 'fertilizers',
    name: 'Агроном',
    description: 'Кількість використаних добрив',
    icon: '🌿',
    levels: [
      { level: 1, requirement: 5, reward: 25, description: '5 добрив' },
      { level: 2, requirement: 25, reward: 100, description: '25 добрив' },
      { level: 3, requirement: 50, reward: 250, description: '50 добрив' },
      { level: 4, requirement: 100, reward: 500, description: '100 добрив' },
      { level: 5, requirement: 250, reward: 1000, description: '250 добрив' },
      { level: 6, requirement: 500, reward: 2500, description: '500 добрив' },
      { level: 7, requirement: 1000, reward: 5000, description: '1,000 добрив' },
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
  const now = Date.now();
  return {
    id: now.toString(),
    type,
    timeLeft: plantData.growTime,
    totalTime: plantData.growTime,
    isReady: false,
    plantedAt: now,
    lastWateredAt: now, // Start cooldown immediately after planting
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

// Helper function to calculate level reward using formula M = 10 × 1.40^(L-1)
const calculateLevelReward = (level: number): number => {
  return Math.floor(10 * Math.pow(1.40, level - 1));
};

// Helper function to get newly unlocked plant type for a level
const getNewlyUnlockedPlant = (newLevel: number): PlantType | null => {
  const plantEntries = Object.entries(PLANT_DATA) as [PlantType, PlantData][];
  const newlyUnlocked = plantEntries.find(([, plantData]) => plantData.requiredLevel === newLevel);
  return newlyUnlocked ? newlyUnlocked[0] : null;
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
  
  
  // Check if we need to level up
  while (newExp >= newExpToNextLevel) {
    
    newExp -= newExpToNextLevel; // Subtract the experience needed for current level
    newLevel += 1;
    newExpToNextLevel = getExpForNextLevel(newLevel); // Update experience needed for next level
  }
  
  const result = {
    level: newLevel,
    experience: newExp,
    experienceToNextLevel: newExpToNextLevel,
  };
  
  
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
  selectedFertilizerType: null,
  achievements: Object.values(ACHIEVEMENT_DATA),
  syncStatus: 'idle',
  lastSyncTime: null,
  ratingData: null,
  activeRatingType: 'level',
  levelUpModal: {
    isOpen: false,
    newLevel: 1,
    newPlantType: null,
    rewardCoins: 0,
  },

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
    const { farmPlots, warehouse, user, isHarvesting, selectedPlantType, showLevelUpModal } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (plot && plot.plant && plot.plant.isReady && !isHarvesting) {
      // Set harvesting flag to prevent multiple calls
      set({ isHarvesting: true });

      const plantData = PLANT_DATA[plot.plant.type];
      
      // Calculate new level progression
      const levelProgression = calculateLevelProgression(user.level, user.experience, plantData.experience);
      
      // Check if user leveled up
      const leveledUp = levelProgression.level > user.level;
      let rewardCoins = 0;
      let newPlantType: PlantType | null = null;
      
      if (leveledUp) {
        // Calculate reward coins using formula M = 10 × 1.40^(L-1)
        rewardCoins = calculateLevelReward(levelProgression.level);
        // Get newly unlocked plant
        newPlantType = getNewlyUnlockedPlant(levelProgression.level);
      }
      
      // Update all state at once to prevent flickering
      const newUser = {
        ...user,
        level: levelProgression.level,
        experience: levelProgression.experience,
        experienceToNextLevel: levelProgression.experienceToNextLevel,
        totalHarvests: user.totalHarvests + 1,
        coins: user.coins + rewardCoins, // Add reward coins
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
      
      // Show level up modal if user leveled up
      if (leveledUp) {
        setTimeout(() => {
          showLevelUpModal(levelProgression.level, newPlantType, rewardCoins);
        }, 500); // Small delay to ensure state is updated
      }
      
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
    
    
    if (plot && plot.isUnlocked && !plot.plant && user.coins >= plantData.buyPrice) {
      
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
    }
  },

  waterPlant: (plotId: string) => {
    const { farmPlots, user, addExperience, harvestPlant } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (!plot || !plot.plant || plot.plant.isReady) return;
    
    const now = Date.now();
    const WATERING_COOLDOWN = 15000; // 15 seconds in milliseconds
    const WATERING_EXPERIENCE = 10;
    const WATERING_TIME_REDUCTION = 15; // seconds
    
    // Check if enough time has passed since last watering
    if (now - plot.plant.lastWateredAt < WATERING_COOLDOWN) {
      return; // Still in cooldown
    }
    
    // Reduce plant time by 15 seconds (but not below 0)
    const newTimeLeft = Math.max(0, plot.plant.timeLeft - WATERING_TIME_REDUCTION);
    
    // Update plant with new time and last watered timestamp
    const updatedPlant = {
      ...plot.plant,
      timeLeft: newTimeLeft,
      isReady: newTimeLeft === 0,
      lastWateredAt: now,
    };
    
    // Update farm plots
    const updatedPlots = farmPlots.map(p => 
      p.id === plotId 
        ? { ...p, plant: updatedPlant }
        : p
    );
    
    // Add experience and increment watering count
    const newUser = {
      ...user,
      totalWaterings: user.totalWaterings + 1,
    };
    
    set({
      farmPlots: updatedPlots,
      user: newUser,
    });
    
    // Add experience
    addExperience(WATERING_EXPERIENCE);
    
    // If plant is ready after watering, harvest it immediately
    if (newTimeLeft === 0) {
      setTimeout(() => {
        harvestPlant(plotId);
      }, 100); // Small delay to ensure state is updated
    }
    
    // Update achievements
    setTimeout(() => get().updateAchievements(), 0);
    
    // Force state update for Telegram WebApp
    setTimeout(() => {
      const state = get();
      set({ ...state });
    }, 100);
  },

  clearPlot: (plotId: string) => {
    const { farmPlots } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (plot && plot.plant) {
      // Clear the plant from the plot
      const updatedPlots = farmPlots.map(p => 
        p.id === plotId 
          ? { ...p, plant: null }
          : p
      );
      
      set({ farmPlots: updatedPlots });
      
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

  selectFertilizerType: (fertilizerType: FertilizerType | null) => {
    set({ selectedFertilizerType: fertilizerType });
    
    // Auto-save when fertilizer type changes
    setTimeout(() => {
      get().saveGameState();
    }, 100);
  },

  applyFertilizer: (plotId: string, fertilizerType: FertilizerType) => {
    const { farmPlots, user, addExperience } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    const fertilizerData = FERTILIZER_DATA[fertilizerType];
    
    if (plot && plot.plant && !plot.plant.isReady && !plot.plant.fertilizerApplied && user.coins >= fertilizerData.price) {
      const now = Date.now();
      const FERTILIZER_DELAY = 120000; // 2 minutes after planting
      
      // Check if 2 minutes have passed since planting
      const timeSincePlanting = now - plot.plant.plantedAt;
      if (timeSincePlanting < FERTILIZER_DELAY) {
        return; // Cannot use fertilizer yet
      }
      
      // Convert minutes to seconds for time reduction
      const timeReductionSeconds = fertilizerData.timeReduction * 60;
      const newTimeLeft = Math.max(0, plot.plant.timeLeft - timeReductionSeconds);
      
      const updatedPlant = {
        ...plot.plant,
        timeLeft: newTimeLeft,
        isReady: newTimeLeft === 0,
        fertilizerApplied: fertilizerType,
        lastFertilizedAt: now,
      };
      
      const updatedPlots = farmPlots.map(p => 
        p.id === plotId 
          ? { ...p, plant: updatedPlant }
          : p
      );
      
      set({
        farmPlots: updatedPlots,
        user: {
          ...user,
          coins: user.coins - fertilizerData.price,
          totalFertilizers: user.totalFertilizers + 1,
        },
      });
      
      // Add experience for using fertilizer
      addExperience(fertilizerData.experience);
      
      // Update achievements after using fertilizer
      setTimeout(() => get().updateAchievements(), 0);
      
      // If plant is ready after applying fertilizer, harvest it
      if (newTimeLeft === 0) {
        setTimeout(() => {
          get().harvestPlant(plotId);
        }, 100);
      }
      
      // Force state update for Telegram WebApp
      setTimeout(() => {
        const state = get();
        set({ ...state });
      }, 100);
    }
  },

  // UI actions
  setActiveTab: (tab: 'farm' | 'warehouse' | 'achievements' | 'rating') => {
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
        case 'waterings':
          currentProgress = user.totalWaterings;
          break;
        case 'fertilizers':
          currentProgress = user.totalFertilizers;
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
        case 'waterings':
          currentProgress = user.totalWaterings;
          break;
        case 'fertilizers':
          currentProgress = user.totalFertilizers;
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

  // Database sync actions
  saveGameState: async () => {
    const state = get();
    
    // For testing purposes, allow test user ID '1' to work in development
    const isTestMode = process.env.NODE_ENV === 'development';
    
    if (!state.user.id) {
      return;
    }
    
    // In production, only allow real Telegram user IDs (numeric strings)
    if (!isTestMode && (state.user.id === '1' || isNaN(Number(state.user.id)))) {
      return;
    }

    try {
      set({ syncStatus: 'saving' });
      
      const response = await fetch(getApiUrl('/api/game/save'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        await response.json();
        set({ 
          syncStatus: 'idle',
          lastSyncTime: Date.now()
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('saveGameState: Error', error);
      set({ syncStatus: 'error' });
    }
  },

  loadGameState: async () => {
    const { user } = get();
    
    // For testing purposes, allow test user ID '1' to work in development
    const isTestMode = process.env.NODE_ENV === 'development';
    
    if (!user.id) {
      return;
    }
    
    // In production, only allow real Telegram user IDs (numeric strings)
    if (!isTestMode && (user.id === '1' || isNaN(Number(user.id)))) {
      return;
    }

    try {
      set({ syncStatus: 'loading' });
      
      const response = await fetch(getApiUrl(`/api/game/load?userId=${user.id}`));
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.gameState) {
          // Merge saved state with current state, preserving some local state
          const currentState = get();
          const savedState = result.gameState;
          
          // Ensure all achievement types are present (for backward compatibility)
          const mergedAchievements = Object.values(ACHIEVEMENT_DATA).map(defaultAchievement => {
            const savedAchievement = savedState.achievements?.find((a: Achievement) => a.type === defaultAchievement.type);
            if (savedAchievement) {
              // Use saved achievement data but ensure all required fields exist
              return {
                ...defaultAchievement,
                currentLevel: savedAchievement.currentLevel || 0,
                currentProgress: savedAchievement.currentProgress || 0,
                claimedLevels: savedAchievement.claimedLevels || [],
              };
            }
            // Use default achievement if not found in saved data
            return defaultAchievement;
          });
          
          set({
            user: savedState.user,
            warehouse: savedState.warehouse,
            farmPlots: savedState.farmPlots,
            achievements: mergedAchievements,
            // Restore saved UI state
            activeTab: savedState.activeTab || currentState.activeTab,
            selectedPlantType: savedState.selectedPlantType || currentState.selectedPlantType,
            selectedFertilizerType: savedState.selectedFertilizerType || currentState.selectedFertilizerType,
            syncStatus: 'idle',
            lastSyncTime: Date.now()
          });
          
          // Update achievements after loading to ensure progress is calculated correctly
          setTimeout(() => {
            get().updateAchievements();
          }, 100);
        } else {
          set({ syncStatus: 'idle' });
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('loadGameState: Error', error);
      set({ syncStatus: 'error' });
    }
  },

  setSyncStatus: (status: 'idle' | 'saving' | 'loading' | 'error') => {
    set({ syncStatus: status });
  },

  // Rating actions
  loadRatingData: async (type: RatingType) => {
    try {
      set({ syncStatus: 'loading' });
      
      const response = await fetch(getApiUrl(`/api/rating?type=${type}&limit=50`));
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          set({ 
            ratingData: result.data,
            activeRatingType: type,
            syncStatus: 'idle'
          });
        } else {
          set({ syncStatus: 'idle' });
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('loadRatingData: Error', error);
      set({ syncStatus: 'error' });
    }
  },

  setActiveRatingType: (type: RatingType) => {
    set({ activeRatingType: type });
  },

  // Level up modal actions
  showLevelUpModal: (newLevel: number, newPlantType: PlantType | null, rewardCoins: number) => {
    set({
      levelUpModal: {
        isOpen: true,
        newLevel,
        newPlantType,
        rewardCoins,
      },
    });
  },

  closeLevelUpModal: () => {
    set({
      levelUpModal: {
        isOpen: false,
        newLevel: 1,
        newPlantType: null,
        rewardCoins: 0,
      },
    });
  },
}));
