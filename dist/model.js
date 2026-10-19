// All ecological rules live here. Rendering never changes simulation state.
export const SOILS = {
  sandy: { name: 'Sandy soil', retention: 'Low retention', description: 'Loose and airy; water drains away quickly.', evaporation: 1.35, color: '#b09167' },
  regular: { name: 'Regular soil', retention: 'Balanced retention', description: 'A balanced mix that holds a moderate amount of water.', evaporation: 1, color: '#816044' },
  humus: { name: 'Humus-rich soil', retention: 'High retention', description: 'Rich in organic matter; stays moist for longer.', evaporation: .65, color: '#5f4936' }
};
export const SPECIES = {
  moss: { name: 'Moss', moisture: [50, 85], light: [15, 55], detail: 'A soft carpet for a shady, moist world.' },
  fern: { name: 'Fern', moisture: [40, 75], light: [25, 65], detail: 'Feathery fronds that love gentle light.' },
  foliage: { name: 'Small foliage', moisture: [30, 65], light: [40, 80], detail: 'Little leaves that enjoy a brighter spot.' }
};
export const CREATURES = { springtails: {name:'Springtails', moisture:[40,85], description:'Tiny recyclers that feed on decaying matter.'}, woodlice:{name:'Woodlice', moisture:[35,75], description:'Little decomposers that break down fallen leaves.'} };
export const clamp = (n, min=0, max=100) => Math.max(min, Math.min(max,n));
export const level = n => n < 35 ? 'Low' : n <= 70 ? 'Moderate' : 'High';
export const condition = n => n >= 75 ? 'Thriving' : n >= 50 ? 'Settling in' : n >= 25 ? 'Stressed' : 'Struggling';
export const freshState = () => ({step:0, unlocked:0, selectedSoil:'regular', soil:null, selectedPlant:'fern', plants:[null,null,null], creatures:[], creatureChoice:false, creatureHealth:90, moisture:55, light:50, initialWater:55, started:false, day:0, history:[], events:[], summarySeen:false, explanation:'Your world is ready. Advance one day to see how it responds.'});
export const meanHealth = s => { const p=s.plants.filter(Boolean); return p.length?p.reduce((a,p)=>a+p.health,0)/p.length:100; };
export const overall = s => condition(s.creatures.length ? (meanHealth(s)+s.creatureHealth)/2 : meanHealth(s));
const distance = (value,[lo,hi]) => Math.max(lo-value, value-hi, 0);
export function advanceDay(s) {
  if(!s.started || !s.soil || !s.plants.some(Boolean)) return;
  // Percent moisture per day: soil multiplier × (2 + light × .055), plus plant use.
  const loss = SOILS[s.soil].evaporation*(2+s.light*.055)+s.plants.filter(Boolean).length*.35;
  s.moisture=clamp(s.moisture-loss); s.day++;
  s.plants.forEach(p=> {if(!p)return; const spec=SPECIES[p.species]; const stress=distance(s.moisture,spec.moisture)*.17+distance(s.light,spec.light)*.10;
    p.stressDays=stress>0?p.stressDays+1:0;
    p.health=clamp(p.health+(stress>0?-Math.min(15,2+stress+p.stressDays*.6):5));
    p.growth=clamp(p.growth+(stress===0? .035: -.012),.6,1.45);
  });
  if(s.creatures.length){const stress=Math.max(...s.creatures.map(c=>distance(s.moisture,CREATURES[c].moisture)));s.creatureHealth=clamp(s.creatureHealth+(stress?-(2+stress*.2):4));}
  const thirsty=s.plants.find(p=>p&&s.moisture<SPECIES[p.species].moisture[0]);
  const wet=s.plants.find(p=>p&&s.moisture>SPECIES[p.species].moisture[1]);
  const bright=s.plants.find(p=>p&&s.light>SPECIES[p.species].light[1]);
  const dark=s.plants.find(p=>p&&s.light<SPECIES[p.species].light[0]);
  if(thirsty)s.explanation=`Moisture is below ${SPECIES[thirsty.species].name.toLowerCase()}'s preferred range. Add a little water to help it recover.`;
  else if(wet)s.explanation=`The soil is too wet for ${SPECIES[wet.species].name.toLowerCase()}. Hold off on watering while moisture falls.`;
  else if(bright)s.explanation='Strong light is stressing a plant and increasing water loss. Try reducing the light level.';
  else if(dark)s.explanation=`${SPECIES[dark.species].name} needs more light. Increase the light toward its preferred range.`;
  else if(s.creatures.length&&s.creatureHealth<75)s.explanation='Your plants are comfortable, but the decomposers are still recovering. Keep moisture within their preferred range.';
  else s.explanation=`Your plants are within their preferred ranges and recovering or growing. ${SOILS[s.soil].name} lost ${loss.toFixed(1)} moisture points today.`;
  s.history.push({day:s.day,moisture:s.moisture,light:s.light,health:meanHealth(s),condition:overall(s),explanation:s.explanation});
}
export function water(s, amount=12) {const before=s.moisture;s.moisture=clamp(s.moisture+amount);s.events.push({day:s.day,type:'water',amount:s.moisture-before});return s.moisture-before;}
