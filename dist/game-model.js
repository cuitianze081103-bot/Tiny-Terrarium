import {freshState,advanceDay,water,SOILS,SPECIES,CREATURES,meanHealth} from './model.js';
export const PLANT_BED=[{x:210,y:317,name:'back left'},{x:280,y:310,name:'back middle'},{x:350,y:317,name:'back right'},{x:160,y:332,name:'far left'},{x:400,y:332,name:'far right'},{x:193,y:351,name:'front left'},{x:251,y:359,name:'front middle left'},{x:309,y:359,name:'front middle right'},{x:367,y:351,name:'front right'}];
export const newWorld=()=>({...freshState(),plants:Array(PLANT_BED.length).fill(null),gameWatered:false});
export const ready=s=>Boolean(s.soil&&s.plants.some(Boolean));
export function weekReport(s){
 const plants=s.plants.filter(Boolean),health=Math.round(meanHealth(s));
 const average=Math.round(s.history.slice(0,7).reduce((sum,d)=>sum+d.health,0)/Math.max(1,Math.min(7,s.history.length)));
 const dry=plants.find(p=>s.moisture<SPECIES[p.species].moisture[0]),wet=plants.find(p=>s.moisture>SPECIES[p.species].moisture[1]);
 const bright=plants.find(p=>s.light>SPECIES[p.species].light[1]),dark=plants.find(p=>s.light<SPECIES[p.species].light[0]);
 const advice=dry?'The soil is getting dry. A little spray will help your plants recover.':wet?'The soil is holding a lot of water. Let it dry a little before spraying again.':bright?'The light is a little strong for your plants. Turn the dial down and watch them settle.':dark?'Your plants could use more light. Turn the dial up a little.':'Your plants have comfortable water and light. Keep watching as this little world grows.';
 return {title:health>=75?(dry||wet||bright||dark?'A promising little world.':'A little world in balance.'):health>=50?'Finding its own rhythm.':'A little care goes a long way.',summary:`Seven days with ${plants.length} ${plants.length===1?'plant':'plants'} and ${s.creatures.length} ${s.creatures.length===1?'kind':'kinds'} of tiny creatures. Average plant health was ${average}%. Every choice left a little trace.`,advice,health,moisture:Math.round(s.moisture),light:s.light,waterings:s.events.filter(e=>e.type==='water'&&e.day<=7).length};
}
// One action has one visible consequence. Invalid actions leave the world untouched.
export function act(s,a){
 if(a.kind==='soil'&&SOILS[a.type]){s.soil=a.type;return true;}
 if(a.kind==='plant'&&s.soil&&SPECIES[a.type]&&Number.isInteger(a.slot)&&a.slot>=0&&a.slot<PLANT_BED.length){s.plants[a.slot]={species:a.type,health:90,growth:1,stressDays:0};s.started=true;return true;}
 if(a.kind==='remove'&&s.plants[a.slot]){s.plants[a.slot]=null;s.started=ready(s);return true;}
 if(a.kind==='creature'&&ready(s)&&CREATURES[a.type]){s.creatures=s.creatures.includes(a.type)?s.creatures.filter(c=>c!==a.type):[...s.creatures,a.type];return true;}
 if(a.kind==='water'&&s.soil){water(s);s.gameWatered=true;return true;}
 if(a.kind==='light'&&Number.isFinite(a.value)&&a.value>=0&&a.value<=100){s.light=Math.round(a.value);return true;}
 if(a.kind==='day'&&ready(s)){s.started=true;advanceDay(s);return true;}
 return false;
}
