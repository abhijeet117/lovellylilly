/* eslint-disable no-console */
const { spawn } = require('child_process')
const { chromium } = require('playwright')

const HOST = '127.0.0.1'
const PORT = 4173
const BASE_URL = `http://${HOST}:${PORT}/`
const READY_TIMEOUT_MS = 30_000
const ANSI_REGEX = /\x1B\[[0-9;]*m/g

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function stopProcessTree(pid) {
  if (!pid) return
  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn('cmd.exe', ['/c', 'taskkill', '/PID', String(pid), '/T', '/F'], {
        stdio: 'ignore',
        shell: false,
      })
      killer.on('exit', () => resolve())
      killer.on('error', () => resolve())
    })
    return
  }

  try {
    process.kill(pid, 'SIGTERM')
    await sleep(300)
    process.kill(pid, 'SIGKILL')
  } catch {
    // already closed
  }
}

function startDevServer() {
  const command = `npm run dev -- --host ${HOST} --port ${PORT}`
  const child = spawn(command, {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  })

  let settled = false
  let output = ''

  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (settled) return
      settled = true
      reject(new Error(`Dev server did not become ready within ${READY_TIMEOUT_MS}ms.\n${output}`))
    }, READY_TIMEOUT_MS)

    const onData = (chunk) => {
      const text = chunk.toString()
      output += text
      const normalized = output.replace(ANSI_REGEX, '')
      if (!settled && (normalized.includes('Local:') || normalized.includes(`http://${HOST}:${PORT}`))) {
        settled = true
        clearTimeout(timeout)
        resolve()
      }
    }

    child.stdout.on('data', onData)
    child.stderr.on('data', onData)
    child.on('error', (err) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      reject(err)
    })
    child.on('exit', (code) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      reject(new Error(`Dev server exited early with code ${code}.\n${output}`))
    })
  })

  return { child, ready }
}

function normalizeConsoleError(message) {
  const ignored = [
    '401 (Unauthorized)',
    '400 (Bad Request)',
    'Failed to load resource',
  ]

  if (ignored.some((token) => message.includes(token))) {
    return null
  }

  return message
}

function toNumberFromMatrix(matrixText) {
  if (!matrixText || matrixText === 'none') return 1
  const match = matrixText.match(/matrix\(([^)]+)\)/)
  if (!match) return NaN
  const parts = match[1].split(',').map((part) => Number(part.trim()))
  return parts[0]
}

async function runChecks() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  const pageErrors = []
  const consoleErrors = []

  page.on('pageerror', (error) => pageErrors.push(String(error)))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const normalized = normalizeConsoleError(msg.text())
    if (normalized) consoleErrors.push(normalized)
  })

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3500)

  const top = await page.evaluate(() => {
    const read = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const cs = getComputedStyle(el)
      return { opacity: cs.opacity, visibility: cs.visibility, transform: cs.transform }
    }

    return {
      hero: read('[data-hero-line="1"]'),
      featureCard: read('[data-feature-card]'),
      processStep: read('[data-process-step]'),
      pricingCard: read('[data-pricing-card]'),
      quote: read('[data-quote-text]'),
      cta: read('[data-cta-section]'),
      footerCol: read('[data-footer-col]'),
      progress: read('#scroll-progress'),
      tickerInner: read('[data-ticker-inner]'),
      counts: {
        featureCards: document.querySelectorAll('[data-feature-card]').length,
        processSteps: document.querySelectorAll('[data-process-step]').length,
        pricingCards: document.querySelectorAll('[data-pricing-card]').length,
      },
    }
  })

  await page.mouse.wheel(0, 2600)
  await page.waitForTimeout(1200)
  await page.mouse.wheel(0, 2600)
  await page.waitForTimeout(1200)

  const scrolled = await page.evaluate(() => {
    const progress = document.querySelector('#scroll-progress')
    const ticker = document.querySelector('[data-ticker-inner]')
    const p = progress ? getComputedStyle(progress).transform : 'none'
    const t = ticker ? getComputedStyle(ticker).animationDuration : ''
    return { scrollY: window.scrollY, progressTransform: p, tickerDuration: t }
  })

  await browser.close()

  const failures = []

  if (pageErrors.length) failures.push(`pageerror(s): ${pageErrors.join(' | ')}`)
  if (consoleErrors.length) failures.push(`console error(s): ${consoleErrors.join(' | ')}`)

  if (!top.hero || top.hero.opacity === '0') failures.push('Hero line is not visible at top.')
  if (!top.featureCard || top.featureCard.opacity === '0') failures.push('Feature cards are not rendered/visible.')
  if (!top.processStep || top.processStep.opacity === '0') failures.push('Process steps are not rendered/visible.')
  if (!top.pricingCard || top.pricingCard.opacity === '0') failures.push('Pricing cards are not rendered/visible.')
  if (!top.quote || top.quote.opacity === '0') failures.push('Quote text is not rendered/visible.')
  if (!top.cta || top.cta.opacity === '0') failures.push('CTA section is not rendered/visible.')
  if (top.counts.featureCards < 6) failures.push(`Expected 6 feature cards, found ${top.counts.featureCards}.`)
  if (top.counts.processSteps < 4) failures.push(`Expected 4 process steps, found ${top.counts.processSteps}.`)
  if (top.counts.pricingCards < 3) failures.push(`Expected 3 pricing cards, found ${top.counts.pricingCards}.`)

  const progressAtScroll = toNumberFromMatrix(scrolled.progressTransform)
  if (!Number.isFinite(progressAtScroll) || progressAtScroll <= 0.1) {
    failures.push(`Scroll progress bar did not advance. transform=${scrolled.progressTransform}`)
  }

  if (scrolled.scrollY < 1200) failures.push(`Page did not scroll enough. scrollY=${scrolled.scrollY}`)
  if (!scrolled.tickerDuration) failures.push('Ticker animation duration was not detected.')

  return { failures, top, scrolled, pageErrors, consoleErrors }
}

async function main() {
  const { child, ready } = startDevServer()
  let summary = null

  try {
    await ready
    await sleep(400)
    summary = await runChecks()
  } finally {
    if (child) await stopProcessTree(child.pid)
  }

  if (!summary) {
    console.error('Landing verification did not produce a summary.')
    process.exit(1)
  }

  if (summary.failures.length) {
    console.error('Landing verification FAILED')
    summary.failures.forEach((f, i) => console.error(`${i + 1}. ${f}`))
    process.exit(1)
  }

  console.log('Landing verification PASSED')
  console.log(`scrollY=${summary.scrolled.scrollY}`)
  console.log(`progressTransform=${summary.scrolled.progressTransform}`)
  console.log(`tickerDuration=${summary.scrolled.tickerDuration}`)
}

main().catch((error) => {
  console.error('Landing verification FAILED')
  console.error(error?.stack || String(error))
  process.exit(1)
})
