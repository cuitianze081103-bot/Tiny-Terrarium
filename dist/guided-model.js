import {newWorld,PLANT_BED} from './game-model.js';
import {SOILS,SPECIES,CREATURES} from './model.js';
export const newGarden=()=>({...newWorld(),stage:'soil',light:50,sprays:0});
export function gardenPanels(s){return {soil:s.stage==='soil',plants:(s.stage==='soil'&&Boolean(s.soil))||s.stage==='plants',creatures:(s.stage==='plants'&&s.plants.some(Boolean))||s.stage==='creatures',water:(s.stage==='creatures'&&s.creatures.length>0)||s.stage==='care'};}
export function gardenAct(s,a){
 if(a.kind==='pickup'){const panels=gardenPanels(s),key={soil:'soil',plant:'plants',creature:'creatures',water:'water'}[a.type];if(!panels[key])return false;s.stage={soil:'soil',plant:'plants',creature:'creatures',water:'care'}[a.type];return true;}
 if(s.stage==='soil'&&a.kind==='soil'&&SOILS[a.type]){s.soil=a.type;return true;}
 if(s.stage==='plants'&&a.kind==='plant'&&SPECIES[a.type]&&Number.isInteger(a.slot)&&a.slot>=0&&a.slot<PLANT_BED.length){s.plants[a.slot]={species:a.type,health:90,growth:.68,stressDays:0};return true;}
 if(s.stage==='creatures'&&a.kind==='creature'&&CREATURES[a.type]){if(!s.creatures.includes(a.type))s.creatures.push(a.type);return true;}
 if(s.stage==='care'&&a.kind==='water'){s.sprays++;s.moisture=Math.min(85,s.moisture+4);s.plants.forEach(p=>{if(p){p.growth=Math.min(1.45,p.growth+.085);p.health=Math.min(100,p.health+2);}});return true;}
 return false;
}
