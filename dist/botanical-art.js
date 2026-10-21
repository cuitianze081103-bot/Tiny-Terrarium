// Deterministic botanical drawing. Separate back/front passes let different plants interweave.
export function botanicalPlant(type,health=90,layer='all',variant=0){
 const colors=health<30?['#a79a62','#847b4e','#c4b57a','#746d47']:health<60?['#8e9c63','#6c8051','#b7c486','#576b47']:['#779b55','#3e704c','#b1c977','#2c5944'];
 const [light,green,pale,dark]=colors;
 const leaf=(x,y,length,width,angle,color,round=false)=>`<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 0C${-width} ${-length*.12} ${-width*(round?1.22:.82)} ${-length*.83} 0 ${-length}C${width*(round?1.22:.74)} ${-length*.83} ${width} ${-length*.12} 0 0Z" fill="${color}" stroke="${dark}" stroke-opacity=".2" stroke-width=".55"/><path d="M-1 -2Q${-width*.2} ${-length*.46} 0 ${-length*.91}" stroke="${pale}" stroke-width=".7" opacity=".8"/><path d="M${-width*.25} ${-length*.17}Q${-width*.63} ${-length*.54} 0 ${-length*.85}" stroke="${pale}" stroke-width="${Math.max(.9,width*.26)}" stroke-linecap="round" opacity=".24"/>${round?`<path d="M0 ${-length*.38}q${-width*.54} -4 ${-width*.56} ${-length*.2}M0 ${-length*.57}q${width*.55} -1 ${width*.54} ${-length*.16}" stroke="${dark}" stroke-width=".5" opacity=".18"/>`:''}</g>`;
 const frond=(height,lean,index)=>{
  const segments=Array.from({length:12},(_,i)=>{const t=.12+i*.071,x=lean*t*t+4*Math.sin(t*3+index),y=-height*t,len=5+24*Math.sin(t*Math.PI)*Math.min(1,height/150);return leaf(x,y,len,2.8+len*.045,-66+lean*.12,colors[(i+index)%3])+leaf(x,y-3,len*.94,2.7+len*.045,66+lean*.12,colors[(i+index+1)%3]);}).join('');
  return `<g><path d="M0 1Q${-lean*.15} ${-height*.55} ${lean} ${-height}" fill="none" stroke="${dark}" stroke-width="1.25" stroke-linecap="round"/>${segments}${leaf(lean,-height*.97,13,2.7,lean*.3,light)}</g>`;
 };
 let back='',front='';
 if(type==='fern'){
  back=[[-68,150],[-31,193],[14,214],[64,171],[91,124]].map(([lean,h],i)=>`<g opacity="${.79+i%2*.12}">${frond(h,lean+(variant-1)*5,i)}</g>`).join('');
  front=[[-108,102],[-58,128],[39,139],[112,94]].map(([lean,h],i)=>`<g transform="translate(${(i-1)*4} ${i%2*4})">${frond(h,lean,i+2)}</g>`).join('');
 }else if(type==='moss'){
  const mound=`<path d="M-93-1Q-100-21-76-22Q-65-46-42-34Q-15-60 9-39Q36-51 53-30Q83-39 91-14Q106-4 87 7Q7 27-83 10Z" fill="${green}"/><path d="M-87-9Q-64-36-43-23Q-8-47 11-27Q48-41 79-15Q25 5-52 0Z" fill="${light}" opacity=".8"/><ellipse cx="-26" cy="-15" rx="39" ry="13" fill="${pale}" opacity=".2"/>`;
  const shoots=(count,foreground)=>Array.from({length:count},(_,i)=>{const x=-88+i*37%174,y=foreground?1+i*7%10:-15-i*11%17,h=13+i*7%20;return `<g transform="translate(${x} ${y})"><path d="M0 3Q3 ${-h*.5} 0 ${-h}" stroke="${dark}" stroke-width=".9"/>${[.25,.5,.75].map((t,k)=>leaf(0,-h*t,6+k*.8,1.9,-60,colors[(i+k)%3])+leaf(1,-h*t-2,6+k*.8,1.9,58,colors[(i+k+1)%3])).join('')}</g>`;}).join('');
  back=mound+shoots(23,false);front=`<path d="M-90 3Q-42 15 9 7Q56 8 88 1Q79 22 20 19Q-51 27-90 3Z" fill="${green}" opacity=".88"/>`+shoots(16,true);
 }else{
  const stem=(lean,height,index)=>{
   const pairs=[.28,.55,.8].map((t,i)=>{const x=lean*t*t,y=-height*t,len=42-i*4,w=18-i*1.7;return leaf(x,y,len,w,-61+lean*.14,colors[(index+i)%3],true)+leaf(x+2,y-10,len*.94,w*.94,54+lean*.14,colors[(index+i+1)%3],true);}).join('');
   return `<g><path d="M0 1Q${lean*.15} ${-height*.6} ${lean} ${-height}" stroke="${dark}" stroke-width="1.65"/>${pairs}${leaf(lean,-height*.9,32,13,lean*.15,light,true)}</g>`;
  };
  back=[[-42,134],[12,171],[66,137]].map(([lean,h],i)=>`<g opacity=".86">${stem(lean,h,i)}</g>`).join('');
  front=[[-104,86],[-21,110],[86,95]].map(([lean,h],i)=>stem(lean,h,i+1)).join('');
 }
 const shadow=`<ellipse cx="0" cy="4" rx="${type==='moss'?87:43}" ry="9" fill="${dark}" opacity=".12"/>`;
 return layer==='back'?shadow+back:layer==='front'?front:shadow+back+front;
}
