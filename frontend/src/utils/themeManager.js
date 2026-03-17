const THEMES = {
    dark:  {'--clr-bg':'#070605','--clr-surface':'#0e0c09','--clr-card':'#161310','--clr-text':'#f0ebe0','--clr-muted':'#786e5e','--clr-border':'rgba(201,168,76,0.12)','--clr-accent':'#c9a84c','--clr-accent2':'#e8b050'},
    light: {'--clr-bg':'#f7f3ea','--clr-surface':'#ede8d8','--clr-card':'#ffffff','--clr-text':'#1a1208','--clr-muted':'#7a6a50','--clr-border':'rgba(0,0,0,0.09)','--clr-accent':'#9a7020','--clr-accent2':'#b88830'},
    sand:  {'--clr-bg':'#e6d8b8','--clr-surface':'#dccfa8','--clr-card':'#eddfc4','--clr-text':'#221606','--clr-muted':'#8a6a40','--clr-border':'rgba(0,0,0,0.11)','--clr-accent':'#a84e10','--clr-accent2':'#c86020'},
    ocean: {'--clr-bg':'#030c18','--clr-surface':'#061422','--clr-card':'#091e30','--clr-text':'#c8e8f4','--clr-muted':'#406878','--clr-border':'rgba(60,160,220,0.10)','--clr-accent':'#30b8d0','--clr-accent2':'#18a0b8'},
};
  
  export const setTheme = (key) => {
    if(!THEMES[key]) return
    const html = document.documentElement
    const root = document.documentElement.style
  
    const apply=()=>{
      html.setAttribute('data-theme',key)
      Object.entries(THEMES[key]).forEach(([k,v])=>root.setProperty(k,v))
      document.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',s.dataset.t===key))
      try{ localStorage.setItem('ll-theme',key) }catch(e){}
    }
  
    if(typeof document.startViewTransition==='function'){
      const t = document.startViewTransition(apply)
      const btn = document.querySelector(`.sw[data-t="${key}"]`)
      if(btn && t.ready){
        const r=btn.getBoundingClientRect()
        const x=r.left+r.width/2, y=r.top+r.height/2
        const vw=window.innerWidth, vh=window.innerHeight
        const maxR=Math.hypot(Math.max(x,vw-x),Math.max(y,vh-y))
        t.ready.then(()=>{
          html.animate(
            {clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${maxR}px at ${x}px ${y}px)`]},
            {duration:520,easing:'cubic-bezier(0.22,1,0.36,1)',pseudoElement:'::view-transition-new(root)'}
          )
        })
      }
    } else { apply() }
  };
  
  export const initTheme = () => {
    const saved = (()=>{ try{return localStorage.getItem('ll-theme')}catch(e){return null} })()
    if(saved && THEMES[saved]) setTheme(saved)
  };
