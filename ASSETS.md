# Tiny Terrarium 素材清单

本仓库保存线上 Tiny Terrarium 第 1 版的完整源码，源提交为 `a4a2feb9053060db3bae4a2ad542ef4c399b1506`。未包含本地尚未完成的植物改版。

## 已有素材

网站原始视觉由 SVG 和 CSS 绘制，无必须另外购买或上传的照片、PNG、视频、音频或 3D 模型。

| 分类 | 网站需要的内容 | 保存位置 |
| --- | --- | --- |
| 生态瓶 | 玻璃瓶、软木塞、高光、阴影、瓶内裁切 | `dist/art.js`；`dist/assets/terrarium-*.svg` |
| 土壤 | 沙质土、普通土、腐殖土；颗粒和湿润颜色 | `dist/art.js`；`dist/assets/icon-{sandy,regular,humus}.svg` |
| 植物 | 苔藓、蕨类、小型观叶植物；健康、受压、衰弱三种配色 | `dist/art.js`；9 个 `dist/assets/plant-*.svg` |
| 小生物 | 跳虫、潮虫；选择卡图标和瓶内小型绘图 | `dist/art.js`；`dist/assets/icon-{springtails,woodlice}.svg` |
| 植物图标 | 三种植物的选择卡缩略图 | `dist/assets/icon-{moss,fern,foliage}.svg` |
| 水与光 | 凝结水滴、浇水雨线、光照渐变、场景亮度 | `dist/art.js`；浇水场景导出于 `dist/assets/terrarium-watering.svg` |
| 品牌装饰 | 瓶子 Logo、叶子线条 | `dist/index.html`；`dist/assets/logo.svg`、`leaf-decoration.svg` |
| 界面符号 | 步骤数字、完成符号、箭头、加号、关闭符号、信息标识 | `dist/app.js`、`dist/index.html`、`dist/style.css` 中的文字和 CSS |
| 背景与样式 | 米白页面、浅绿场景渐变、边框、按钮、滑块、状态条 | `dist/style.css` |
| 动画 | 植物摇摆、小生物移动、倒土、浇水；减少动态效果支持 | `dist/style.css` |
| 文案与规则 | 五步流程、植物与土壤说明、观察日志、七日总结、说明弹窗 | `dist/index.html`、`dist/app.js`、`dist/model.js` |
| 字体 | Lora（标题）、DM Sans（正文） | `dist/style.css` 的 Google Fonts 在线引用；离线备用 Georgia / Arial |

独立导出共 **22 个 SVG**，可在 `dist/assets/index.html` 查看。SVG 是原有绘图的可复用静态快照；实际网站继续使用原始程序绘图，以保留状态变化和动画。

## 还需要补什么？

- **现有网站运行：没有缺失的必需图片素材。** 原有代码已包含全部绘图。
- **若要字体也完全离线：** 还需添加 Lora 和 DM Sans 的字体文件及各自授权文件，再改成本地字体引用。目前保留线上版原有字体链接，未打包字体文件。
- **若要重新设计画风：** 可替换瓶子、3 种土壤、3 种植物及健康状态、2 种小生物、Logo 和装饰；这些属于后续设计需求。

## 使用与重新导出

运行 `node server.js` 后访问 `http://127.0.0.1:4173`；素材画廊在 `/assets/index.html`。

修改 `dist/art.js` 后运行 `node scripts/export-assets.mjs`，重新导出素材。静态 SVG 不携带网页的 CSS 动画；动态效果在原网站中运行。
