import {jar,bug} from './game-art.js';
export function gardenJar(s,options={}){
 const scene=jar({...s,creatures:[]},options);
 const residents=s.creatures.map((type,k)=>[0,1].map(i=>{
 const x=type==='springtails'?183+i*110:250+i*112,y=type==='springtails'?329+i*7:331+i*3;
 return `<g class="visible-resident" data-resident="${type}" transform="translate(${x} ${y})"><g class="resident-walk" style="animation-delay:-${i*2+k}s">${bug(type,0,0,type==='springtails'?.88:.82)}</g></g>`;
 }).join('')).join('');
 return scene.replace('</svg>',`<g class="resident-foreground">${residents}</g></svg>`);
}
