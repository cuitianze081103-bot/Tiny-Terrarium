import {jar,bug} from './game-art.js';
export function gardenJar(s,options={}){
 const scene=jar({...s,creatures:[]},options);
 const residents=s.creatures.map((type,k)=>[0,1].map(i=>{
 const x=type==='springtails'?183+i*110:250+i*112,y=type==='springtails'?367:379;
 return `<g class="visible-resident" data-resident="${type}" transform="translate(${x} ${y})"><ellipse cx="0" cy="6" rx="22" ry="9" fill="#f3ead0" opacity=".7"/><g class="resident-walk" style="animation-delay:-${i*2+k}s">${bug(type,0,0,type==='springtails'?.88:.82)}</g></g>`;
 }).join('')).join('');
 return scene.replace('</svg>',`<g class="resident-foreground">${residents}</g></svg>`);
}
