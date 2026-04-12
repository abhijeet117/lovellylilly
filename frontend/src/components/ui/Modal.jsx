import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAnimationConfig } from '../../lib/animations/useAnimationConfig'
export default function Modal({ isOpen, onClose, title, children }) {
  const animation = useAnimationConfig()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="motion-modal-overlay"
          onClick={onClose}
          initial={animation.backdrop.hidden}
          animate={animation.backdrop.visible}
          exit={animation.backdrop.exit}
          style={{
            position: 'fixed', inset: 0, zIndex: 'var(--z-modal, 800)',
            background: 'color-mix(in srgb, var(--clr-bg) 85%, transparent)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '24px',
          }}
        >
          <motion.div
            className="motion-modal-content"
            onClick={e => e.stopPropagation()}
            initial={animation.dialog.hidden}
            animate={animation.dialog.visible}
            exit={animation.dialog.exit}
            style={{
              background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
              borderRadius: '16px', padding: '32px',
              width: '100%', maxWidth: '480px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            {title && (
              <h3 style={{ color: 'var(--clr-text)', fontFamily: 'var(--f-groote)', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                {title}
              </h3>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
