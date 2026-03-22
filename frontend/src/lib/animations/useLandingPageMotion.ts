import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, SplitText } from './gsap'

function safeSplitText(target, options) {
  try {
    if (!target) return null
    return new SplitText(target, options)
  } catch {
    return null
  }
}

function safeSessionGet(key) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSessionSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // no-op
  }
}

export function useLandingPageMotion(containerRef) {
  useLayoutEffect(() => {
    const el = containerRef?.current
    if (!el || typeof window === 'undefined') return

    let cleanup = () => {}
    let mounted = true

    const run = () => {
      if (!mounted) return
      const ctx = gsap.context(() => buildAnimations(el), el)
      cleanup = () => ctx.revert()
    }

    const readyFonts = document.fonts?.ready
    if (readyFonts && typeof readyFonts.then === 'function') {
      readyFonts.then(() => {
        run()
        window.setTimeout(() => ScrollTrigger.refresh(), 250)
      })
    } else {
      run()
      window.setTimeout(() => ScrollTrigger.refresh(), 250)
    }

    const onLoad = () => {
      window.setTimeout(() => ScrollTrigger.refresh(), 350)
    }

    window.addEventListener('load', onLoad, { toggleActions: 'play none none reverse' })

    return () => {
      mounted = false
      window.removeEventListener('load', onLoad)
      cleanup()
    }
  }, [containerRef])
}

function buildAnimations(root) {
  const desktop = window.matchMedia('(min-width: 1024px)').matches

  const heroPlayed = safeSessionGet('ll-hero-played')
  if (!heroPlayed) {
    safeSessionSet('ll-hero-played', '1')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 })
    tl.from('[data-hero-eyebrow]', { y: 20, opacity: 0, duration: 0.6 })
      .from('[data-hero-line="1"]', { y: 60, opacity: 0, duration: 0.7 }, '-=0.3')
      .from('[data-hero-line="2"]', { y: 60, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('[data-hero-body]', { y: 24, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('[data-hero-cta="1"]', { scale: 0.9, opacity: 0, duration: 0.5 }, '-=0.35')
      .from('[data-hero-cta="2"]', { scale: 0.9, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('[data-hero-powered]', { y: 12, opacity: 0, duration: 0.4 }, '-=0.3')
      .from('[data-hero-card]', { x: 40, opacity: 0, duration: 0.85, ease: 'power2.out' }, '-=0.7')

    if (desktop) {
      const line2 = root.querySelector('[data-hero-line="2"]')
      const split = safeSplitText(line2, { type: 'chars' })
      if (split?.chars?.length) {
        gsap.from(split.chars, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.022,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.65,
          onComplete: () => split.revert(),
        })
      }
    }
  }

  gsap.from('[data-nav]', {
    y: -56,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.05,
  })

  gsap.from('[data-ticker]', {
    opacity: 0,
    y: 16,
    duration: 0.5,
    scrollTrigger: { trigger: '[data-ticker]', start: 'top 95%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-features-eyebrow]', {
    y: 16,
    opacity: 0,
    duration: 0.55,
    scrollTrigger: { trigger: '[data-features-section]', start: 'top 82%', toggleActions: 'play none none reverse' },
  })

  if (desktop) {
    const h2 = root.querySelector('[data-features-h2]')
    const split = safeSplitText(h2, { type: 'lines' })
    if (split?.lines?.length) {
      gsap.from(split.lines, {
        y: '100%',
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: { trigger: h2, start: 'top 80%', toggleActions: 'play none none reverse' },
        onComplete: () => split.revert(),
      })
    } else {
      gsap.from('[data-features-h2]', {
        y: 32,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: { trigger: '[data-features-section]', start: 'top 80%', toggleActions: 'play none none reverse' },
      })
    }
  } else {
    gsap.from('[data-features-h2]', {
      y: 32,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: { trigger: '[data-features-section]', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
  }

  gsap.from('[data-feature-card]', {
    y: 48,
    opacity: 0,
    scale: 0.96,
    duration: 0.7,
    ease: 'power2.out',
    stagger: { amount: 0.5, from: 'start', grid: 'auto' },
    scrollTrigger: { trigger: '[data-features-section]', start: 'top 68%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-feature-card-rust]', {
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.1,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: '[data-feature-card-rust]', start: 'top 82%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-process-chat]', {
    x: desktop ? -48 : 0,
    y: desktop ? 0 : 32,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: { trigger: '[data-process-section]', start: 'top 78%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-process-chat] [data-chat-message]', {
    x: -12,
    opacity: 0,
    stagger: 0.12,
    duration: 0.5,
    scrollTrigger: { trigger: '[data-process-chat]', start: 'top 72%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-process-step]', {
    x: desktop ? 36 : 0,
    y: desktop ? 0 : 24,
    opacity: 0,
    duration: 0.65,
    ease: 'power2.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '[data-process-section]', start: 'top 72%', toggleActions: 'play none none reverse' },
  })

  const steps = root.querySelectorAll('[data-process-step]')
  const nums = root.querySelectorAll('[data-step-number]')
  steps.forEach((step, i) => {
    const num = nums[i]
    if (!num) return
    gsap.set(num, { opacity: 0.3 })
    ScrollTrigger.create({
      trigger: step,
      start: 'top 58%',
      end: 'bottom 58%',
      onEnter: () => gsap.to(num, { opacity: 1, scale: 1.06, duration: 0.25 }),
      onLeave: () => gsap.to(num, { opacity: 0.3, scale: 1, duration: 0.25 }),
      onEnterBack: () => gsap.to(num, { opacity: 1, scale: 1.06, duration: 0.25 }),
      onLeaveBack: () => gsap.to(num, { opacity: 0.3, scale: 1, duration: 0.25 }),
    })
  })

  gsap.from('[data-stats-section]', {
    clipPath: 'inset(100% 0 0 0)',
    duration: 0.9,
    ease: 'power3.inOut',
    scrollTrigger: { trigger: '[data-stats-section]', start: 'top 88%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-stat-label]', {
    y: 10,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
    delay: 0.3,
    scrollTrigger: { trigger: '[data-stats-section]', start: 'top 82%', toggleActions: 'play none none reverse' },
  })

  runCounters(root, '[data-stat-value]')

  if (desktop) {
    const ph2 = root.querySelector('[data-pricing-h2]')
    const split = safeSplitText(ph2, { type: 'lines' })
    if (split?.lines?.length) {
      gsap.from(split.lines, {
        y: '105%',
        opacity: 0,
        stagger: 0.08,
        duration: 0.65,
        scrollTrigger: { trigger: ph2, start: 'top 82%', toggleActions: 'play none none reverse' },
        onComplete: () => split.revert(),
      })
    }
  }

  gsap.from('[data-pricing-card]', {
    y: 56,
    opacity: 0,
    scale: 0.95,
    duration: 0.75,
    ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '[data-pricing-section]', start: 'top 74%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-quote-mark]', {
    y: -32,
    opacity: 0,
    rotate: -12,
    duration: 0.75,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '[data-quote-section]', start: 'top 82%', toggleActions: 'play none none reverse' },
  })

  if (desktop) {
    const qt = root.querySelector('[data-quote-text]')
    const split = safeSplitText(qt, { type: 'words' })
    if (split?.words?.length) {
      gsap.from(split.words, {
        y: 16,
        opacity: 0,
        stagger: 0.028,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: qt, start: 'top 78%', toggleActions: 'play none none none' },
        onComplete: () => split.revert(),
      })
    } else {
      gsap.from('[data-quote-text]', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: { trigger: '[data-quote-section]', start: 'top 80%', toggleActions: 'play none none none' },
      })
    }
  } else {
    gsap.from('[data-quote-text]', {
      y: 24,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: { trigger: '[data-quote-section]', start: 'top 80%', toggleActions: 'play none none none' },
    })
  }

  gsap.from('[data-quote-attr]', {
    y: 10,
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    scrollTrigger: { trigger: '[data-quote-attr]', start: 'top 86%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-philosophy-body] p', {
    x: desktop ? 28 : 0,
    y: desktop ? 0 : 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    scrollTrigger: { trigger: '[data-quote-section]', start: 'top 76%', toggleActions: 'play none none none' },
  })

  gsap.from('[data-philosophy-grid] > div', {
    scale: 0.9,
    opacity: 0,
    y: 14,
    stagger: 0.09,
    duration: 0.5,
    ease: 'back.out(1.3)',
    scrollTrigger: { trigger: '[data-philosophy-grid]', start: 'top 84%', toggleActions: 'play none none none' },
  })

  gsap.from('[data-cta-section]', {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1.1,
    ease: 'power3.inOut',
    scrollTrigger: { trigger: '[data-cta-section]', start: 'top 90%', toggleActions: 'play none none reverse' },
  })

  if (desktop) {
    const ctaLines = root.querySelectorAll('[data-cta-line]')
    const chars = []
    const splits = []

    ctaLines.forEach((line) => {
      const s = safeSplitText(line, { type: 'chars,lines' })
      if (!s) return
      splits.push(s)
      chars.push(...s.chars)
    })

    if (chars.length) {
      gsap.from(chars, {
        y: '115%',
        opacity: 0,
        stagger: 0.018,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-cta-section]', start: 'top 75%', toggleActions: 'play none none reverse' },
        onComplete: () => splits.forEach((s) => s.revert()),
      })
    }
  }

  gsap.from('[data-cta-sub]', {
    y: 18,
    opacity: 0,
    duration: 0.55,
    delay: 0.4,
    scrollTrigger: { trigger: '[data-cta-section]', start: 'top 70%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-cta-btn]', {
    scale: 0.88,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(1.6)',
    delay: 0.55,
    scrollTrigger: { trigger: '[data-cta-section]', start: 'top 68%', toggleActions: 'play none none reverse' },
  })

  runCounters(root, '[data-cta-stats] [data-count]', 0.08)

  gsap.from('[data-footer-logo]', {
    y: 18,
    opacity: 0,
    duration: 0.55,
    scrollTrigger: { trigger: '[data-footer]', start: 'top 92%', toggleActions: 'play none none reverse' },
  })

  gsap.from('[data-footer-col]', {
    y: 20,
    opacity: 0,
    stagger: 0.07,
    duration: 0.5,
    delay: 0.1,
    scrollTrigger: { trigger: '[data-footer]', start: 'top 88%', toggleActions: 'play none none reverse' },
  })

  if (desktop) {
    applyMagnetic('[data-hero-cta="1"], [data-cta-btn="1"], .get-started-btn')
  }

  const bar = document.getElementById('scroll-progress')
  if (bar) {
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { scrub: 0.1, start: 'top top', end: 'bottom bottom' },
    })
  }
}

function runCounters(root, selector, staggerEach = 0) {
  root.querySelectorAll(selector).forEach((el, i) => {
    const target = parseFloat(el.dataset.count || '0')
    const fmt = el.dataset.format || ''
    const decimals = parseInt(el.dataset.decimals || '0', 10)
    const prefix = el.dataset.prefix || ''
    const suffix = el.dataset.suffix || ''
    const obj = { v: 0 }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none reverse',
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          delay: i * staggerEach,
          onUpdate() {
            let val = obj.v
            if (fmt === 'k') val = obj.v / 1000
            if (fmt === 'm') val = obj.v / 1000000
            const str = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()
            el.textContent = prefix + str + suffix
          },
        }),
    })
  })
}

function applyMagnetic(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - r.left - r.width / 2) * 0.26
      const dy = (e.clientY - r.top - r.height / 2) * 0.26
      gsap.to(el, { x: dx, y: dy, duration: 0.45, ease: 'power2.out' })
    })

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,0.5)' })
    })
  })
}
