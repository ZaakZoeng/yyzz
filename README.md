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
│   ├── LoveTimeline.vue        # 响应式爱情时间线
│   ├── VowBarrage.vue          # 还愿清单弹幕
│   └── VowDetail.vue           # Markdown 还愿详情页
├── content/vows/              # 一篇 Markdown 对应一条愿望弹幕
├── data/
│   ├── journey.ts             # 时间线与城市级足迹数据
│   └── vows.ts                # 自动读取与解析 Markdown
└── assets/memories/           # 经隐私处理后的时间线图片
```

## 添加还愿记录

只需在 `src/content/vows/` 新建一个 `.md` 文件，并按下面格式填写；文件名会成为详情页地址，项目重新构建后会自动多出一条弹幕。

```md
---
title: 去一座陌生的海边城市
summary: 写在详情页标题下方的一句话。
date: 2026-09-10
status: 心愿中
order: 4
---

这里开始写 Markdown 正文。
```

正文支持标题、列表、引用、链接和图片。图片可放在 `src/content/vows/images/`，并在 Markdown 中使用相对路径，例如 `![图片说明](./images/example.webp)`。为保护隐私，真实图片发布前请先完成像素化或油画风处理并清除 EXIF 信息。

## 隐私约定

- 公开页面只使用 `YY`、`ZZ` 两个代号。
- 地图只保存城市中心点，不保存住址、精确位置或实时轨迹。
- 照片加入仓库前应先像素化或风格化，并清除 EXIF 信息。
- 添加时间线照片的方法见 `src/assets/memories/README.md`。
- Flag Counter 是第三方访客统计图片，加载时访客浏览器会连接其服务器。

## 重要更新日志

- 2026-09-08，增加了 Vue 3 + Vite 爱情空间首页、纪念日计数与响应式基础布局。
- 2026-09-09，增加了完整爱情时间线、年份筛选、城市足迹地图和隐私化示例图片；修改了红绿配色为红蓝配色。
- 2026-09-09，增加了明亮与暗色双主题、固定 Header、返回顶部和区块动效；修改了项目目录，移除了旧科研站点页面及未使用的个人素材。
- 2026-09-09，增加了在一起时长的时分秒计时；修改了轨道亮点动画为 60 秒旋转一圈。
- 2026-09-10，增加了 Markdown 驱动的还愿清单、从左向右的愿望弹幕和独立详情页；修改了 Footer，将 Flag Counter 移入访客统计位置，并移除了祝福留言试验模块。
- 2026-09-10，增加了国家、大洲、城市、时刻与年份的足迹统计和城市关联图片；修改了足迹地图为城市信息、地图、点滴图片三栏联动布局。
