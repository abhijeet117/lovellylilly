import Lenis from 'lenis'
import { gsap } from './gsap'
import { ScrollTrigger } from './gsap'

let _lenis = null
let _ticker = null

export function initLenis() {
  if (_lenis) return _lenis

  _lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
  })

  // CRITICAL: This is the correct bridge. Do NOT use lenis.on('scroll', ScrollTrigger.update)
  // Use the ticker bridge instead:
  _ticker = (time) => _lenis.raf(time * 1000)
  gsap.ticker.add(_ticker)
  gsap.ticker.lagSmoothing(0)

  // Sync ScrollTrigger with Lenis scroll events
  _lenis.on('scroll', () => ScrollTrigger.update())

  const tickerInner = document.querySelector('[data-ticker-inner]')
  if (tickerInner) {
    _lenis.on('scroll', ({ velocity }) => {
      if (!tickerInner) return
      const spd = 1 + Math.abs(velocity || 0) * 0.035
      tickerInner.style.animationDuration = `${28 / spd}s`
    })
  }

  return _lenis
}

export function getLenis() {
  return _lenis
}

export function scrollToTarget(target, options = {}) {
  _lenis?.scrollTo(target, {
    offset: -80,
    ...options,
  })
}

export function destroyLenis() {
  if (_ticker) {
    gsap.ticker.remove(_ticker)
    _ticker = null
  }

  if (_lenis) {
    _lenis.destroy()
    _lenis = null
  }
}
