import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const DOT = document.getElementById('cur-dot')
    const RNG = document.getElementById('cur-ring')
    const HAL = document.getElementById('cur-halo')
    let mx=0,my=0,rx=0,ry=0,hx=0,hy=0

    const onMouseMove = e => {
      mx=e.clientX; my=e.clientY
      DOT.style.left=mx+'px'; DOT.style.top=my+'px'
    }
    document.addEventListener('mousemove', onMouseMove)
    let reqId = 0
    ;(function loop() {
      rx+=(mx-rx)*.14; ry+=(my-ry)*.14
      hx+=(mx-hx)*.06; hy+=(my-hy)*.06
      RNG.style.left=rx+'px'; RNG.style.top=ry+'px'
      HAL.style.left=hx+'px'; HAL.style.top=hy+'px'
      reqId = requestAnimationFrame(loop)
    })()

    const hov = []
    function addHov(sel){
      document.querySelectorAll(sel).forEach(el=>{
        const onMouseEnter = () => document.body.classList.add('is-hovering')
        const onMouseLeave = () => document.body.classList.remove('is-hovering')
        el.addEventListener('mouseenter', onMouseEnter)
        el.addEventListener('mouseleave', onMouseLeave)
        hov.push({ el, onMouseEnter, onMouseLeave })
      })
    }
    addHov('a,button,.bc,.pc,.how-step,input,label,.oauth-btn')

    const onMouseDown = () => document.body.classList.add('is-clicking')
    const onMouseUp = () => document.body.classList.remove('is-clicking')
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(reqId)
      hov.forEach(({ el, onMouseEnter, onMouseLeave }) => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
      })
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
