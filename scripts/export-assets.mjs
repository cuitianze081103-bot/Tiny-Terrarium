import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {plantArt, icon, sceneArt} from '../dist/art.js';
import {freshState, SOILS, SPECIES, CREATURES} from '../dist/model.js';
const directory = new URL('../dist/assets/', import.meta.url);
await mkdir(directory, {recursive:true});
const files=[];
async function save(name, svg) {
  svg=svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  await writeFile(new URL(name, directory), svg+'\n'); files.push(name);
}
for(const species of Object.keys(SPECIES)) {
  for(const [state, health] of [['healthy',90],['stressed',45],['struggling',20]]) {
    await save(`plant-${species}-${state}.svg`, `<svg viewBox="0 0 260 200"><g transform="translate(130 180)">${plantArt(species,health)}</g></svg>`);
  }
}
for(const type of [...Object.keys(SOILS),...Object.keys(SPECIES),...Object.keys(CREATURES)]) await save(`icon-${type}.svg`,icon(type));
const s=freshState();
await save('terrarium-empty.svg',sceneArt(s));
s.soil='regular';s.plants=Object.keys(SPECIES).map(species=>({species,health:90,growth:1}));s.creatures=Object.keys(CREATURES);
await save('terrarium-planted.svg',sceneArt(s));
await save('terrarium-watering.svg',sceneArt(s,'water'));
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const inline=[...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(x=>x[0]);
await save('logo.svg',inline[0].replace('<svg ','<svg fill="none" stroke="#526b43" stroke-width="1.5" '));
await save('leaf-decoration.svg',inline[1].replace('<svg ','<svg fill="none" stroke="#889774" stroke-width="1.2" '));
await writeFile(new URL('index.html',directory),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tiny Terrarium assets</title><style>body{font:16px system-ui;background:#f8f6ed;color:#354735;padding:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}figure{margin:0;padding:20px;background:#fff;border:1px solid #dbdecf;border-radius:12px}img{width:100%;height:180px;object-fit:contain}figcaption{font-size:12px;word-break:break-word;margin-top:16px}a{color:inherit}</style><h1>Tiny Terrarium — asset gallery</h1><p>Static exports from the website's SVG artwork. Animated, changing states remain in art.js and style.css.</p><main>${files.map(file=>`<figure><a href="${file}"><img src="${file}" alt="${file.replace('.svg','').replaceAll('-',' ')}"><figcaption>${file}</figcaption></a></figure>`).join('')}</main></html>`);
console.log(`Exported ${files.length} SVG assets and gallery.`);
