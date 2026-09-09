# YY & ZZ Love Space

一个使用 Vue 3、TypeScript 与 Vite 构建的轻量响应式爱情空间网站。

## 开发与构建

```bash
npm install
npm run dev
npm run type-check
npm run build
```

构建产物位于 `dist/`，可由项目内的 Nginx 配置提供静态访问。

## 源码结构

```text
src/
├── App.vue                    # 页面主体、导航、双主题与整体动效
├── components/
│   ├── Backtop.vue            # 返回顶部按钮
│   ├── FootprintMap.vue        # 城市足迹地图
│   └── LoveTimeline.vue        # 响应式爱情时间线
├── data/
│   └── journey.ts             # 时间线与城市级足迹数据
└── assets/memories/           # 经隐私处理后的时间线图片
```

## 隐私约定

- 公开页面只使用 `YY`、`ZZ` 两个代号。
- 地图只保存城市中心点，不保存住址、精确位置或实时轨迹。
- 照片加入仓库前应先像素化或风格化，并清除 EXIF 信息。
- 添加时间线照片的方法见 `src/assets/memories/README.md`。
