import {SOILS,SPECIES,CREATURES,meanHealth} from './model.js';
import {newWorld,ready,act,weekReport} from './game-model.js';
import {svg,glyph,pottedPlant,soilTray,trowel,bugBox,sprayer,pendant,dimmer,jar} from './game-art.js';
const q=selector=>document.querySelector(selector);
let world=newWorld(),selected=null,playing=false,timer=null,undoStack=[],effectTimer=null;
let drag=null,suppressClick=false,lastPointer=null,dialDrag=null;
const names={soil:SOILS,plant:SPECIES,creature:CREATURES};
const announcement=q('#announcement');
const say=message=>{announcement.textContent=message;};
const copy=s=>JSON.parse(JSON.stringify(s));
q('#seal').innerHTML=glyph('leaf');q('#undo').innerHTML=glyph('undo');q('#reset').innerHTML=glyph('reset');q('#day').innerHTML=glyph('sun');q('#cancel-reset').innerHTML=glyph('close');q('#confirm-reset').innerHTML=glyph('check');q('#continue-icon').innerHTML=glyph('next');
q('#trowel').innerHTML=trowel();q('#sprayer').innerHTML=sprayer();
q('#plant-shelf').innerHTML=Object.entries(SPECIES).map(([type,p])=>`<div class="plant-row"><button class="plant-choice object-button" data-kind="plant" data-type="${type}" aria-label="Pick up ${p.name}" aria-pressed="false">${pottedPlant(type)}</button></div>`).join('');
q('#soils').innerHTML=Object.entries(SOILS).map(([type,s])=>`<button class="soil-choice object-button" data-kind="soil" data-type="${type}" aria-label="Scoop ${s.name}" aria-pressed="false">${soilTray(type)}</button>`).join('');
q('#creature-boxes').innerHTML=Object.entries(CREATURES).map(([type,c])=>`<button class="creature-box object-button" data-kind="creature" data-type="${type}" aria-label="Pick up ${c.name}" aria-pressed="false">${bugBox(type)}</button>`).join('');
function fitStage(){const scale=Math.min((window.innerWidth-32)/1280,(window.innerHeight-88)/720);q('#game').style.setProperty('--scene-scale',String(Math.max(.25,scale)));drawCue();}
function pause(){playing=false;clearInterval(timer);timer=null;}
function choose(item,event){
 pause();selected=selected?.kind===item.kind&&selected?.type===item.type?null:item;
 if(event&&event.clientX){lastPointer={x:event.clientX,y:event.clientY,touch:event.pointerType==='touch'};}
 render();
 if(selected)say(selected.kind==='trowel'?'Trowel selected. Choose one of the three soil trays.':`${names[selected.kind]?.[selected.type]?.name||'Water sprayer'} selected. Choose a position in the jar.`);
 else say('Tool put down.');
}
function commit(action){
 const before=copy(world);const wasTarget=document.activeElement?.matches('.plant-slot,.jar-target');if(!act(world,action)){nudge();return false;}
 undoStack.push(before);if(undoStack.length>100)undoStack.shift();
 selected=null;
 render({soilFlight:action.kind==='soil',water:action.kind==='water'});
 if(wasTarget){const restore=action.kind==='plant'?q(`[data-kind="plant"][data-type="${action.type}"]`):q('.jar-target');restore?.focus({preventScroll:true});}
 if(action.kind==='soil'){q('#effect').classList.add('puff');setTimeout(()=>q('#effect').classList.remove('puff'),800);}
 say(action.kind==='day'?`Day ${world.day}. Moisture ${Math.round(world.moisture)} percent. Plant health ${Math.round(meanHealth(world))} percent.`:action.kind==='light'?`Light set to ${world.light} percent.`:action.kind==='water'?'Water sprayed into the jar.':`${names[action.kind]?.[action.type]?.name||'Plant'} ${action.kind==='remove'?'removed':'placed'}.`);
 if(action.kind==='day'&&world.day===7&&!world.summarySeen){world.summarySeen=true;pause();showWeek();render();}
 return true;
}
function apply(slot){
 if(!selected){nudge();return;}
 if(selected.kind==='trowel'){q('#soils').classList.add('suggest');return;}
 if(selected.kind==='plant')slot=slot??world.plants.findIndex(p=>!p);
 if(selected.kind==='plant'&&slot<0)slot=1;
 commit({...selected,slot});
}
function nudge(){const e=q('.bottle-wrap');e.classList.remove('shake');void e.offsetWidth;e.classList.add('shake');if(!world.soil)q('#soils').classList.add('suggest');say(!world.soil?'Choose a soil tray, then place the soil in the jar.':'Pick an object from a shelf, then place it in the jar.');}
function toolPicture(){if(!selected)return '';if(selected.kind==='soil')return trowel(selected.type);if(selected.kind==='trowel')return trowel();if(selected.kind==='plant')return pottedPlant(selected.type);if(selected.kind==='creature')return bugBox(selected.type);return sprayer();}
function render(options={}){
 const focused=document.activeElement;const slotFocus=focused?.dataset?.slot;
 q('#bottle').innerHTML=jar(world,{...options,preview:selected?.kind==='plant'?selected:null});
 if(options.soilFlight||options.water){clearTimeout(effectTimer);effectTimer=setTimeout(()=>{q('#bottle').innerHTML=jar(world,{preview:selected});},1050);}
 q('.bottle-wrap').classList.toggle('target-ready',Boolean(selected&&selected.kind!=='trowel'));
 q('#drop-targets').innerHTML=`<button class="jar-target" aria-label="${selected?'Place selected object into terrarium':'Terrarium'}"></button>`+(selected?.kind==='plant'&&world.soil?[0,1,2].map((i)=>`<button class="plant-slot" style="--x:${[34,50,66][i]}%" data-slot="${i}" aria-label="${world.plants[i]?'Replace':'Plant in'} ${['left','middle','right'][i]} position">${glyph(world.plants[i]?'undo':'leaf')}</button>`).join(''):'');
 if(slotFocus!==undefined)q(`[data-slot="${slotFocus}"]`)?.focus();
 for(const b of document.querySelectorAll('[data-kind]')){
  const active=selected?.kind===b.dataset.kind&&selected?.type===b.dataset.type;b.setAttribute('aria-pressed',String(active));
  b.disabled=b.dataset.kind==='plant'?!world.soil:b.dataset.kind==='creature'?!ready(world):false;
  if(b.dataset.kind==='creature'){b.classList.toggle('added',world.creatures.includes(b.dataset.type));b.setAttribute('aria-label',`${world.creatures.includes(b.dataset.type)?'Remove':'Pick up'} ${CREATURES[b.dataset.type].name}`);}
  b.classList.toggle('suggest',b.dataset.kind==='soil'&&!world.soil||b.dataset.kind==='plant'&&world.soil&&!ready(world));
 }
 q('#trowel').setAttribute('aria-pressed',String(selected?.kind==='trowel'||selected?.kind==='soil'));q('#trowel').innerHTML=trowel(selected?.kind==='soil'?selected.type:null);
 q('#sprayer').disabled=!world.soil;q('#sprayer').setAttribute('aria-pressed',String(selected?.kind==='water'));q('#sprayer').classList.toggle('suggest',ready(world)&&!world.gameWatered);
 q('#lamps').innerHTML=pendant(world.light);q('#light-dial').innerHTML=dimmer(world.light);q('#light-dial').setAttribute('aria-valuenow',String(world.light));q('#light-dial').setAttribute('aria-valuetext',`${world.light} percent`);
 q('#game').style.setProperty('--lamp',String(world.light/70));
 q('#undo').disabled=!undoStack.length;q('#day').disabled=!ready(world);q('#play').disabled=!ready(world);q('#play').innerHTML=glyph(playing?'pause':'play');q('#play').setAttribute('aria-label',playing?'Pause time':'Play time');q('#play').setAttribute('aria-pressed',String(playing));
 q('#time-dock').classList.toggle('ready',ready(world));
 q('#week-orbit').innerHTML=Array.from({length:7},(_,i)=>`<i class="day-seed ${i<world.day?'filled':''} ${i===(world.day-1)%7?'today':''}"></i>`).join('');
 q('#readings').style.opacity=world.soil?'1':'0';q('#readings').innerHTML=[['drop',world.moisture],['sun',world.light],['leaf',meanHealth(world)]].map(([g,value])=>`<span class="reading">${glyph(g)}<span class="beads">${Array.from({length:5},(_,i)=>`<i class="bead ${i<Math.ceil(value/20)?'on':''}"></i>`).join('')}</span></span>`).join('');
 q('#carried').innerHTML=toolPicture();q('#carried').classList.toggle('active',Boolean(selected&&lastPointer&&!lastPointer.touch));document.body.classList.toggle('carrying',Boolean(selected));
 if(lastPointer)positionCarried(lastPointer.x,lastPointer.y);
 requestAnimationFrame(drawCue);
}
function drawCue(){
 const cue=q('#visual-cue');if(!selected||selected.kind==='trowel'){cue.innerHTML='';return;}
 const source=selected.kind==='water'?q('#sprayer'):q(`[data-kind="${selected.kind}"][data-type="${selected.type}"]`);if(!source)return;
 const a=source.getBoundingClientRect(),b=q('.bottle-wrap').getBoundingClientRect(),r=q('#game').getBoundingClientRect();const x=a.x+a.width/2-r.x,y=a.y+a.height/2-r.y,tx=b.x+b.width*.5-r.x,ty=b.y+b.height*.58-r.y;
 cue.innerHTML=svg(`<path class="cue-path" d="M${x} ${y}Q${tx} ${y-100} ${tx} ${ty}"/><g transform="translate(${tx-11} ${ty-17}) scale(1.3)" class="cue-hand">${glyph('hand').replace(/<svg[^>]*>|<\/svg>/g,'')}</g>`,`0 0 ${r.width} ${r.height}`);
}
function positionCarried(x,y){q('#carried').style.left=`${x}px`;q('#carried').style.top=`${y}px`;}
function showWeek(){const report=weekReport(world);q('#week-title').textContent=report.title;q('#week-summary').textContent=report.summary;q('#week-advice').textContent=report.advice;q('#week-stats').innerHTML=[['Plant health',`${report.health}%`],['Soil moisture',`${report.moisture}%`],['Light',`${report.light}%`],['Waterings',report.waterings]].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');q('#week-picture').innerHTML=jar(world,{celebrate:meanHealth(world)>=60});q('#week-marks').innerHTML=world.history.slice(0,7).map(h=>`<span class="${h.health<50?'muted':''}">${glyph(h.health>=50?'leaf':'drop')}</span>`).join('');q('#week-dialog').showModal();q('#continue').focus();}
document.addEventListener('click',event=>{
 if(suppressClick){suppressClick=false;return;}
 const b=event.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.kind){choose({kind:b.dataset.kind,type:b.dataset.type},event);return;}
 if(b.dataset.slot!==undefined){apply(Number(b.dataset.slot));return;}
 if(b.classList.contains('jar-target')){apply();return;}
 switch(b.id){
 case 'trowel':choose({kind:'trowel'},event);break;
 case 'sprayer':choose({kind:'water'},event);break;
 case 'day':pause();commit({kind:'day'});break;
 case 'play':if(playing){pause();render();}else{selected=null;playing=true;timer=setInterval(()=>commit({kind:'day'}),2400);render();}break;
 case 'undo':pause();if(undoStack.length){world=undoStack.pop();selected=null;render();say('Last action undone.');}break;
 case 'reset':pause();selected=null;render();q('#reset-picture').innerHTML=jar(newWorld());q('#reset-dialog').showModal();q('#cancel-reset').focus();break;
 case 'cancel-reset':q('#reset-dialog').close();q('#reset').focus();break;
 case 'confirm-reset':q('#reset-dialog').close();world=newWorld();undoStack=[];selected=null;render();q('#trowel').focus();say('A fresh terrarium.');break;
 case 'continue':q('#week-dialog').close();q('#day').focus();break;
 }
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){selected=null;pause();render();}if(event.key==='z'&&(event.ctrlKey||event.metaKey)&&!q('dialog[open]')){event.preventDefault();q('#undo').click();}});
document.addEventListener('pointerdown',event=>{
 if(event.target.closest('#light-dial')){event.preventDefault();pause();selected=null;const dial=q('#light-dial'),r=dial.getBoundingClientRect();dialDrag={before:copy(world),angle:Math.atan2(event.clientX-r.x-r.width/2,r.y+r.height/2-event.clientY)*180/Math.PI,light:world.light};dial.setPointerCapture?.(event.pointerId);dial.focus();render();return;}
 const b=event.target.closest('[data-kind],#sprayer');if(!b||b.disabled||event.button!==0)return;
 drag={x:event.clientX,y:event.clientY,item:b.id==='sprayer'?{kind:'water'}:{kind:b.dataset.kind,type:b.dataset.type},active:false,pointer:event.pointerId,button:b};
});
document.addEventListener('pointermove',event=>{
 if(dialDrag){event.preventDefault();const r=q('#light-dial').getBoundingClientRect(),angle=Math.atan2(event.clientX-r.x-r.width/2,r.y+r.height/2-event.clientY)*180/Math.PI;let delta=angle-dialDrag.angle;if(delta>180)delta-=360;if(delta< -180)delta+=360;dialDrag.light=Math.max(0,Math.min(100,dialDrag.light+delta/2.7));dialDrag.angle=angle;act(world,{kind:'light',value:dialDrag.light});render();return;}
 lastPointer={x:event.clientX,y:event.clientY,touch:event.pointerType==='touch'};
 if(drag&&!drag.active&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>10){drag.active=true;pause();selected=drag.item;render();}
 if(drag?.active){event.preventDefault();q('#carried').classList.add('active');}
 if(selected)positionCarried(event.clientX,event.clientY);
},{passive:false});
document.addEventListener('pointerup',event=>{
 if(dialDrag){if(world.light!==dialDrag.before.light)undoStack.push(dialDrag.before);dialDrag=null;render();say(`Light set to ${world.light} percent.`);return;}
 if(drag?.active){const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.plant-slot,.jar-target');if(target)apply(target.dataset.slot===undefined?undefined:Number(target.dataset.slot));suppressClick=true;setTimeout(()=>{suppressClick=false;},0);if(event.pointerType==='touch')q('#carried').classList.remove('active');}
 drag=null;
});
document.addEventListener('pointercancel',()=>{if(dialDrag){world=dialDrag.before;dialDrag=null;render();}drag=null;q('#carried').classList.remove('active');});
q('#light-dial').addEventListener('keydown',event=>{const changes={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:10,PageDown:-10};let value;if(event.key==='Home')value=0;else if(event.key==='End')value=100;else if(event.key in changes)value=Math.max(0,Math.min(100,world.light+changes[event.key]));else return;event.preventDefault();pause();if(value!==world.light)commit({kind:'light',value});});
q('#light-dial').addEventListener('wheel',event=>{event.preventDefault();pause();const value=Math.max(0,Math.min(100,world.light+(event.deltaY<0?5:-5)));if(value!==world.light)commit({kind:'light',value});},{passive:false});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});
window.addEventListener('resize',fitStage);
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('cancel',()=>{pause();selected=null;render();});
render();fitStage();
