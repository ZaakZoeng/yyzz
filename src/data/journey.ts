import demoBadmintonImage from "../assets/memories/demo-badminton.svg";
import demoCityImage from "../assets/memories/demo-city.svg";
import demoCoastImage from "../assets/memories/demo-coast.svg";
import demoGraduationImage from "../assets/memories/demo-graduation.svg";
import demoHarborImage from "../assets/memories/demo-harbor.svg";
import demoHomeImage from "../assets/memories/demo-home.svg";
import demoParkImage from "../assets/memories/demo-park.svg";
import demoSpringImage from "../assets/memories/demo-spring.svg";
import demoWheelImage from "../assets/memories/demo-wheel.svg";

export type MemoryKind = "初见" | "纪念" | "旅行" | "日常";

export type JourneyMemory = {
  date: string;
  displayDate: string;
  title: string;
  city: string;
  place?: string;
  kind: MemoryKind;
  featured?: boolean;
  image?: {
    src: string;
    alt: string;
    caption?: string;
    demo?: boolean;
    objectPosition?: string;
  };
};

export type CityCoordinate = {
  city: string;
  longitude: number;
  latitude: number;
  country: string;
  continent: string;
};

// 公开页面仅保存城市级信息，不记录住址、实时位置或精确行动轨迹。
export const cityCoordinates: CityCoordinate[] = [
  { city: "北京", longitude: 116.407, latitude: 39.904, country: "中国", continent: "亚洲" },
  { city: "邢台", longitude: 114.505, latitude: 37.07, country: "中国", continent: "亚洲" },
  { city: "邯郸", longitude: 114.539, latitude: 36.625, country: "中国", continent: "亚洲" },
  { city: "郑州", longitude: 113.625, latitude: 34.746, country: "中国", continent: "亚洲" },
  { city: "开封", longitude: 114.307, latitude: 34.797, country: "中国", continent: "亚洲" },
  { city: "常州", longitude: 119.974, latitude: 31.811, country: "中国", continent: "亚洲" },
  { city: "杭州", longitude: 120.155, latitude: 30.274, country: "中国", continent: "亚洲" },
  { city: "武汉", longitude: 114.305, latitude: 30.592, country: "中国", continent: "亚洲" },
  { city: "南昌", longitude: 115.858, latitude: 28.683, country: "中国", continent: "亚洲" },
  { city: "长沙", longitude: 112.938, latitude: 28.228, country: "中国", continent: "亚洲" },
  { city: "深圳", longitude: 114.058, latitude: 22.543, country: "中国", continent: "亚洲" },
  { city: "香港", longitude: 114.169, latitude: 22.319, country: "中国", continent: "亚洲" },
  { city: "海口", longitude: 110.199, latitude: 20.044, country: "中国", continent: "亚洲" },
  { city: "文昌", longitude: 110.797, latitude: 19.544, country: "中国", continent: "亚洲" },
  { city: "琼海", longitude: 110.474, latitude: 19.259, country: "中国", continent: "亚洲" },
];

export const journeyMemories: JourneyMemory[] = [
  {
    date: "2017-09",
    displayDate: "2017.09",
    title: "故事的序章",
    city: "南昌",
    kind: "初见",
    featured: true,
    image: {
      src: demoSpringImage,
      alt: "春日公园的抽象风景示例图",
      caption: "在故事开始的城市，记住那一年的秋天。",
      demo: true,
    },
  },
  { date: "2018-03-24", displayDate: "2018.03.24", title: "春日出游", city: "南昌", place: "凤凰沟公园", kind: "日常" },
  { date: "2018-04-05", displayDate: "2018.04.05", title: "我们成为我们", city: "南昌", kind: "纪念", featured: true },
  {
    date: "2018-04-30",
    displayDate: "2018.04.30",
    title: "第一次远行",
    city: "长沙",
    kind: "旅行",
    featured: true,
    image: {
      src: demoCityImage,
      alt: "蓝调城市夜景抽象示例图",
      caption: "第一次一起去看陌生城市的灯火。",
      demo: true,
    },
  },
  { date: "2018-10-04", displayDate: "2018.10.04", title: "秋日散步", city: "南昌", place: "秋水广场", kind: "日常" },
  {
    date: "2019-04-05",
    displayDate: "2019.04.05",
    title: "摩天轮上的纪念日",
    city: "南昌",
    place: "南昌之星",
    kind: "纪念",
    image: {
      src: demoWheelImage,
      alt: "蓝粉暮色中的摩天轮抽象示例图",
      caption: "在缓慢升高的夜色里，把又一年的喜欢留在城市上空。",
      demo: true,
    },
  },
  { date: "2019-06-29", displayDate: "2019.06.29", title: "一起去游乐园", city: "南昌", place: "融创乐园", kind: "日常" },
  { date: "2019-09-14", displayDate: "2019.09.14", title: "江城之旅", city: "武汉", kind: "旅行", featured: true },
  { date: "2019-10-01", displayDate: "2019.10.01", title: "仰望城市天际线", city: "南昌", place: "双子塔", kind: "日常" },
  { date: "2021-01-02", displayDate: "2021.01.02", title: "新年的第一次散步", city: "深圳", place: "人才公园", kind: "日常" },
  {
    date: "2021-06-01",
    displayDate: "2021.06.01",
    title: "一起大学毕业",
    city: "南昌",
    kind: "纪念",
    featured: true,
    image: {
      src: demoGraduationImage,
      alt: "毕业礼帽与书页的抽象示例图",
      caption: "同一段青春写到结尾，也一起翻开生活的新一页。",
      demo: true,
    },
  },
  { date: "2021-06", displayDate: "2021.06", title: "毕业后的江城记忆", city: "武汉", kind: "旅行" },
  { date: "2022-06", displayDate: "2022.06", title: "初夏杭州", city: "杭州", kind: "旅行" },
  { date: "2022-08-02", displayDate: "2022.08.02", title: "古城里的慢时光", city: "深圳", place: "南头古城", kind: "日常" },
  { date: "2022-10-02", displayDate: "2022.10.02", title: "在桂湾吹晚风", city: "深圳", place: "桂湾公园", kind: "日常" },
  { date: "2023-01-03", displayDate: "2023.01.03", title: "新年登高", city: "深圳", place: "大南山公园", kind: "日常" },
  { date: "2023-04-30", displayDate: "2023.04.30", title: "奔向山海", city: "深圳", place: "大梅沙公园", kind: "日常" },
  { date: "2023-05-01", displayDate: "2023.05.01", title: "草地与音乐", city: "深圳", place: "前海演艺公园", kind: "日常" },
  { date: "2023-05-02", displayDate: "2023.05.02", title: "跨过一座城", city: "香港", kind: "旅行", featured: true },
  { date: "2023-05-03", displayDate: "2023.05.03", title: "海边的石头记", city: "深圳", place: "前海石公园", kind: "日常" },
  { date: "2023-08-24", displayDate: "2023.08.24", title: "湿地里的夏天", city: "深圳", place: "华侨城国家湿地公园", kind: "日常" },
  { date: "2023-08-25", displayDate: "2023.08.25", title: "再访熟悉的公园", city: "深圳", place: "人才公园", kind: "日常" },
  {
    date: "2023-12-31",
    displayDate: "2023.12.31",
    title: "一起跨年",
    city: "深圳",
    place: "人才公园",
    kind: "纪念",
    featured: true,
    image: {
      src: demoHarborImage,
      alt: "滨海城市蓝色黄昏抽象示例图",
      caption: "在熟悉的海湾边告别旧年，也把新一年的愿望交给彼此。",
      demo: true,
    },
  },
  { date: "2024-02-12", displayDate: "2024.02.12", title: "海岛假日第一站", city: "海口", kind: "旅行" },
  { date: "2024-02-13", displayDate: "2024.02.13", title: "追着海风去文昌", city: "文昌", kind: "旅行" },
  {
    date: "2024-02-14",
    displayDate: "2024.02.14",
    title: "博鳌的情人节",
    city: "琼海",
    place: "博鳌",
    kind: "纪念",
    featured: true,
    image: {
      src: demoCoastImage,
      alt: "海边日落抽象示例图",
      caption: "海风、落日，以及恰好在身边的你。",
      demo: true,
    },
  },
  { date: "2024-02-17", displayDate: "2024.02.17", title: "回到深圳湾", city: "深圳", place: "深圳湾公园", kind: "日常" },
  {
    date: "2024-04-05",
    displayDate: "2024.04.05",
    title: "又一年春天",
    city: "深圳",
    place: "四海公园",
    kind: "纪念",
    image: {
      src: demoParkImage,
      alt: "蓝调湖面与粉色花树的公园抽象示例图",
      caption: "春天如约回来，我们也仍然并肩走在同一条小路上。",
      demo: true,
    },
  },
  { date: "2024-05-05", displayDate: "2024.05.05", title: "熟悉的海边散步", city: "深圳", place: "前海石公园", kind: "日常" },
  { date: "2024-08", displayDate: "2024.08", title: "盛夏北行", city: "邢台", kind: "旅行" },
  { date: "2024-11", displayDate: "2024.11", title: "深秋看海", city: "深圳", place: "大梅沙公园", kind: "日常" },
  { date: "2024-11-30", displayDate: "2024.11.30", title: "冬日杭州", city: "杭州", kind: "旅行" },
  { date: "2025-01", displayDate: "2025.01", title: "新一年仍在一起", city: "深圳", kind: "纪念" },
  { date: "2025-02-14", displayDate: "2025.02.14", title: "城市里的情人节", city: "深圳", kind: "纪念" },
  { date: "2025-04", displayDate: "2025.04", title: "春日绿意", city: "深圳", place: "中心公园", kind: "日常" },
  { date: "2025-05", displayDate: "2025.05", title: "江南初夏", city: "常州", kind: "旅行" },
  { date: "2025-05", displayDate: "2025.05", title: "再到杭州", city: "杭州", kind: "旅行" },
  {
    date: "2025-08-30",
    displayDate: "2025.08.30",
    title: "一起搬进新的生活",
    city: "深圳",
    kind: "纪念",
    featured: true,
    image: {
      src: demoHomeImage,
      alt: "温暖新居的抽象示例图",
      caption: "从此以后，回家变成一件有期待的事。",
      demo: true,
    },
  },
  {
    date: "2025-09-06",
    displayDate: "2025.09.06",
    title: "一起打羽毛球",
    city: "深圳",
    kind: "日常",
    image: {
      src: demoBadmintonImage,
      alt: "球拍与羽毛球运动轨迹的抽象示例图",
      caption: "一场普通的球，也能成为后来想起时会微笑的小事。",
      demo: true,
    },
  },
  { date: "2025-10", displayDate: "2025.10", title: "再去海口", city: "海口", kind: "旅行" },
  { date: "2025-11-30", displayDate: "2025.11.30", title: "冬日前的散步", city: "深圳", place: "四海公园", kind: "日常" },
  {
    date: "2026-01-02",
    displayDate: "2026.01.02",
    title: "滨海岸线散步",
    city: "深圳",
    place: "太子湾滨海岸线公园",
    kind: "日常",
    image: {
      src: demoHarborImage,
      alt: "海湾、城市剪影与步道的抽象示例图",
      caption: "沿着海岸线慢慢走，把新年的第一阵海风记下来。",
      demo: true,
      objectPosition: "center 58%",
    },
  },
  { date: "2026-01-03", displayDate: "2026.01.03", title: "荔林里的新年", city: "深圳", place: "荔林公园", kind: "日常" },
  { date: "2026-06-21", displayDate: "2026.06.21", title: "一起到北京", city: "北京", kind: "旅行", featured: true },
  { date: "2026-06-23", displayDate: "2026.06.23", title: "夏至后的杭州", city: "杭州", kind: "旅行" },
  { date: "2026-09-01", displayDate: "2026.09.01", title: "九月从郑州开始", city: "郑州", kind: "旅行" },
  { date: "2026-09-03", displayDate: "2026.09.03", title: "古都漫游", city: "开封", kind: "旅行" },
  { date: "2026-09-05", displayDate: "2026.09.05", title: "旅程的下一站", city: "邯郸", kind: "旅行", featured: true },
];

type EnglishMemoryCopy = {
  title: string;
  place?: string;
  caption?: string;
  alt?: string;
};

const englishMemoryCopy: Record<string, EnglishMemoryCopy> = {
  "2017-09|南昌": { title: "The beginning of our story", caption: "In the city where our story began, we remember that autumn.", alt: "Abstract park landscape in warm autumn colours" },
  "2018-03-24|南昌": { title: "A spring day out", place: "Fenghuanggou Park" },
  "2018-04-05|南昌": { title: "The day we became us" },
  "2018-04-30|长沙": { title: "Our first journey", caption: "Our first time seeing the lights of an unfamiliar city together.", alt: "Abstract blue-toned city at night" },
  "2018-10-04|南昌": { title: "An autumn walk", place: "Qiushui Square" },
  "2019-04-05|南昌": { title: "An anniversary above the city", place: "Star of Nanchang", caption: "As the evening slowly rose, we left another year of love above the city.", alt: "Abstract Ferris wheel beneath a rose-and-blue evening sky" },
  "2019-06-29|南昌": { title: "A day at the amusement park", place: "Sunac Land" },
  "2019-09-14|武汉": { title: "A journey to the river city" },
  "2019-10-01|南昌": { title: "Looking up at the skyline", place: "Twin Towers" },
  "2021-01-02|深圳": { title: "Our first walk of the year", place: "Talent Park" },
  "2021-06-01|南昌": { title: "Graduating together", caption: "We finished the same chapter of youth and opened a new page of life together.", alt: "Abstract graduation cap and open book" },
  "2021-06|武汉": { title: "River-city memories after graduation" },
  "2022-06|杭州": { title: "Early summer in Hangzhou" },
  "2022-08-02|深圳": { title: "Slow hours in the old town", place: "Nantou Ancient Town" },
  "2022-10-02|深圳": { title: "An evening breeze at Guiwan", place: "Guiwan Park" },
  "2023-01-03|深圳": { title: "A new-year climb", place: "Dananshan Park" },
  "2023-04-30|深圳": { title: "Running towards the mountains and sea", place: "Dameisha Park" },
  "2023-05-01|深圳": { title: "Grass, sky and music", place: "Qianhai Performing Arts Park" },
  "2023-05-02|香港": { title: "Across the harbour to another city" },
  "2023-05-03|深圳": { title: "Stones beside the sea", place: "Qianhai Stone Park" },
  "2023-08-24|深圳": { title: "Summer in the wetlands", place: "OCT National Wetland Park" },
  "2023-08-25|深圳": { title: "Back to a familiar park", place: "Talent Park" },
  "2023-12-31|深圳": { title: "Welcoming the new year together", place: "Talent Park", caption: "Beside the familiar bay, we said goodbye to the old year and entrusted the next one to each other.", alt: "Abstract harbour city at blue hour" },
  "2024-02-12|海口": { title: "The first stop of our island holiday" },
  "2024-02-13|文昌": { title: "Following the sea breeze to Wenchang" },
  "2024-02-14|琼海": { title: "Valentine's Day in Bo'ao", place: "Bo'ao", caption: "The sea breeze, the sunset, and you beside me.", alt: "Abstract seaside sunset" },
  "2024-02-17|深圳": { title: "Back to Shenzhen Bay", place: "Shenzhen Bay Park" },
  "2024-04-05|深圳": { title: "Another spring together", place: "Sihai Park", caption: "Spring returned as promised, and we were still walking side by side.", alt: "Abstract blue lake and rose-coloured trees in a park" },
  "2024-05-05|深圳": { title: "A familiar seaside walk", place: "Qianhai Stone Park" },
  "2024-08|邢台": { title: "Northbound in midsummer" },
  "2024-11|深圳": { title: "The sea in late autumn", place: "Dameisha Park" },
  "2024-11-30|杭州": { title: "Winter in Hangzhou" },
  "2025-01|深圳": { title: "Still together in a new year" },
  "2025-02-14|深圳": { title: "Valentine's Day in the city" },
  "2025-04|深圳": { title: "Spring greenery", place: "Central Park" },
  "2025-05|常州": { title: "Early summer in Jiangnan" },
  "2025-05|杭州": { title: "Returning to Hangzhou" },
  "2025-08-30|深圳": { title: "Moving into a new life together", caption: "From then on, coming home became something to look forward to.", alt: "Abstract warm home interior" },
  "2025-09-06|深圳": { title: "Playing badminton together", caption: "Even an ordinary game can become a small memory that makes us smile.", alt: "Abstract badminton rackets and shuttlecock in motion" },
  "2025-10|海口": { title: "Haikou, once more" },
  "2025-11-30|深圳": { title: "A walk before winter", place: "Sihai Park" },
  "2026-01-02|深圳": { title: "A walk along the coast", place: "Prince Bay Coastal Park", caption: "We walked slowly along the shore and kept the first sea breeze of the year.", alt: "Abstract harbour, skyline and coastal path" },
  "2026-01-03|深圳": { title: "A new year among the litchi trees", place: "Lilin Park" },
  "2026-06-21|北京": { title: "Together in Beijing" },
  "2026-06-23|杭州": { title: "Hangzhou after the summer solstice" },
  "2026-09-01|郑州": { title: "September begins in Zhengzhou" },
  "2026-09-03|开封": { title: "Wandering through an ancient capital" },
  "2026-09-05|邯郸": { title: "The next stop on our journey" },
};

const englishCityNames: Record<string, string> = {
  北京: "Beijing", 邢台: "Xingtai", 邯郸: "Handan", 郑州: "Zhengzhou", 开封: "Kaifeng",
  常州: "Changzhou", 杭州: "Hangzhou", 武汉: "Wuhan", 南昌: "Nanchang", 长沙: "Changsha",
  深圳: "Shenzhen", 香港: "Hong Kong", 海口: "Haikou", 文昌: "Wenchang", 琼海: "Qionghai",
};

const englishKinds: Record<MemoryKind, string> = {
  初见: "FIRST MET",
  纪念: "ANNIVERSARY",
  旅行: "TRIP",
  日常: "EVERYDAY",
};

export function getCityName(city: string, locale: string) {
  return locale === "en-US" ? englishCityNames[city] || city : city;
}

export function getMemoryCopy(memory: JourneyMemory, locale: string) {
  if (locale !== "en-US") {
    return {
      title: memory.title,
      place: memory.place,
      kind: memory.kind,
      caption: memory.image?.caption,
      alt: memory.image?.alt,
    };
  }

  const translation = englishMemoryCopy[`${memory.date}|${memory.city}`];
  return {
    title: translation?.title || memory.title,
    place: translation?.place || memory.place,
    kind: englishKinds[memory.kind],
    caption: translation?.caption || memory.image?.caption,
    alt: translation?.alt || memory.image?.alt,
  };
}

const visitedCityNames = new Set(journeyMemories.map((memory) => memory.city));
const visitedLocations = cityCoordinates.filter((location) => visitedCityNames.has(location.city));

// 足迹统计始终由爱情点滴数据派生；新增点滴后，城市、年份和时刻会自动更新。
export const journeyStats = {
  cities: visitedCityNames.size,
  moments: journeyMemories.length,
  years: new Set(journeyMemories.map((memory) => memory.date.slice(0, 4))).size,
  countries: new Set(visitedLocations.map((location) => location.country)).size,
  continents: new Set(visitedLocations.map((location) => location.continent)).size,
};
