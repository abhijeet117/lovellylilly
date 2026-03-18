export const initCardTilt = (selector) => {
  const tiltHandlers = []
  document.querySelectorAll(selector).forEach(card=>{
    card.style.transition='transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease'
    const onMouseMove = e => {
      const r=card.getBoundingClientRect()
      const cx=r.left+r.width/2, cy=r.top+r.height/2
      const dx=(e.clientX-cx)/r.width*2
      const dy=(e.clientY-cy)/r.height*2
      card.style.transform=`perspective(800px) rotateY(${dx*6}deg) rotateX(${-dy*5}deg) translateY(-4px) scale(1.01)`
    }
    const onMouseLeave = () => {
      card.style.transform='perspective(800px) rotateY(0) rotateX(0) translateY(0) scale(1)'
    }
    card.addEventListener('mousemove', onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)
    tiltHandlers.push({ card, onMouseMove, onMouseLeave })
  })

  return () => {
    tiltHandlers.forEach(({ card, onMouseMove, onMouseLeave }) => {
      card.removeEventListener('mousemove', onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    })
  }
}
