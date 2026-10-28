(()=>{
 const root=document.querySelector('.service-universe');if(!root)return;
 const stage=root.querySelector('.universe-stage'),items=[...root.querySelectorAll('li')],button=root.querySelector('button'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 root.querySelectorAll('.universe-halo,.universe-ring,.universe-core').forEach(el=>el.remove());
 const canvas=document.createElement('canvas');canvas.className='universe-canvas';canvas.setAttribute('aria-hidden','true');stage.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx)return;
 let phase=0,paused=false,hover=false,focused=false,visible=false,last=0,frame=0,w=0,h=0;
 const points=[],stars=[];let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
 for(let i=0;i<1400;i++){const y=1-2*(i+.5)/1400,a=i*Math.PI*(3-Math.sqrt(5)),r=Math.sqrt(1-y*y);points.push([Math.cos(a)*r,y,Math.sin(a)*r])}
 for(let i=0;i<100;i++)stars.push([rand(),rand(),rand()]);
 const edges=[];points.forEach((p,i)=>{for(let j=i+1;j<points.length;j++){const q=points[j],d=(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2;if(d<.018)edges.push([i,j])}});
 function project(p,r){const a=phase*.33,xx=p[0]*Math.cos(a)+p[2]*Math.sin(a),zz=-p[0]*Math.sin(a)+p[2]*Math.cos(a),yy=p[1]*.96-zz*.28,z=p[1]*.28+zz*.96,perspective=3.8/(3.8-z);return [w/2+xx*r*perspective,h/2+yy*r*perspective,z]}
 function line(points,color,width=.6){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
 function draw(){
  if(!w||!h)return;ctx.clearRect(0,0,w,h);const r=Math.min(w*.34,h*.4),cx=w/2,cy=h/2;
  const halo=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.4);halo.addColorStop(0,'#44245a55');halo.addColorStop(.65,'#27133e38');halo.addColorStop(1,'#130d2400');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
  stars.forEach(([x,y,v])=>{ctx.fillStyle='rgba(209,185,239,'+(.12+v*.3)+')';ctx.fillRect(x*w,y*h,v>.8?1.3:.7,v>.8?1.3:.7)});
  const projected=points.map(p=>project(p,r));edges.forEach(([i,j])=>{const depth=(projected[i][2]+projected[j][2])/2;line([projected[i],projected[j]],'rgba(174,126,221,'+(.035+(depth+1)*.055)+')',.5)});
  projected.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],.45+(p[2]+1)*.38,0,Math.PI*2);ctx.fillStyle='rgba(210,181,240,'+(.2+(p[2]+1)*.28)+')';ctx.fill()});
  for(let k=0;k<4;k++){const orbit=[];for(let j=0;j<=140;j++){const a=j/140*Math.PI*2,tilt=k*.8+.3,x=Math.cos(a)*r*1.18,y=Math.sin(a)*r*.34;orbit.push([cx+x*Math.cos(tilt)-y*Math.sin(tilt),cy+x*Math.sin(tilt)+y*Math.cos(tilt)])}line(orbit,k%2?'#9cbf7840':'#bf8ce44d',.7)}
  const core=ctx.createRadialGradient(cx,cy,1,cx,cy,r*.33);core.addColorStop(0,'#fff');core.addColorStop(.08,'#f9e6ff');core.addColorStop(.25,'#dba8f6b0');core.addColorStop(1,'#b16be900');ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,r*.33,0,Math.PI*2);ctx.fill();
  const corePts=Array.from({length:20},(_,i)=>{const y=1-2*(i+.5)/20,a=i*Math.PI*(3-Math.sqrt(5)),q=Math.sqrt(1-y*y);return project([Math.cos(a)*q,y,Math.sin(a)*q],r*.21)});corePts.forEach((p,i)=>{corePts.slice(i+1).forEach(q=>{if(Math.hypot(p[0]-q[0],p[1]-q[1])<r*.23)line([p,q],'#e6c7fa65',.65)})});
  items.forEach((el,i)=>{const a=-Math.PI/2+i*Math.PI/3+phase*.28,rx=w/2-el.offsetWidth/2-10,ry=h*.36,x=Math.cos(a)*rx,y=Math.sin(a)*ry;el.style.transform='translate(calc(-50% + '+x+'px),calc(-50% + '+y+'px))';const sx=cx+x,sy=cy+y;ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);ctx.strokeStyle=i%2?'#c0dda0':'#e1bcff';ctx.shadowBlur=13;ctx.shadowColor=ctx.strokeStyle;ctx.stroke();ctx.shadowBlur=0;line([[cx+(sx-cx)*.23,cy+(sy-cy)*.23],[sx,sy]],'#c19bdb25',.65)});
 }
 function tick(t){frame=0;if(last)phase+=Math.min(t-last,50)/1000*.15;last=t;draw();frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(!paused&&!hover&&!focused&&!reduce.matches&&visible&&!document.hidden)frame=requestAnimationFrame(tick);button.hidden=reduce.matches;button.textContent=paused?'Retomar movimento':'Pausar movimento';button.setAttribute('aria-pressed',String(paused));draw()}
 new ResizeObserver(()=>{w=stage.clientWidth;h=stage.clientHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);root.classList.add('universe-ready');draw()}).observe(stage);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()}).observe(root);
 button.addEventListener('click',()=>{paused=!paused;sync()});stage.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync()}});stage.addEventListener('pointerleave',()=>{hover=false;sync()});stage.addEventListener('focusin',()=>{focused=true;sync()});stage.addEventListener('focusout',e=>{focused=stage.contains(e.relatedTarget);sync()});document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);sync();
})();
