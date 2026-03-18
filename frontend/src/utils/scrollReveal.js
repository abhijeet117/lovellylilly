export const initScrollReveal = () => {
  const rvObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('on')
        if(e.target.classList.contains('how-step')){
          const bar=e.target.querySelector('.step-bar')
          if(bar) bar.style.width='50%'
        }
      }
    })
  },{threshold:0.08,rootMargin:'0px 0px -36px 0px'})

  document.querySelectorAll('.rv,.rv-sc,.rv-sl,.how-step').forEach(el=>rvObs.observe(el))

  const heroTimeout = setTimeout(()=>{
    document.querySelectorAll('#hero .rv,#hero .rv-sc').forEach(el=>el.classList.add('on'))
  },90)

  return () => {
    clearTimeout(heroTimeout)
    rvObs.disconnect()
  }
}
