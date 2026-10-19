import {freshState,advanceDay,water,SOILS,SPECIES,CREATURES} from './model.js';
export const newWorld=()=>({...freshState(),gameWatered:false});
export const ready=s=>Boolean(s.soil&&s.plants.some(Boolean));
// One action has one visible consequence. Invalid actions leave the world untouched.
export function act(s,a){
 if(a.kind==='soil'&&SOILS[a.type]){s.soil=a.type;return true;}
 if(a.kind==='plant'&&s.soil&&SPECIES[a.type]&&Number.isInteger(a.slot)&&a.slot>=0&&a.slot<3){s.plants[a.slot]={species:a.type,health:90,growth:1,stressDays:0};s.started=true;return true;}
 if(a.kind==='remove'&&s.plants[a.slot]){s.plants[a.slot]=null;s.started=ready(s);return true;}
 if(a.kind==='creature'&&ready(s)&&CREATURES[a.type]){s.creatures=s.creatures.includes(a.type)?s.creatures.filter(c=>c!==a.type):[...s.creatures,a.type];return true;}
 if(a.kind==='water'&&s.soil){water(s);s.gameWatered=true;return true;}
 if(a.kind==='light'&&[25,50,80].includes(a.value)){s.light=a.value;return true;}
 if(a.kind==='day'&&ready(s)){s.started=true;advanceDay(s);return true;}
 return false;
}
