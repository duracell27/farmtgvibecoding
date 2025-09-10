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
  experienceToNextLevel: 25, // Level 2 requires 25 exp
  coins: 10, // Start with 10 coins
  emeralds: 10, // Start with 10 emeralds
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
  "redis": {"type":"redis","name":"Редис","image":"/images/seeds/редис.png","requiredLevel":1,"growTime":15,"buyPrice":1,"sellPrice":2,"experience":3,"fruitsPerHarvest":1},
  "kres-salat": {"type":"kres-salat","name":"Кресс-салат","image":"/images/seeds/крес-салат.png","requiredLevel":2,"growTime":25,"buyPrice":3,"sellPrice":5,"experience":5,"fruitsPerHarvest":1},
  "shpynat": {"type":"shpynat","name":"Шпинат","image":"/images/seeds/шпинат.png","requiredLevel":3,"growTime":40,"buyPrice":6,"sellPrice":21,"experience":14,"fruitsPerHarvest":1},
  "rukola": {"type":"rukola","name":"Рукола","image":"/images/seeds/рукола.png","requiredLevel":4,"growTime":60,"buyPrice":10,"sellPrice":50,"experience":37,"fruitsPerHarvest":1},
  "latuk": {"type":"latuk","name":"Латук","image":"/images/seeds/салат.png","requiredLevel":5,"growTime":125,"buyPrice":18,"sellPrice":90,"experience":74,"fruitsPerHarvest":1},
  "zelena-tsybulya": {"type":"zelena-tsybulya","name":"Зелена цибуля","image":"/images/seeds/зелена-цибуля.png","requiredLevel":6,"growTime":226,"buyPrice":28,"sellPrice":129,"experience":126,"fruitsPerHarvest":2},
  "krip": {"type":"krip","name":"Кріп","image":"/images/seeds/кріп.png","requiredLevel":7,"growTime":362,"buyPrice":42,"sellPrice":156,"experience":190,"fruitsPerHarvest":2},
  "petrushka": {"type":"petrushka","name":"Петрушка","image":"/images/seeds/петрушка.png","requiredLevel":8,"growTime":538,"buyPrice":60,"sellPrice":180,"experience":267,"fruitsPerHarvest":2},
  "bazylik": {"type":"bazylik","name":"Базилік","image":"/images/seeds/базилік.png","requiredLevel":9,"growTime":786,"buyPrice":80,"sellPrice":251,"experience":349,"fruitsPerHarvest":2},
  "koriandr": {"type":"koriandr","name":"Коріандр","image":"/images/seeds/коріандр.png","requiredLevel":10,"growTime":1134,"buyPrice":104,"sellPrice":332,"experience":437,"fruitsPerHarvest":2},
  "morkva": {"type":"morkva","name":"Морква","image":"/images/seeds/морква.png","requiredLevel":11,"growTime":1570,"buyPrice":132,"sellPrice":391,"experience":538,"fruitsPerHarvest":3},
  "buryak": {"type":"buryak","name":"Буряк","image":"/images/seeds/буряк.png","requiredLevel":12,"growTime":2090,"buyPrice":164,"sellPrice":429,"experience":646,"fruitsPerHarvest":3},
  "horokh": {"type":"horokh","name":"Горох","image":"/images/seeds/горох.png","requiredLevel":13,"growTime":2688,"buyPrice":200,"sellPrice":459,"experience":766,"fruitsPerHarvest":3},
  "kvasolia": {"type":"kvasolia","name":"Квасоля","image":"/images/seeds/квасоля.png","requiredLevel":14,"growTime":3412,"buyPrice":240,"sellPrice":504,"experience":894,"fruitsPerHarvest":3},
  "ohirok": {"type":"ohirok","name":"Огірки","image":"/images/seeds/огірок.png","requiredLevel":15,"growTime":4241,"buyPrice":282,"sellPrice":533,"experience":1031,"fruitsPerHarvest":3},
  "kabachok": {"type":"kabachok","name":"Кабачки","image":"/images/seeds/кабачок.png","requiredLevel":16,"growTime":5198,"buyPrice":325,"sellPrice":555,"experience":1175,"fruitsPerHarvest":4},
  "polunytsya": {"type":"polunytsya","name":"Полуниця","image":"/images/seeds/полуниця.png","requiredLevel":17,"growTime":6308,"buyPrice":370,"sellPrice":604,"experience":1328,"fruitsPerHarvest":4},
  "brokoli": {"type":"brokoli","name":"Броколі","image":"/images/seeds/броколі.png","requiredLevel":18,"growTime":7562,"buyPrice":419,"sellPrice":662,"experience":1488,"fruitsPerHarvest":4},
  "kolrabi": {"type":"kolrabi","name":"Кольрабі","image":"/images/seeds/кольрабі.png","requiredLevel":19,"growTime":8930,"buyPrice":471,"sellPrice":709,"experience":1660,"fruitsPerHarvest":4},
  "cvitna-kapusta": {"type":"cvitna-kapusta","name":"Цвітна капуста","image":"/images/seeds/цвітна-капуста.png","requiredLevel":20,"growTime":10438,"buyPrice":526,"sellPrice":772,"experience":1842,"fruitsPerHarvest":4},
  "khrin": {"type":"khrin","name":"Хрін","image":"/images/seeds/хрін.png","requiredLevel":21,"growTime":12051,"buyPrice":586,"sellPrice":810,"experience":2034,"fruitsPerHarvest":5},
  "chasnyk": {"type":"chasnyk","name":"Часник","image":"/images/seeds/часник.png","requiredLevel":22,"growTime":13884,"buyPrice":648,"sellPrice":873,"experience":2239,"fruitsPerHarvest":5},
  "fenkhel": {"type":"fenkhel","name":"Фенхель","image":"/images/seeds/фенхель.png","requiredLevel":23,"growTime":15924,"buyPrice":713,"sellPrice":932,"experience":2454,"fruitsPerHarvest":5},
  "pasternak": {"type":"pasternak","name":"Пастернак","image":"/images/seeds/пастернак.png","requiredLevel":24,"growTime":18132,"buyPrice":781,"sellPrice":994,"experience":2681,"fruitsPerHarvest":5},
  "pomidor": {"type":"pomidor","name":"Помідори","image":"/images/seeds/томат.png","requiredLevel":25,"growTime":20565,"buyPrice":854,"sellPrice":1027,"experience":2913,"fruitsPerHarvest":5},
  "perets-solodkyi": {"type":"perets-solodkyi","name":"Перець солодкий","image":"/images/seeds/перець.png","requiredLevel":26,"growTime":23128,"buyPrice":933,"sellPrice":1072,"experience":3160,"fruitsPerHarvest":6},
  "baklazhany": {"type":"baklazhany","name":"Баклажани","image":"/images/seeds/баклажан.png","requiredLevel":27,"growTime":25826,"buyPrice":1020,"sellPrice":1115,"experience":3413,"fruitsPerHarvest":6},
  "kukurudza": {"type":"kukurudza","name":"Кукурудза","image":"/images/seeds/кукурудза.png","requiredLevel":28,"growTime":28692,"buyPrice":1114,"sellPrice":1159,"experience":3679,"fruitsPerHarvest":6},
  "dynya": {"type":"dynya","name":"Диня","image":"/images/seeds/диня.png","requiredLevel":29,"growTime":31819,"buyPrice":1218,"sellPrice":1190,"experience":3950,"fruitsPerHarvest":6},
  "kartoplya": {"type":"kartoplya","name":"Картопля","image":"/images/seeds/картопля.png","requiredLevel":30,"growTime":35156,"buyPrice":1330,"sellPrice":1247,"experience":4228,"fruitsPerHarvest":6},
  "kapusta-bilogolova": {"type":"kapusta-bilogolova","name":"Капуста білоголова","image":"/images/seeds/капуста.png","requiredLevel":31,"growTime":38741,"buyPrice":1451,"sellPrice":1285,"experience":4511,"fruitsPerHarvest":7},
  "sonyashnyk": {"type":"sonyashnyk","name":"Соняшник","image":"/images/seeds/соняшник.png","requiredLevel":32,"growTime":42646,"buyPrice":1575,"sellPrice":1328,"experience":4807,"fruitsPerHarvest":7},
  "harbuz": {"type":"harbuz","name":"Гарбуз","image":"/images/seeds/гарбуз.png","requiredLevel":33,"growTime":46782,"buyPrice":1705,"sellPrice":1386,"experience":5108,"fruitsPerHarvest":7},
  "kavuny": {"type":"kavuny","name":"Кавуни","image":"/images/seeds/кавун.png","requiredLevel":34,"growTime":51088,"buyPrice":1838,"sellPrice":1432,"experience":5420,"fruitsPerHarvest":7},
  "sochevytsya": {"type":"sochevytsya","name":"Сочевиця","image":"/images/seeds/сочевиця.png","requiredLevel":35,"growTime":55744,"buyPrice":1974,"sellPrice":1504,"experience":5743,"fruitsPerHarvest":7},
  "nut": {"type":"nut","name":"Нут","image":"/images/seeds/нут.png","requiredLevel":36,"growTime":60724,"buyPrice":2114,"sellPrice":1538,"experience":6079,"fruitsPerHarvest":8},
  "hirchytsya": {"type":"hirchytsya","name":"Гірчиця","image":"/images/seeds/гірчиця.png","requiredLevel":37,"growTime":66074,"buyPrice":2260,"sellPrice":1595,"experience":6428,"fruitsPerHarvest":8},
  "chervonyi-rys": {"type":"chervonyi-rys","name":"Червоний рис","image":"/images/seeds/червоний-рис.png","requiredLevel":38,"growTime":71804,"buyPrice":2413,"sellPrice":1654,"experience":6788,"fruitsPerHarvest":8},
  "selera": {"type":"selera","name":"Селера","image":"/images/seeds/селера.png","requiredLevel":39,"growTime":77807,"buyPrice":2572,"sellPrice":1705,"experience":7163,"fruitsPerHarvest":8},
  "soya": {"type":"soya","name":"Соя","image":"/images/seeds/соя.png","requiredLevel":40,"growTime":84010,"buyPrice":2739,"sellPrice":1747,"experience":7550,"fruitsPerHarvest":8},
  "lon": {"type":"lon","name":"Льон","image":"/images/seeds/льон.png","requiredLevel":41,"growTime":90459,"buyPrice":2910,"sellPrice":1808,"experience":7950,"fruitsPerHarvest":9},
  "hrechka": {"type":"hrechka","name":"Гречка","image":"/images/seeds/гречка.png","requiredLevel":42,"growTime":97160,"buyPrice":3091,"sellPrice":1833,"experience":8356,"fruitsPerHarvest":9},
  "yachmin": {"type":"yachmin","name":"Ячмінь","image":"/images/seeds/ячмінь.png","requiredLevel":43,"growTime":104119,"buyPrice":3280,"sellPrice":1906,"experience":8775,"fruitsPerHarvest":9},
  "oves": {"type":"oves","name":"Овес","image":"/images/seeds/овес.png","requiredLevel":44,"growTime":111386,"buyPrice":3478,"sellPrice":1937,"experience":9200,"fruitsPerHarvest":9},
  "artyshok": {"type":"artyshok","name":"Артишок","image":"/images/seeds/артишок.png","requiredLevel":45,"growTime":119058,"buyPrice":3679,"sellPrice":1973,"experience":9630,"fruitsPerHarvest":9},
  "shafran": {"type":"shafran","name":"Шафран","image":"/images/seeds/шафран.png","requiredLevel":46,"growTime":127006,"buyPrice":3888,"sellPrice":1997,"experience":10067,"fruitsPerHarvest":10},
  "proso": {"type":"proso","name":"Просо","image":"/images/seeds/просо.png","requiredLevel":47,"growTime":135283,"buyPrice":4106,"sellPrice":2031,"experience":10513,"fruitsPerHarvest":10},
  "imbir": {"type":"imbir","name":"Імбир","image":"/images/seeds/імбир.png","requiredLevel":48,"growTime":143944,"buyPrice":4333,"sellPrice":2066,"experience":10973,"fruitsPerHarvest":10},
  "kurkuma": {"type":"kurkuma","name":"Куркума","image":"/images/seeds/куркума.png","requiredLevel":49,"growTime":153046,"buyPrice":4563,"sellPrice":2091,"experience":11444,"fruitsPerHarvest":10},
  "chyli-perets": {"type":"chyli-perets","name":"Чилі-перець","image":"/images/seeds/перець-чілі.png","requiredLevel":50,"growTime":162648,"buyPrice":4799,"sellPrice":2142,"experience":11920,"fruitsPerHarvest":10}
};

// Level experience requirements (experience needed to reach each level)
export const LEVEL_EXPERIENCE_REQUIREMENTS = {
  2: 25,
  3: 144,
  4: 570,
  5: 1625,
  6: 4305,
  7: 10452,
  8: 21582,
  9: 40158,
  10: 68625,
  11: 110920,
  12: 168756,
  13: 248368,
  14: 353096,
  15: 489740,
  16: 663585,
  17: 879248,
  18: 1148966,
  19: 1469842,
  20: 1861620,
  21: 2318748,
  22: 2857140,
  23: 3488360,
  24: 4218039,
  25: 5047038,
  26: 5987056,
  27: 7072275,
  28: 8309070,
  29: 9688874,
  30: 11230308,
  31: 12951400,
  32: 14842366,
  33: 16945970,
  34: 19269600,
  35: 21831880,
  36: 24629132,
  37: 27665720,
  38: 31014865,
  39: 34660860,
  40: 38602872,
  41: 42860727,
  42: 47458416,
  43: 52387104,
  44: 57682716,
  45: 63326879,
  46: 69366360,
  47: 75805086,
  48: 82662755,
  49: 89999364,
  50: 97801173,
} as const;

// Helper to get requirement for next level; falls back to the highest defined requirement
const getExpForNextLevel = (level: number): number => {
  const nextLevel = level + 1;
  const requirement = (LEVEL_EXPERIENCE_REQUIREMENTS as Record<number, number>)[nextLevel];
  if (typeof requirement === 'number') return requirement;
  const maxDefinedLevel = Math.max(...Object.keys(LEVEL_EXPERIENCE_REQUIREMENTS).map(Number));
  return (LEVEL_EXPERIENCE_REQUIREMENTS as Record<number, number>)[maxDefinedLevel];
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

const initialWarehouse: Warehouse = Object.keys(PLANT_DATA).reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {} as Warehouse);

const defaultPlantType: PlantType = Object.keys(PLANT_DATA)[0];
const createPlant = (type: PlantType = defaultPlantType): Plant => {
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

const createFarmPlot = (id: string, isUnlocked: boolean = false, unlockPrice: number = 0, unlockCurrency: 'coins' | 'emeralds' = 'coins'): FarmPlot => ({
  id,
  isUnlocked,
  plant: null,
  unlockPrice,
  unlockCurrency,
});

// Generate farm plots with new pricing (15 plots total)
const generateFarmPlots = (): FarmPlot[] => {
  const plots: FarmPlot[] = [];
  
  // First plot is free
  plots.push(createFarmPlot('plot-1', true, 0));
  
  // New pricing list for plots 2..15
  const pricing: Array<{ price: number; currency: 'coins' | 'emeralds' }> = [
    { price: 1000, currency: 'coins' },      // 2
    { price: 3000, currency: 'coins' },      // 3
    { price: 10000, currency: 'coins' },     // 4
    { price: 50, currency: 'emeralds' },     // 5
    { price: 20000, currency: 'coins' },     // 6
    { price: 50000, currency: 'coins' },     // 7
    { price: 100000, currency: 'coins' },    // 8
    { price: 300000, currency: 'coins' },    // 9
    { price: 200, currency: 'emeralds' },    // 10
    { price: 500000, currency: 'coins' },    // 11
    { price: 1000000, currency: 'coins' },   // 12
    { price: 3000000, currency: 'coins' },   // 13
    { price: 5000000, currency: 'coins' },   // 14
    { price: 500, currency: 'emeralds' },    // 15
  ];

  for (let i = 0; i < pricing.length; i++) {
    const plotIndex = i + 2; // plots 2..15
    const item = pricing[i];
    plots.push(createFarmPlot(`plot-${plotIndex}`, false, item.price, item.currency));
  }
  
  return plots;
};

// Helper function to calculate level reward using formula M = 10 × 1.40^(L-1)
const calculateLevelReward = (level: number): number => {
  return Math.floor(10 * Math.pow(1.40, level - 1));
};

// Helper function to calculate coin bonus percentage based on achievements
const calculateCoinBonusPercentage = (achievements: Achievement[]): number => {
  const totalLevels = achievements.reduce((sum, achievement) => {
    return sum + achievement.claimedLevels.length;
  }, 0);
  
  // Each achievement level = 1% bonus
  return totalLevels;
};

// Helper function to calculate experience bonus percentage based on level
const calculateExperienceBonusPercentage = (level: number): number => {
  // Each level = 1% bonus, starting from level 2
  return Math.max(0, level - 1);
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
  warehouseLevel: 1,
  warehouseCapacity: 500,
  activeTab: 'farm',
  toastMessage: null,
  toastType: null,
  isGameRunning: false,
  isHarvesting: false,
  farmPlots: generateFarmPlots(),
  selectedPlantType: null,
  selectedFertilizerType: null,
  achievements: Object.values(ACHIEVEMENT_DATA),
  syncStatus: 'idle',
  lastSyncTime: null,
  initialSyncDone: false,
  ratingData: null,
  activeRatingType: 'level',
  levelUpModal: {
    isOpen: false,
    newLevel: 1,
    newPlantType: null,
    rewardCoins: 0,
  },
  exchange: {
    usedToday: 0,
    resetAt: (() => {
      const now = new Date();
      const reset = new Date(now);
      reset.setHours(0, 0, 0, 0); // today midnight
      reset.setDate(reset.getDate() + 1); // next midnight
      return reset.getTime();
    })(),
  },
  dailyGreetingModal: {
    isOpen: false,
    giftCoins: 0,
    giftEmeralds: 0,
  },
  upgrades: {
    powerLevel: 1,
    powerPerClick: 1,
    activeTrack: null,
    currentPowerTask: undefined,
    currentPowerPlant: null,
    progress: {
      totalWaterings: 0,
      totalFertilizers: 0,
      harvestsByPlant: {},
    },
  },

  // Upgrade actions
  startPowerTask: () => {
    const state = get();
    // Prevent starting while loading or before initial sync
    if (!state.initialSyncDone || state.syncStatus === 'loading') return;
    // Prevent duplicate if task already active
    if (state.upgrades && state.upgrades.activeTrack === 'power' && state.upgrades.currentPowerTask) return;
    const currentLevel = state.upgrades?.powerLevel || 1;
    const nextTask = Math.min(currentLevel + 1, 8); // tasks 2..8
    // Pick random available plant for tasks that require specific plant
    const availablePlants = Object.entries(PLANT_DATA)
      .filter(([, pd]) => pd.requiredLevel <= state.user.level)
      .map(([k]) => k) as PlantType[];
    const randomPlant = availablePlants.length
      ? availablePlants[Math.floor(Math.random() * availablePlants.length)]
      : null;

    const prev = state.upgrades || {
      powerLevel: 1,
      powerPerClick: 1,
      activeTrack: null as 'power' | 'intensity' | null,
      currentPowerTask: undefined as number | undefined,
      currentPowerPlant: null as PlantType | null,
      progress: { totalWaterings: 0, totalFertilizers: 0, harvestsByPlant: {} as Record<string, number> },
    };
    set({
      upgrades: {
        ...prev,
        activeTrack: 'power',
        currentPowerTask: nextTask,
        currentPowerPlant: randomPlant,
      },
    });
  },
  completePowerTask: () => {
    const state = get();
    const up = state.upgrades;
    if (!up || up.activeTrack !== 'power' || !up.currentPowerTask) return;
    const task = up.currentPowerTask;
    // Determine target and current
    let current = 0;
    let target = 0;
    if (task === 2 || task === 5 || task === 8) {
      target = task === 2 ? 500 : task === 5 ? 2000 : 5000;
      const plant = up.currentPowerPlant || '';
      current = up.progress.harvestsByPlant[plant] || 0;
    } else if (task === 3 || task === 6) {
      target = task === 3 ? 1000 : 10000;
      current = up.progress.totalWaterings;
    } else if (task === 4 || task === 7) {
      target = task === 4 ? 2000 : 20000;
      current = up.progress.totalFertilizers;
    }
    if (current < target) return; // not completed yet

    const newLevel = Math.min(8, (up.powerLevel || 1) + 1);
    const newPower = Math.max(1, (up.powerPerClick || 1) + 1);

    set({
      upgrades: {
        ...up,
        powerLevel: newLevel,
        powerPerClick: newPower,
        activeTrack: null,
        currentPowerTask: undefined,
        currentPowerPlant: null,
      },
    });

    // persist upgrade
    setTimeout(() => get().saveGameState(), 100);
    // toast
    get().showToast(`Потужність підвищено до ${newPower}с/клік!`, 'info');
  },

  // Plant actions
  createNewPlant: () => {
    set({ currentPlant: createPlant() });
  },

  clickPlant: (plotId: string) => {
    const { farmPlots, isHarvesting, harvestPlant, user, upgrades } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    // Increment total clicks
    set({ user: { ...user, totalClicks: user.totalClicks + 1 } });
    
    // Update achievements after click
    setTimeout(() => get().updateAchievements(), 0);
    
    if (plot && plot.plant && !isHarvesting) {
      if (plot.plant.timeLeft > 0) {
        const power = Math.max(1, (upgrades?.powerPerClick as number) || 1);
        const newTimeLeft = Math.max(0, plot.plant.timeLeft - power);
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
    const { farmPlots, warehouse, user, isHarvesting, selectedPlantType, showLevelUpModal, warehouseCapacity, showToast, calculateBonusExperience, upgrades } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (plot && plot.plant && plot.plant.isReady && !isHarvesting) {
      // Set harvesting flag to prevent multiple calls
      set({ isHarvesting: true });

      const plantData = PLANT_DATA[plot.plant.type];
      
      // Calculate bonus experience
      const bonusExperience = calculateBonusExperience(plantData.experience);
      const totalExperience = plantData.experience + bonusExperience;
      
      // Calculate new level progression with bonus experience
      const levelProgression = calculateLevelProgression(user.level, user.experience, totalExperience);
      
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

      // Enforce warehouse capacity
      const currentStored = Object.values(warehouse).reduce((sum, v) => sum + v, 0);
      if (currentStored >= warehouseCapacity) {
        // Warehouse full: skip adding and just update user/plots
        showToast('Склад переповнено', 'warning');
      } else {
        // Update warehouse - add harvested plant items based on fruitsPerHarvest
        const amountToAdd = Math.max(1, plantData.fruitsPerHarvest || 1);
        const spaceLeft = warehouseCapacity - currentStored;
        const actualAdd = Math.min(amountToAdd, spaceLeft);
        warehouse[plot.plant.type] = warehouse[plot.plant.type] + actualAdd;
        if (actualAdd < amountToAdd) {
          showToast('Додано не все: склад майже повний', 'warning');
        }
      }

      // Create new plant if we have a selected plant type and enough coins and capacity is not full
      let newPlant = null;
      if (selectedPlantType) {
        const plantData = PLANT_DATA[selectedPlantType];
        const currentStoredAfterHarvest = Object.values(warehouse).reduce((sum, v) => sum + v, 0);
        const canPlant = currentStoredAfterHarvest < warehouseCapacity;
        if (newUser.coins >= plantData.buyPrice && canPlant) {
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
        warehouse: { ...warehouse },
        user: newUser,
        farmPlots: updatedPlots,
        isHarvesting: false,
      });

      // Update upgrades progress for harvest-by-plant
      set((state) => {
        const up = state.upgrades || {
          powerLevel: 1,
          powerPerClick: 1,
          activeTrack: null,
          currentPowerTask: undefined,
          currentPowerPlant: null,
          progress: { totalWaterings: 0, totalFertilizers: 0, harvestsByPlant: {} },
        };
        const plantType = plot.plant ? plot.plant.type : null;
        if (plantType) {
          const current = up.progress.harvestsByPlant[plantType] || 0;
          up.progress.harvestsByPlant[plantType] = current + 1;
        }
        return { upgrades: { ...up } } as Partial<GameState>;
      });
      // Persist progress asynchronously
      setTimeout(() => {
        get().saveGameState();
      }, 100);
      
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
    const { farmPlots, user, warehouse, warehouseCapacity, showToast } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    const plantData = PLANT_DATA[plantType];
    
    
    // Block planting if warehouse is full
    const currentStored = Object.values(warehouse).reduce((sum, v) => sum + v, 0);
    if (currentStored >= warehouseCapacity) {
      showToast('Склад переповнено', 'warning');
      return;
    }

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
    const { farmPlots, user, addExperience, harvestPlant, calculateBonusExperience } = get();
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
    
    // Add experience with bonus
    const bonusExperience = calculateBonusExperience(WATERING_EXPERIENCE);
    addExperience(WATERING_EXPERIENCE + bonusExperience);
    
    // If plant is ready after watering, harvest it immediately
    if (newTimeLeft === 0) {
      setTimeout(() => {
        harvestPlant(plotId);
      }, 100); // Small delay to ensure state is updated
    }
    
    // Update achievements and upgrades progress, then persist
    setTimeout(() => {
      get().updateAchievements();
      const st = get();
      const prev = st.upgrades || {
        powerLevel: 1,
        powerPerClick: 1,
        activeTrack: null,
        currentPowerTask: undefined,
        currentPowerPlant: null,
        progress: { totalWaterings: 0, totalFertilizers: 0, harvestsByPlant: {} },
      };
      const next = {
        ...prev,
        progress: { ...prev.progress, totalWaterings: (prev.progress.totalWaterings || 0) + 1 },
      };
      set({ upgrades: next });
      setTimeout(() => get().saveGameState(), 100);
    }, 0);
    
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

  addEmeralds: (amount: number) => {
    const { user } = get();
    set({
      user: {
        ...user,
        emeralds: user.emeralds + amount,
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
    const { warehouse, user, calculateBonusCoins } = get();
    if (warehouse[product] >= amount) {
      // Find the plant data to get sell price
      const plantType = product as PlantType;
      const plantData = PLANT_DATA[plantType];
      const baseCoins = plantData.sellPrice * amount;
      const bonusCoins = calculateBonusCoins(baseCoins);
      const totalCoins = baseCoins + bonusCoins;
      
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

  // Warehouse upgrades
  upgradeWarehouse: () => {
    const { warehouseLevel, user } = get();
    const upgradeCosts: Record<number, { cost: number; capacity: number }> = {
      1: { cost: 100, capacity: 1000 },
      2: { cost: 200, capacity: 2000 },
      3: { cost: 500, capacity: 5000 },
    };
    const next = upgradeCosts[warehouseLevel as 1 | 2 | 3];
    if (!next) return; // Max level reached
    if (user.emeralds < next.cost) return;
    set((state) => ({
      user: { ...state.user, emeralds: state.user.emeralds - next.cost },
      warehouseLevel: state.warehouseLevel + 1,
      warehouseCapacity: next.capacity,
    }));
  },

  // Farm actions
  unlockPlot: (plotId: string) => {
    const { farmPlots, user, showToast } = get();
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (!plot || plot.isUnlocked) return;
    
    // Check if previous plot is unlocked (sequential unlocking)
    const plotNumber = parseInt(plotId.replace('plot-', ''));
    if (plotNumber > 2) { // Skip check for plot-1 (free) and plot-2 (first paid)
      const previousPlotId = `plot-${plotNumber - 1}`;
      const previousPlot = farmPlots.find(p => p.id === previousPlotId);
      if (!previousPlot?.isUnlocked) {
        showToast('Спочатку розблокуйте попередню грядку', 'warning');
        return;
      }
    }
    
    const payWithEmeralds = plot.unlockCurrency === 'emeralds';
    const canPay = payWithEmeralds ? user.emeralds >= plot.unlockPrice : user.coins >= plot.unlockPrice;
    if (!canPay) {
      showToast('Недостатньо ресурсів', 'warning');
      return;
    }

    if (plot) {
      const updatedPlots = farmPlots.map(p => 
        p.id === plotId 
          ? { ...p, isUnlocked: true }
          : p
      );

      set({
        farmPlots: updatedPlots,
        user: {
          ...user,
          coins: payWithEmeralds ? user.coins : user.coins - (plot.unlockPrice),
          emeralds: payWithEmeralds ? user.emeralds - plot.unlockPrice : user.emeralds,
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
    const { farmPlots, user, addExperience, calculateBonusExperience } = get();
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
      
      // Add experience for using fertilizer with bonus
      const bonusExperience = calculateBonusExperience(fertilizerData.experience);
      addExperience(fertilizerData.experience + bonusExperience);
      
      // Update achievements and upgrades progress, then persist
      setTimeout(() => {
        get().updateAchievements();
        const st = get();
        const prev = st.upgrades || {
          powerLevel: 1,
          powerPerClick: 1,
          activeTrack: null,
          currentPowerTask: undefined,
          currentPowerPlant: null,
          progress: { totalWaterings: 0, totalFertilizers: 0, harvestsByPlant: {} },
        };
        const next = {
          ...prev,
          progress: { ...prev.progress, totalFertilizers: (prev.progress.totalFertilizers || 0) + 1 },
        };
        set({ upgrades: next });
        setTimeout(() => get().saveGameState(), 100);
      }, 0);
      
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

  showToast: (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    set({ toastMessage: message, toastType: type });
    // Auto clear after 2 seconds
    setTimeout(() => {
      const state = get();
      if (state.toastMessage === message) {
        set({ toastMessage: null, toastType: null });
      }
    }, 2000);
  },
  clearToast: () => {
    set({ toastMessage: null, toastType: null });
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

  // Exchange actions
  exchangeCoinsForEmeraldsByCoins: (coinsAmount: number) => {
    const { user, exchange, showToast, getExchangeRemainingToday } = get();
    const COINS_PER_EMERALD = 1000;

    // Reset at midnight if needed
    const now = Date.now();
    if (now >= exchange.resetAt) {
      const nextReset = new Date();
      nextReset.setHours(0, 0, 0, 0); // today midnight
      nextReset.setDate(nextReset.getDate() + 1); // next midnight
      exchange.usedToday = 0;
      exchange.resetAt = nextReset.getTime();
    }

    const emeraldsToGet = Math.floor(coinsAmount / COINS_PER_EMERALD);
    if (emeraldsToGet <= 0) {
      showToast('Вкажіть кратно 1000 монет', 'warning');
      return;
    }
    if (user.coins < emeraldsToGet * COINS_PER_EMERALD) {
      showToast('Недостатньо монет', 'warning');
      return;
    }

    const remaining = getExchangeRemainingToday();
    if (remaining <= 0) {
      showToast('Ліміт на сьогодні вичерпано', 'warning');
      return;
    }

    const actualEmeralds = Math.min(emeraldsToGet, remaining);

    set({
      user: {
        ...user,
        coins: user.coins - actualEmeralds * COINS_PER_EMERALD,
        emeralds: user.emeralds + actualEmeralds,
      },
      exchange: {
        ...exchange,
        usedToday: exchange.usedToday + actualEmeralds,
      },
    });

    showToast(`Обміняно ${actualEmeralds} смарагдів`, 'info');
  },

  exchangeMaxToday: () => {
    const { user, getExchangeRemainingToday, exchange, showToast } = get();
    const COINS_PER_EMERALD = 1000;
    
    // Reset at midnight if needed
    const now = Date.now();
    let currentExchange = exchange;
    if (now >= exchange.resetAt) {
      const nextReset = new Date();
      nextReset.setHours(0, 0, 0, 0); // today midnight
      nextReset.setDate(nextReset.getDate() + 1); // next midnight
      currentExchange = {
        usedToday: 0,
        resetAt: nextReset.getTime(),
      };
    }
    
    const remaining = getExchangeRemainingToday();
    if (remaining <= 0) {
      showToast('Ліміт на сьогодні вичерпано', 'warning');
      return;
    }
    const affordableByCoins = Math.floor(user.coins / COINS_PER_EMERALD);
    const toExchange = Math.min(remaining, affordableByCoins);
    if (toExchange <= 0) {
      showToast('Недостатньо монет', 'warning');
      return;
    }
    set({
      user: { ...user, coins: user.coins - toExchange * COINS_PER_EMERALD, emeralds: user.emeralds + toExchange },
      exchange: { ...currentExchange, usedToday: currentExchange.usedToday + toExchange },
    });
    showToast(`Обміняно ${toExchange} смарагдів`, 'info');
  },

  getExchangeRemainingToday: () => {
    const { user, exchange } = get();
    const now = Date.now();
    if (now >= exchange.resetAt) {
      return user.level; // after midnight, effectively reset (UI can trigger state refresh)
    }
    const dailyLimit = user.level;
    return Math.max(0, dailyLimit - exchange.usedToday);
  },

  // Bonus calculation actions
  getCoinBonusPercentage: () => {
    const { achievements } = get();
    return calculateCoinBonusPercentage(achievements);
  },

  getExperienceBonusPercentage: () => {
    const { user } = get();
    return calculateExperienceBonusPercentage(user.level);
  },

  calculateBonusCoins: (baseCoins: number) => {
    const { achievements } = get();
    const bonusPercentage = calculateCoinBonusPercentage(achievements);
    return Math.floor(baseCoins * (bonusPercentage / 100));
  },

  calculateBonusExperience: (baseExperience: number) => {
    const { user } = get();
    const bonusPercentage = calculateExperienceBonusPercentage(user.level);
    return Math.floor(baseExperience * (bonusPercentage / 100));
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
        currentProgress: currentProgress || 0, // Ensure currentProgress is never undefined
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
    const { user, initialSyncDone } = get();
    if (initialSyncDone) {
      return;
    }
    
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
          
          // Migration: remap legacy plant types to new keys
          const legacyMap: Record<string, PlantType> = {
            dill: 'krip',
            parsley: 'petrushka',
            onion: 'zelena-tsybulya',
            cucumber: 'ohirok',
            tomato: 'pomidor',
          };

          const mapType = (t: PlantType | null | undefined): PlantType | null => {
            if (!t) return null;
            const mapped = legacyMap[t] || t;
            return PLANT_DATA[mapped] ? mapped : null;
          };

          // Migrate warehouse keys
          const migratedWarehouse: Warehouse = {} as Warehouse;
          if (savedState.warehouse) {
            Object.entries(savedState.warehouse as Record<string, number>).forEach(([k, v]) => {
              const newKey = mapType(k as PlantType);
              if (newKey) {
                migratedWarehouse[newKey] = (migratedWarehouse[newKey] || 0) + (v || 0);
              }
            });
          }

          // Ensure all PLANT_DATA keys exist in warehouse
          Object.keys(PLANT_DATA).forEach((k) => {
            if (typeof migratedWarehouse[k] !== 'number') migratedWarehouse[k] = 0;
          });

          // Migrate farm plots (plant types + new pricing/currency for locked plots)
          const pricing: Array<{ price: number; currency: 'coins' | 'emeralds' }> = [
            { price: 1000, currency: 'coins' },      // 2
            { price: 3000, currency: 'coins' },      // 3
            { price: 10000, currency: 'coins' },     // 4
            { price: 50, currency: 'emeralds' },     // 5
            { price: 20000, currency: 'coins' },     // 6
            { price: 50000, currency: 'coins' },     // 7
            { price: 100000, currency: 'coins' },    // 8
            { price: 300000, currency: 'coins' },    // 9
            { price: 200, currency: 'emeralds' },    // 10
            { price: 500000, currency: 'coins' },    // 11
            { price: 1000000, currency: 'coins' },   // 12
            { price: 3000000, currency: 'coins' },   // 13
            { price: 5000000, currency: 'coins' },   // 14
            { price: 500, currency: 'emeralds' },    // 15
          ];

          const migratedPlots = Array.isArray(savedState.farmPlots)
            ? savedState.farmPlots.map((p: FarmPlot) => {
                if (!p) return p;
                const updated: FarmPlot = { ...p };

                // Update plant mapping if present
                if (p.plant) {
                  const newType = mapType(p.plant.type);
                  if (!newType) {
                    updated.plant = null;
                  } else {
                    const pd = PLANT_DATA[newType];
                    const timeLeft = Math.min(p.plant.timeLeft ?? pd.growTime, pd.growTime);
                    updated.plant = { ...p.plant, type: newType, totalTime: pd.growTime, timeLeft };
                  }
                }

                // Enforce new pricing for locked plots by id index
                const match = /plot-(\d+)/.exec(p.id || '');
                const idx = match ? parseInt(match[1], 10) : NaN;
                if (!updated.isUnlocked && !isNaN(idx) && idx >= 2 && idx <= 15) {
                  const priceItem = pricing[idx - 2];
                  if (priceItem) {
                    updated.unlockPrice = priceItem.price;
                    updated.unlockCurrency = priceItem.currency;
                  }
                }

                return updated;
              })
            : currentState.farmPlots;

          // Ensure we have all 15 plots - add missing plots if needed
          const allPlots = generateFarmPlots(); // Get the complete set of 15 plots
          const existingPlotsMap = new Map(migratedPlots.map((p: FarmPlot) => [p.id, p]));
          
          // Merge existing plots with the complete set
          const mergedPlots: FarmPlot[] = allPlots.map(defaultPlot => {
            const existingPlot = existingPlotsMap.get(defaultPlot.id);
            if (existingPlot) {
              // Use existing plot data but ensure correct pricing
              return {
                ...existingPlot,
                unlockPrice: defaultPlot.unlockPrice,
                unlockCurrency: defaultPlot.unlockCurrency,
              } as FarmPlot;
            } else {
              // Use default plot (locked)
              return defaultPlot;
            }
          });

          // Fix sequential plot unlocking - ensure plots are unlocked in order
          const fixedPlots = mergedPlots.map((plot: FarmPlot, index: number) => {
            const plotNumber = index + 1;
            
            // Plot 1 is always unlocked
            if (plotNumber === 1) {
              return { ...plot, isUnlocked: true };
            }
            
            // For other plots, check if previous plot is unlocked
            const previousPlot = mergedPlots[plotNumber - 2]; // index - 1 for previous plot
            if (previousPlot?.isUnlocked) {
              return plot; // Keep current state
            } else {
              // If previous plot is not unlocked, this plot should be locked
              return { ...plot, isUnlocked: false };
            }
          });

          const migratedSelectedPlant = mapType(savedState.selectedPlantType) as PlantType | null;
          
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
          
          // Ensure backward compatibility for new fields (e.g., emeralds)
          const currentStateUser = currentState.user;
          const mergedUser = {
            ...currentStateUser,
            ...savedState.user,
          } as User;
          if (typeof mergedUser.emeralds !== 'number') {
            mergedUser.emeralds = 10;
          }

          // Check and reset exchange daily limit if needed
          let exchangeState = savedState.exchange || { usedToday: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 };
          const now = Date.now();
          if (now >= exchangeState.resetAt) {
            const nextReset = new Date();
            nextReset.setHours(0, 0, 0, 0); // today midnight
            nextReset.setDate(nextReset.getDate() + 1); // next midnight
            exchangeState = {
              usedToday: 0,
              resetAt: nextReset.getTime(),
            };
          }

          set({
            user: mergedUser,
            warehouse: migratedWarehouse,
            farmPlots: fixedPlots,
            achievements: mergedAchievements,
            exchange: exchangeState,
            upgrades: savedState.upgrades || currentState.upgrades || {
              powerLevel: 1,
              powerPerClick: 1,
              activeTrack: null,
              currentPowerTask: undefined,
              currentPowerPlant: null,
              progress: { totalWaterings: 0, totalFertilizers: 0, harvestsByPlant: {} },
            },
            // Restore saved UI state
            activeTab: savedState.activeTab || currentState.activeTab,
            selectedPlantType: migratedSelectedPlant || currentState.selectedPlantType,
            selectedFertilizerType: savedState.selectedFertilizerType || currentState.selectedFertilizerType,
            syncStatus: 'idle',
            lastSyncTime: Date.now(),
            initialSyncDone: true
          });
          
          // Update achievements after loading to ensure progress is calculated correctly
          setTimeout(() => {
            get().updateAchievements();
          }, 100);
        } else {
          set({ syncStatus: 'idle', initialSyncDone: true });
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('loadGameState: Error', error);
      console.error('loadGameState: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
      });
      set({ syncStatus: 'error', initialSyncDone: true });
    }
  },

  setSyncStatus: (status: 'idle' | 'saving' | 'loading' | 'error') => {
    set({ syncStatus: status });
  },

  setLastSyncNow: () => {
    set({ lastSyncTime: Date.now() });
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

  // Daily greeting actions
  checkDailyGift: () => {
    const { user } = get();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if user already received gift today
    if (user.lastDailyGiftDate === today) {
      return;
    }
    
    // Calculate daily gift
    const giftCoins = Math.max(user.level * 100, Math.floor(user.coins * 0.01));
    const giftEmeralds = 3;
    
    // Show greeting modal
    set({
      dailyGreetingModal: {
        isOpen: true,
        giftCoins,
        giftEmeralds,
      },
    });
  },

  claimDailyGift: () => {
    const { user, dailyGreetingModal } = get();
    const today = new Date().toISOString().split('T')[0];
    
    if (dailyGreetingModal.isOpen) {
      set({
        user: {
          ...user,
          coins: user.coins + dailyGreetingModal.giftCoins,
          emeralds: user.emeralds + dailyGreetingModal.giftEmeralds,
          lastDailyGiftDate: today,
        },
        dailyGreetingModal: {
          isOpen: false,
          giftCoins: 0,
          giftEmeralds: 0,
        },
      });

      // Persist lastDailyGiftDate to server
      setTimeout(() => {
        get().saveGameState();
      }, 0);
    }
  },

  closeDailyGreetingModal: () => {
    set({
      dailyGreetingModal: {
        isOpen: false,
        giftCoins: 0,
        giftEmeralds: 0,
      },
    });
  },

  // Reset farm plots to default state
  resetFarmPlots: () => {
    set({
      farmPlots: generateFarmPlots(),
    });
  },
}));
