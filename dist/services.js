(() => {
  const cards=[...document.querySelectorAll('.treatment-card')];
  const buttons=[...document.querySelectorAll('[data-category]')];
  const input=document.querySelector('#service-search');
  const clear=document.querySelector('#clear-search');
  const empty=document.querySelector('.care-empty');
  const count=document.querySelector('#service-count');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let category='all',timer;
  const clean=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  function update(animate=true){
    const q=clean(input.value),shown=[];
    cards.forEach(card=>{
      const categoryMatches=category==='all'||card.dataset.categories.split(' ').includes(category);
      const queryMatches=clean(card.dataset.name+' '+card.querySelector('.treatment-tag').textContent).includes(q);
      card.hidden=!(categoryMatches&&queryMatches);if(!card.hidden)shown.push(card);
    });
    clear.hidden=!input.value;empty.hidden=shown.length>0;
    count.textContent=shown.length===1?'1 atendimento encontrado':`${shown.length} atendimentos ${category==='all'&&!q?'para conhecer':'encontrados'}`;
    if(animate&&window.gsap&&!reduce.matches){window.gsap.killTweensOf(cards);if(shown.length)window.gsap.fromTo(shown,{y:12,opacity:.3},{y:0,opacity:1,duration:.38,stagger:.025,clearProps:'transform,opacity',overwrite:true});}
  }
  buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();}));
  input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>update(),120);});
  clear.addEventListener('click',()=>{input.value='';update();input.focus();});
  document.querySelector('#reset-services').addEventListener('click',()=>{input.value='';category='all';buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category==='all')));update();input.focus();});
  update(false);
  const loadScript=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.append(s);});
  const tasks=[];
  const visible=new Map();
  const observe=(el,callback)=>{const o=new IntersectionObserver(([e])=>{visible.set(el,e.isIntersecting);callback(e.isIntersecting&&!document.hidden);},{rootMargin:'60px'});o.observe(el);const onVisibility=()=>callback(visible.get(el)&&!document.hidden);document.addEventListener('visibilitychange',onVisibility);return{disconnect(){o.disconnect();document.removeEventListener('visibilitychange',onVisibility);}};};
  let generation=0;
  async function startMotion(){
    if(reduce.matches)return;
    const gen=++generation;
    try{
      if(!window.gsap)await loadScript('assets/vendor/gsap.min.js');if(reduce.matches||gen!==generation)return;
      const gsap=window.gsap;
      const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){gsap.fromTo(e.target,{y:22,opacity:.5},{y:0,opacity:1,duration:.7,clearProps:'transform,opacity',ease:'power2.out'});reveal.unobserve(e.target);}}),{threshold:.12});
      document.querySelectorAll('.care-heading-copy,.treatment-card,.location-panel').forEach(el=>reveal.observe(el));
      tasks.push(()=>{reveal.disconnect();gsap.killTweensOf('.treatment-card,.care-heading-copy,.priscila-photo,.location-panel');document.querySelectorAll('.treatment-card,.care-heading-copy,.priscila-photo,.location-panel').forEach(el=>{el.style.opacity='';el.style.transform='';});});
    }catch{/* Content and filters are independent of animation libraries. */}
    if(reduce.matches||gen!==generation)return;
    // Load the canvas libraries only when their own section is near the viewport.
    const lazy=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;lazy.unobserve(e.target);if(e.target.id==='hero-flow')initFlow(gen);else initSphere(gen);}),{rootMargin:'140px'});
    const flow=document.querySelector('#hero-flow');if(flow)lazy.observe(flow);
    const sphere=document.querySelector('#care-sphere');if(sphere&&matchMedia('(min-width: 800px)').matches)lazy.observe(sphere);
    tasks.push(()=>lazy.disconnect());
  }
  async function initFlow(gen){
    const host=document.querySelector('#hero-flow');if(!host||reduce.matches)return;
    try{
      await loadScript('assets/vendor/p5.min.js');if(reduce.matches||gen!==generation)return;
      const sketch=new window.p5(p=>{let t=0;
        p.setup=()=>{p.createCanvas(host.clientWidth,host.clientHeight);p.pixelDensity(1);p.frameRate(20);p.noFill();};
        p.draw=()=>{p.clear();t+=.009;for(let j=0;j<5;j++){p.stroke(j%2===0?p.color(154,91,179,48):p.color(131,160,89,55));p.strokeWeight(1.15);p.beginShape();for(let x=-20;x<=p.width+20;x+=12){const y=p.height*.35+j*14+Math.sin(x/p.width*4+t+j*.17)*p.height*.12;p.vertex(x,y);}p.endShape();}};
      },host);
      const resize=new ResizeObserver(()=>{if(sketch.canvas)sketch.resizeCanvas(host.clientWidth,host.clientHeight);});resize.observe(host);
      const observer=observe(host,active=>active?sketch.loop():sketch.noLoop());
      tasks.push(()=>{observer.disconnect();resize.disconnect();sketch.remove();});
    }catch{/* Keep the existing hero image and background when unavailable. */}
  }
  async function initSphere(gen){
    const host=document.querySelector('#care-sphere');if(!host||reduce.matches)return;
    try{
      const THREE=await import('./assets/vendor/three.module.js');if(reduce.matches||gen!==generation)return;
      let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(host.clientWidth,host.clientHeight);host.append(renderer.domElement);
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,host.clientWidth/host.clientHeight,.1,20);camera.position.z=4.2;
      const geometry=new THREE.SphereGeometry(1,26,18),material=new THREE.MeshBasicMaterial({color:0xa982ba,wireframe:true,transparent:true,opacity:.28});const ball=new THREE.Mesh(geometry,material);ball.rotation.z=-.35;scene.add(ball);
      const ringGeometry=new THREE.TorusGeometry(1.23,.009,6,80),ringMaterial=new THREE.MeshBasicMaterial({color:0x9ab575,transparent:true,opacity:.65}),ring=new THREE.Mesh(ringGeometry,ringMaterial);ring.rotation.x=1.07;ring.rotation.y=.35;scene.add(ring);
      let active=false,id=0,last=0,theta=0;
      function render(now){if(!active)return;id=requestAnimationFrame(render);if(now-last<40)return;last=now;theta+=.003;ball.rotation.y=theta;ring.rotation.z=theta*.5;renderer.render(scene,camera);}
      const observer=observe(host,on=>{active=on;cancelAnimationFrame(id);if(on)id=requestAnimationFrame(render);});
      const resize=new ResizeObserver(()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);});resize.observe(host);
      tasks.push(()=>{active=false;cancelAnimationFrame(id);observer.disconnect();resize.disconnect();geometry.dispose();material.dispose();ringGeometry.dispose();ringMaterial.dispose();renderer.dispose();renderer.domElement.remove();});
    }catch{/* Decorative 3D is optional; all services remain available. */}
  }
  reduce.addEventListener('change',()=>{generation++;while(tasks.length)tasks.pop()();if(!reduce.matches)startMotion();});
  const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,600));idle(()=>startMotion());
})();

// Keep the floating shortcut out of the service cards on small screens.
(()=>{const section=document.querySelector('#cuidados');const o=new IntersectionObserver(([e])=>document.body.classList.toggle('in-services',e.isIntersecting),{threshold:0});if(section)o.observe(section);})();
