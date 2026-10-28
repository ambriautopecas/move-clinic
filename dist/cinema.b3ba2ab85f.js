(()=>{
  const gsap=window.gsap,ST=window.ScrollTrigger;if(!gsap||!ST)return;
  gsap.registerPlugin(ST);ST.config({ignoreMobileResize:true});
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),wide=matchMedia('(min-width: 751px)'),short=matchMedia('(max-height: 699px)');
  const story=document.querySelector('.pilates-story'),panels=[...document.querySelectorAll('.pilates-panel')],frames=[...document.querySelectorAll('.pilates-frame')],steps=[...document.querySelectorAll('[data-story-step]')];
  const control=document.createElement('button');control.className='motion-toggle';control.type='button';control.textContent='Pausar efeitos de rolagem';control.setAttribute('aria-pressed','false');
  document.querySelector('.footer-socials')?.append(control);
  let paused=false,context,storyTrigger,active=-1;
  function setChapter(index){if(active===index)return;active=index;panels.forEach((p,i)=>{p.classList.toggle('is-active',i===index);p.setAttribute('aria-hidden',String(i!==index))});frames.forEach((f,i)=>f.classList.toggle('is-active',i===index));steps.forEach((s,i)=>s.setAttribute('aria-pressed',String(i===index)))}
  function reset(){context?.revert();context=null;document.documentElement.classList.remove('cinema-motion');story?.classList.remove('story-enhanced');document.body.classList.remove('in-story');panels.forEach(p=>p.removeAttribute('aria-hidden'));storyTrigger=null;active=-1;}
  function setup(){reset();control.hidden=reduce.matches;if(reduce.matches||paused){control.textContent=paused?'Ativar efeitos de rolagem':'Pausar efeitos de rolagem';ST.refresh();return}
    if(wide.matches)document.documentElement.classList.add('cinema-motion');
    const enhanceStory=wide.matches||!short.matches;if(enhanceStory)story.classList.add('story-enhanced');
    context=gsap.context(()=>{
      if(wide.matches){
        const hero=gsap.timeline({scrollTrigger:{id:'move-hero',trigger:'.cinema-hero',start:'top 86px',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true}});
        hero.to('.cinema-photo',{inset:'0% 0% 0% 0%',borderRadius:0,ease:'none',duration:1},0)
          .to('.cinema-photo>img',{scale:1.04,objectPosition:'50% 50%',ease:'none',duration:1},0)
          .to('.cinema-shade',{opacity:1,ease:'none',duration:.8},.1)
          .fromTo('.cinema-hero-copy',{y:0,color:'#292d2b'},{y:-28,color:'#ffffff',ease:'none',duration:1},0)
          .fromTo('.cinema-hero-copy h1 em',{color:'#9558ac'},{color:'#e3c8ef',duration:1,ease:'none'},0)
          .fromTo('.cinema-intro,.cinema-scroll',{color:'#292d2b'},{color:'#ffffff',duration:1,ease:'none'},0)
          .fromTo('.cinema-sub',{color:'#646d5e'},{color:'#ffffff',duration:1,ease:'none'},0)
          .fromTo('.cinema-hero-action>span',{color:'#697260'},{color:'#ffffff',duration:1,ease:'none'},0)
          .to('.hero-progress>span',{scaleX:1,ease:'none',duration:1},0);
      }else{
        gsap.fromTo('.cinema-photo>img',{scale:1},{scale:1.03,ease:'none',scrollTrigger:{trigger:'.cinema-photo',start:'top 85%',end:'bottom 15%',scrub:.5}});
      }
      gsap.fromTo('.reveal-statement>*',{opacity:.25,y:25},{opacity:1,y:0,stagger:.25,ease:'none',scrollTrigger:{id:'move-manifesto',trigger:'.movement-manifesto',start:'top 80%',end:'bottom 65%',scrub:.6}});
      if(enhanceStory){
        gsap.set(frames,{autoAlpha:0});gsap.set(frames[0],{autoAlpha:1});gsap.set(panels,{autoAlpha:0,y:22});gsap.set(panels[0],{autoAlpha:1,y:0});
        const tl=gsap.timeline({scrollTrigger:{id:'move-pilates',trigger:story,start:()=>story.offsetTop-(wide.matches?86:80),end:()=>story.offsetTop+story.offsetHeight-window.innerHeight,scrub:.45,invalidateOnRefresh:true,onUpdate:self=>setChapter(Math.min(2,Math.floor(self.progress*3)))}});
        frames.forEach((frame,i)=>{tl.fromTo(frame.querySelector('img'),{scale:1},{scale:i===2?1.03:1.08,duration:1,ease:'none'},i);if(i){tl.to(frames[i-1],{autoAlpha:0,duration:.2},i-.1).to(frame,{autoAlpha:1,duration:.2},i-.1).to(panels[i-1],{autoAlpha:0,y:-20,duration:.18},i-.1).to(panels[i],{autoAlpha:1,y:0,duration:.22},i-.05)}});
        tl.fromTo('.pilates-line>span',{scaleX:0},{scaleX:1,duration:3,ease:'none'},0);storyTrigger=tl.scrollTrigger;setChapter(0);
      }else{
        panels.forEach(p=>p.removeAttribute('aria-hidden'));
        gsap.fromTo('.pilates-visual img',{scale:1},{scale:1.04,scrollTrigger:{trigger:'.pilates-visual',start:'top bottom',end:'bottom top',scrub:.5}});
      }
      document.querySelectorAll('.editorial-feature').forEach(feature=>{
        gsap.fromTo(feature.querySelector('img'),{scale:wide.matches?1.14:1.06,yPercent:wide.matches?-4:0},{scale:1,yPercent:wide.matches?4:0,ease:'none',scrollTrigger:{trigger:feature,start:'top bottom',end:'bottom top',scrub:.6}});
        gsap.fromTo(feature.querySelector('.editorial-copy'),{y:wide.matches?55:20},{y:0,ease:'none',scrollTrigger:{trigger:feature,start:'top 85%',end:'center 60%',scrub:.5}});
      });
      gsap.fromTo('.priscila-photo img',{scale:1.08},{scale:1,ease:'none',scrollTrigger:{trigger:'.priscila',start:'top 90%',end:'center center',scrub:.6}});
    });
    ST.refresh();
  }
  steps.forEach(button=>button.addEventListener('click',()=>{if(!storyTrigger)return;const progress=(Number(button.dataset.storyStep)+.4)/3;window.scrollTo({top:storyTrigger.start+(storyTrigger.end-storyTrigger.start)*progress,behavior:'smooth'})}));
  control.addEventListener('click',()=>{paused=!paused;control.setAttribute('aria-pressed',String(paused));control.textContent=paused?'Ativar efeitos de rolagem':'Pausar efeitos de rolagem';setup()});
  reduce.addEventListener('change',setup);wide.addEventListener('change',setup);short.addEventListener('change',setup);
  setup();if(story&&'IntersectionObserver' in window)new IntersectionObserver(([entry])=>document.body.classList.toggle('in-story',entry.isIntersecting)).observe(story);document.fonts.ready.then(()=>ST.refresh());
  document.querySelectorAll('.cinema-photo img,.pilates-frame img,.editorial-image img').forEach(img=>{if(!img.complete)img.addEventListener('load',()=>ST.refresh(),{once:true})});
})();
