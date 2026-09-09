import demoCityImage from "../assets/memories/demo-city.svg";
import demoCoastImage from "../assets/memories/demo-coast.svg";
import demoHomeImage from "../assets/memories/demo-home.svg";
import demoSpringImage from "../assets/memories/demo-spring.svg";

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
};

// 公开页面仅保存城市级信息，不记录住址、实时位置或精确行动轨迹。
export const cityCoordinates: CityCoordinate[] = [
  { city: "北京", longitude: 116.407, latitude: 39.904 },
  { city: "邢台", longitude: 114.505, latitude: 37.07 },
  { city: "邯郸", longitude: 114.539, latitude: 36.625 },
  { city: "郑州", longitude: 113.625, latitude: 34.746 },
  { city: "开封", longitude: 114.307, latitude: 34.797 },
  { city: "常州", longitude: 119.974, latitude: 31.811 },
  { city: "杭州", longitude: 120.155, latitude: 30.274 },
  { city: "武汉", longitude: 114.305, latitude: 30.592 },
  { city: "南昌", longitude: 115.858, latitude: 28.683 },
  { city: "长沙", longitude: 112.938, latitude: 28.228 },
  { city: "深圳", longitude: 114.058, latitude: 22.543 },
  { city: "香港", longitude: 114.169, latitude: 22.319 },
  { city: "海口", longitude: 110.199, latitude: 20.044 },
  { city: "文昌", longitude: 110.797, latitude: 19.544 },
  { city: "琼海", longitude: 110.474, latitude: 19.259 },
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
  { date: "2019-04-05", displayDate: "2019.04.05", title: "摩天轮上的纪念日", city: "南昌", place: "南昌之星", kind: "纪念" },
  { date: "2019-06-29", displayDate: "2019.06.29", title: "一起去游乐园", city: "南昌", place: "融创乐园", kind: "日常" },
  { date: "2019-09-14", displayDate: "2019.09.14", title: "江城之旅", city: "武汉", kind: "旅行", featured: true },
  { date: "2019-10-01", displayDate: "2019.10.01", title: "仰望城市天际线", city: "南昌", place: "双子塔", kind: "日常" },
  { date: "2021-01-02", displayDate: "2021.01.02", title: "新年的第一次散步", city: "深圳", place: "人才公园", kind: "日常" },
  { date: "2021-06-01", displayDate: "2021.06.01", title: "一起大学毕业", city: "南昌", kind: "纪念", featured: true },
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
  { date: "2023-12-31", displayDate: "2023.12.31", title: "一起跨年", city: "深圳", place: "人才公园", kind: "纪念", featured: true },
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
  { date: "2024-04-05", displayDate: "2024.04.05", title: "又一年春天", city: "深圳", place: "四海公园", kind: "纪念" },
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
  { date: "2025-09-06", displayDate: "2025.09.06", title: "一起打羽毛球", city: "深圳", kind: "日常" },
  { date: "2025-10", displayDate: "2025.10", title: "再去海口", city: "海口", kind: "旅行" },
  { date: "2025-11-30", displayDate: "2025.11.30", title: "冬日前的散步", city: "深圳", place: "四海公园", kind: "日常" },
  { date: "2026-01-02", displayDate: "2026.01.02", title: "滨海岸线散步", city: "深圳", place: "太子湾滨海岸线公园", kind: "日常" },
  { date: "2026-01-03", displayDate: "2026.01.03", title: "荔林里的新年", city: "深圳", place: "荔林公园", kind: "日常" },
  { date: "2026-06-21", displayDate: "2026.06.21", title: "一起到北京", city: "北京", kind: "旅行", featured: true },
  { date: "2026-06-23", displayDate: "2026.06.23", title: "夏至后的杭州", city: "杭州", kind: "旅行" },
  { date: "2026-09-01", displayDate: "2026.09.01", title: "九月从郑州开始", city: "郑州", kind: "旅行" },
  { date: "2026-09-03", displayDate: "2026.09.03", title: "古都漫游", city: "开封", kind: "旅行" },
  { date: "2026-09-05", displayDate: "2026.09.05", title: "旅程的下一站", city: "邯郸", kind: "旅行", featured: true },
];
