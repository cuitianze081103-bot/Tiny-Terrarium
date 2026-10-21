import {mkdir,writeFile} from 'node:fs/promises';
import {svg,glyph,plant,pottedPlant,soilTray,trowel,bug,bugBox,specimenCard,sprayer,pendant,dimmer,jar} from '../dist/game-art.js';
import {SOILS,SPECIES,CREATURES} from '../dist/model.js';
import {newWorld} from '../dist/game-model.js';
const dir=new URL('../dist/assets/game/',import.meta.url);await mkdir(dir,{recursive:true});
const assets=[];
async function save(file,content,category){await writeFile(new URL(file,dir),content+'\n');assets.push({file,category});}
for(const type of Object.keys(SPECIES)){
 await save(`potted-${type}.svg`,pottedPlant(type),'柜中盆栽');
 for(const [state,health] of [['healthy',90],['stressed',45],['struggling',20]])await save(`plant-${type}-${state}.svg`,svg(`<g transform="translate(150 245)">${plant(type,health)}</g>`,'0 0 300 280'),'瓶内植物');
 for(const layer of ['back','front'])await save(`plant-${type}-${layer}.svg`,svg(`<g transform="translate(150 245)">${plant(type,90,layer)}</g>`,'0 0 300 280'),'植物交错分层');
}
for(const type of Object.keys(SOILS)){await save(`soil-tray-${type}.svg`,soilTray(type),'土壤盘');await save(`trowel-${type}.svg`,trowel(type),'铲子');}
await save('trowel-empty.svg',trowel(),'铲子');
for(const type of Object.keys(CREATURES)){await save(`insect-box-${type}.svg`,bugBox(type),'昆虫盒');await save(`insect-${type}.svg`,svg(bug(type,50,30),'0 0 100 60'),'昆虫');}
for(const type of [...Object.keys(CREATURES),...Object.keys(SOILS)])await save(`card-${type}.svg`,specimenCard(type),'靠罐信息卡');
await save('water-sprayer.svg',sprayer(),'喷水壶');
for(const value of [0,50,100]){await save(`pendant-${value}.svg`,pendant(value),'单盏顶灯亮度状态');await save(`dimmer-${value}.svg`,dimmer(value),'亮度旋钮状态');}
for(const name of ['undo','reset','play','pause','next','check','close','drop','sun','hand','leaf'])await save(`symbol-${name}.svg`,glyph(name).replaceAll('currentColor','#4f6b55'),'交互符号');
const s=newWorld();await save('jar-empty.svg',jar(s),'生态瓶场景');s.soil='regular';await save('jar-soil.svg',jar(s),'生态瓶场景');s.plants=Object.keys(SPECIES).map(species=>({species,health:90,growth:1}));s.creatures=Object.keys(CREATURES);
await save('jar-planted.svg',jar(s),'生态瓶场景');await save('jar-watering.svg',jar(s,{water:true}),'生态瓶场景');await save('jar-week-complete.svg',jar(s,{celebrate:true}),'生态瓶场景');s.plants.forEach(p=>p.health=20);await save('jar-struggling.svg',jar(s),'生态瓶场景');
// Furniture is drawn with CSS in the actual game. These exports preserve its palette and shapes for reuse.
await save('furniture-plant-cabinet.svg',svg('<path d="M20 430V90a100 100 0 0 1 200 0v340Z" fill="#d1d6b9" stroke="#9dac8c" stroke-width="2"/><path d="M30 170h180v9H30Zm0 120h180v9H30Zm0 120h180v9H30Z" fill="#b4b99a"/><path d="M38 430v20m164-20v20" stroke="#a8b293" stroke-width="14"/>','0 0 240 460'),'家具参考');
await save('furniture-insect-shelf.svg',svg('<path d="M10 10h280v9H10Z" fill="#bdc4a8"/><path d="M10 19h280v3H10Z" fill="#a9b69b"/>','0 0 300 30'),'家具参考');
await save('furniture-soil-tray.svg',svg('<rect x="2" y="2" width="596" height="96" rx="20" fill="#cfb88e" stroke="#ad9975"/>','0 0 600 100'),'家具参考');
await save('environment-window.svg',svg('<path d="M10 290V110a100 100 0 0 1 200 0v180Z" fill="#e4edda" stroke="#c9d5c3" stroke-width="11"/><path d="M110 12v278M12 150h198" stroke="#c0d0b9" stroke-width="7"/>','0 0 220 310'),'环境参考');
await save('environment-workbench.svg',svg('<defs><linearGradient id="wood" x2="0" y2="1"><stop stop-color="#e0cda9"/><stop offset="1" stop-color="#d3bc95"/></linearGradient></defs><path d="M0 0h1200v185H0Z" fill="url(#wood)"/><path d="M0 185h1200v15H0Z" fill="#b99e76"/><path d="M0 25 1200 90M0 68l1200 65M0 110l1200 65" stroke="#aa9062" opacity=".12"/>','0 0 1200 200'),'环境参考');
await writeFile(new URL('manifest.json',dir),JSON.stringify({version:'botanical-specimen-cards-v3',count:assets.length,source:'dist/botanical-art.js, dist/game-art.js, dist/game.css and dist/desktop.css',assets},null,2)+'\n');
await writeFile(new URL('index.html',dir),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>无文字生态瓶 · 素材</title><style>body{font:14px system-ui;background:#e8eee5;color:#4f6b55;padding:30px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:18px}figure{margin:0;padding:18px;background:#f6f8ee;border:1px solid #bac9ab;border-radius:12px}img{width:100%;height:160px;object-fit:contain}figcaption{margin-top:12px;word-break:break-word;font-size:12px}a{color:inherit}</style><h1>无文字生态瓶游戏素材</h1><p>${assets.length} 个独立 SVG。动态状态与家具布局以游戏源码为准。</p><main>${assets.map(a=>`<figure><a href="${a.file}"><img src="${a.file}" alt="${a.category}"><figcaption>${a.category} / ${a.file}</figcaption></a></figure>`).join('')}</main></html>`);
console.log(`Exported ${assets.length} game SVG files, manifest and gallery.`);
