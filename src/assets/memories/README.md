# 时间线图片使用说明

1. 先将照片做像素化、油画化或其他隐私处理，并清除 EXIF 信息。
2. 建议导出为 WebP/JPEG，长边不超过 1600px，单张尽量控制在 500KB 以内。
3. 把图片放入当前目录，并在 `src/data/journey.ts` 顶部导入：

   ```ts
   import myMemoryImage from "../assets/memories/my-memory.webp";
   ```

4. 给对应的时间线记录添加 `image`：

   ```ts
   image: {
     src: myMemoryImage,
     alt: "不包含姓名和身份信息的图片描述",
     caption: "可选的回忆短句",
     objectPosition: "center 40%", // 可选，用于调整裁切焦点
   },
   ```

示例数据中的 `demo: true` 会显示“示例图片”角标。换成真实照片时删除该字段即可。图片加载失败时，页面会自动显示“照片待补充”占位，不会破坏时间线排版。
