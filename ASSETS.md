# 生态瓶游戏 · 信息卡与交错植物版素材清单

原版保留于 `main` 和 `codex/terrarium-assets`。本版开发分支为 `codex/wordless-terrarium-game`。

本版不依赖照片、AI 位图、字体文件、视频、音频、3D 模型或外部接口。全部物件均为可编辑的 SVG 绘图，房间和家具由 CSS 构成。**以下素材均已提供，无缺失的必需素材。**

## 独立 SVG 文件：66 个

目录：`dist/assets/game/`。完整文件名见 `manifest.json`；可打开 `index.html` 查看素材画廊。

| 分类 | 数量 | 内容与文件名 |
| --- | ---: | --- |
| 柜中盆栽 | 3 | 苔藓、蕨类、观叶植物与各自花盆：`potted-{moss,fern,foliage}.svg` |
| 瓶内植物 | 9 | 三种植物 × 健康／受压／衰弱：`plant-{moss,fern,foliage}-{healthy,stressed,struggling}.svg` |
| 植物前后分层 | 6 | 三种植物各有独立后景和前景枝叶：`plant-{moss,fern,foliage}-{back,front}.svg`，在瓶内交错绘制。 |
| 靠罐信息卡 | 5 | 跳虫、潮虫、沙质土、普通土、腐殖土：`card-{springtails,woodlice,sandy,regular,humus}.svg`。虫子显示游戏湿润度范围，土壤显示保水能力。 |
| 三种土壤盘 | 3 | 沙质、普通、腐殖土：`soil-tray-{sandy,regular,humus}.svg` |
| 铲子 | 4 | 空铲、装着三种土的铲子：`trowel-{empty,sandy,regular,humus}.svg` |
| 昆虫盒 | 2 | 跳虫盒、潮虫盒：`insect-box-{springtails,woodlice}.svg` |
| 独立昆虫 | 2 | 跳虫、潮虫：`insect-{springtails,woodlice}.svg` |
| 喷水壶 | 1 | 透明绿色喷雾瓶：`water-sprayer.svg` |
| 单灯与旋钮 | 6 | 同一盏灯的关闭／中亮／全亮参考：`pendant-{0,50,100}.svg`；旋钮对应状态：`dimmer-{0,50,100}.svg`。实际游戏支持 0–100 连续调节。 |
| 生态瓶场景 | 6 | 空瓶、装土、种植、喷水、七日结果、衰弱：`jar-{empty,soil,planted,watering,week-complete,struggling}.svg` |
| 互动符号 | 11 | 撤销、重置、播放、暂停、继续、确认、取消、水滴、太阳、手势、叶子：`symbol-*.svg` |
| 家具与环境参考 | 5 | 植物柜、昆虫搁板、土壤托盘、窗户、木工作台：`furniture-*.svg`、`environment-*.svg` |

## 运行时还需要的画面元素（已包含在源码中）

| 元素 | 包含内容 | 位置 |
| --- | --- | --- |
| 房间 | 浅绿墙面、窗框、斜射光、地面、纸感颗粒 | `game.css` |
| 家具布局 | 电脑横向工作台，柜体、隔板、柜脚、昆虫搁板、土壤托盘、桌边，整体适配浏览器窗口 | `game.css`、`desktop.css`；独立 SVG 为同配色形状参考 |
| 玻璃质感 | 瓶口、透明瓶身、高光、底部阴影、瓶内裁切 | `game-art.js` 的 `jar()` |
| 土壤变化 | 颗粒、湿润加深、入瓶动画 | `game-art.js`、`game.css` |
| 植物变化 | 重画的苔藓、舒展蕨叶、圆叶观叶植物；前后枝叶跨植株穿插、健康配色、生长缩放和同步摇摆 | `botanical-art.js`、`game-art.js`、`desktop.css`、`model.js` |
| 信息卡 | 奶油底、深绿字、小插画、靠罐倾斜与投影；悬停放大；卡片也可直接点击选择对应物件 | `game-art.js` 的 `specimenCard()`、`game.js`、`desktop.css` |
| 昆虫变化 | 瓶内小型昆虫、移动动画、盒子已放入标记 | `game-art.js`、`game.css` |
| 水与光 | 凝结水珠、喷水雾线、灯下光锥、明暗过渡 | `game-art.js`、`game.css` |
| 互动反馈 | 悬停抬起、选中高亮、手持物件、虚线弧线、手势、三处种植落点、植物预览 | `game.js`、`game.css` |
| 非文字读数 | 水滴／太阳／叶子图标与五颗指示点 | `game.js`、`game.css` |
| 时间与结果 | 七颗种子进度点、太阳推进、播放／暂停、七日叶片记录、结果星光、文字评价、实际数据、养护建议 | `game.js`、`game-model.js`、`desktop.css` |
| 重置与撤销 | 撤销按钮、空瓶重置确认、取消／确认图标 | `index.html`、`game.js` |
| 无障碍支持 | 隐藏操作名称、播报、焦点边框、减少动态效果 | `index.html`、`game.js`、`game.css` |

## 后续如果要统一升级画风

可以直接按上表替换植物、瓶子、铲子、土盘、虫盒、喷壶和灯具。植物必须同时考虑三个健康状态与生长大小；房间家具要保留当前可点击区域。**这些是可选美术替换，不是本版缺失素材。**

本版没有声音；如果后续需要，可另加铲土、放置、喷水、开关灯、日夜切换音效及静音按钮。当前无需准备这些文件。


2026-10-21: Nine independent planting positions span the whole soil bed. Moss forms an overlapping ground carpet. Plant cards for Moss, Fern and Small foliage show the exact moisture and light ranges used by the game. All 16 model tests and the complete DOM journey passed.


## Guided Grow additions
Five SVGs in `dist/assets/guided/`: empty jar, seedlings with large foreground creatures, grown jar, large springtails, large woodlice. Shared furniture, plant art, soil trays, and sprayer remain editable in the existing asset library.


## 完整素材归档（复古植物店版）

- `dist/assets/game/`：66 个植物、虫子、土壤、工具、场景及状态 SVG。
- `dist/assets/guided/`：5 个逐步种植与大虫子 SVG。
- `dist/assets/vintage/`：23 个复古墙面、拱窗、木桌、柜子、纸卡、按钮、步骤状态、顶灯、阴影与纹理 SVG。CSS 元素提供可编辑矢量导出，游戏中的精确样式仍以源码为准。
- `dist/assets/vintage/index.html`：全部 94 个 SVG 的素材总览。
- `ASSET-INVENTORY.json`：素材路径、体积、SHA-256，以及从主页追踪的所有运行文件。
- `downloads/Tiny-Terrarium-All-Assets.zip`：完整素材 ZIP。
- `downloads/Tiny-Terrarium-Playable.html`：可离线直接打开的完整游戏。

所有运行依赖均为本地代码或内嵌 SVG；使用系统字体，不依赖外部字体文件。参考游戏截图不属于实际游戏资源，未混入素材包。
