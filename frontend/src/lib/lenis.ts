import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './animations/gsap'

let lenisInstance = null
let tickerCallback = null

export function initLenis() {
  if (lenisInstance) return lenisInstance

  const lenis = new Lenis({
    duration: 1.2,
    easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })

  lenis.on('scroll', ScrollTrigger.update)

  tickerCallback = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)

  window.setTimeout(() => ScrollTrigger.refresh(), 100)

  lenisInstance = lenis
  return lenis
}

export function getLenis() {
  return lenisInstance
}

export function scrollToTarget(target, options = {}) {
  const lenis = getLenis()
  if (!lenis) return

  lenis.scrollTo(target, {
    offset: -80,
    ...options,
  })
}

export function destroyLenis() {
  if (!lenisInstance) return

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
  }

  lenisInstance.destroy()
  tickerCallback = null
  lenisInstance = null
}
