import React, { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const DOT = document.getElementById('cur-dot')
    const RNG = document.getElementById('cur-ring')
    const HAL = document.getElementById('cur-halo')
    let mx=0,my=0,rx=0,ry=0,hx=0,hy=0

    const onMouseMove = (e) => {
      mx=e.clientX; my=e.clientY
      if(DOT) { DOT.style.left=mx+'px'; DOT.style.top=my+'px' }
    }
    document.addEventListener('mousemove', onMouseMove)
    
    let reqId;
    ;(function loop(){
      rx+=(mx-rx)*.14; ry+=(my-ry)*.14
      hx+=(mx-hx)*.06; hy+=(my-hy)*.06
      if(RNG) { RNG.style.left=rx+'px'; RNG.style.top=ry+'px' }
      if(HAL) { HAL.style.left=hx+'px'; HAL.style.top=hy+'px' }
      reqId = requestAnimationFrame(loop)
    })()

    const onMouseEnter = () => document.body.classList.add('is-hovering')
    const onMouseLeave = () => document.body.classList.remove('is-hovering')
    const onMouseDown = () => document.body.classList.add('is-clicking')
    const onMouseUp = () => document.body.classList.remove('is-clicking')

    const attachHover = () => {
      document.querySelectorAll('a, button, .bc, .pc, input, label, .oauth-btn').forEach(el=>{
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.addEventListener('mouseenter', onMouseEnter)
        el.addEventListener('mouseleave', onMouseLeave)
      })
    }
    
    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(reqId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cur-dot"></div>
      <div id="cur-ring"></div>
      <div id="cur-halo"></div>
    </>
  )
}
export default CustomCursor;
