import { gsap as coreGsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'

coreGsap.registerPlugin(ScrollTrigger, SplitText, Draggable)

coreGsap.defaults({ ease: 'power3.out' })
ScrollTrigger.defaults({ markers: false })

export const gsap = coreGsap

export function applyWillChange(targets, value = 'transform, opacity') {
  const elements = gsap.utils.toArray(targets)

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.willChange = value
    }
  })

  return () => {
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.willChange = ''
      }
    })
  }
}

export { ScrollTrigger, SplitText, Draggable }
