export const SPRING = { type: 'spring', stiffness: 300, damping: 24, mass: 0.8 }
export const SPRING_HEAVY = { type: 'spring', stiffness: 200, damping: 30, mass: 1.2 }
export const SPRING_SNAPPY = { type: 'spring', stiffness: 440, damping: 30 }
export const EASE_OUT = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT = [0.4, 0, 0.2, 1]
export const EASE_EXPO = [0.87, 0, 0.13, 1]

export const DUR = {
  micro: 0.15,
  fast: 0.25,
  base: 0.45,
  slow: 0.75,
  crawl: 1.1,
}

export const stagger = {
  tight: 0.04,
  normal: 0.07,
  loose: 0.12,
}

export const STAGGER = stagger

export const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  fadeUp: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideL: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  slideR: { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  slideLeft: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  popIn: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 440, damping: 22 },
    },
  },
  exitUp: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.16 } },
  exitDown: { opacity: 0, y: 10, scale: 0.96, transition: { duration: 0.15 } },
}

export const LIST_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
}

export const LIST_ITEM_VARIANTS = {
  hidden: variants.fadeUp.hidden,
  visible: {
    ...variants.fadeUp.visible,
    transition: { ...SPRING, duration: DUR.slow },
  },
}

export const HERO_CTA_LOOP_VARIANTS = {
  rest: { y: 0 },
  float: { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } },
}

export const HERO_CTA_LOOP_TRANSITION = {
  repeat: Infinity,
  duration: 2.4,
  ease: 'easeInOut',
}

export const CARD_INTERACTION_VARIANTS = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -5,
    scale: 1.01,
    transition: SPRING_SNAPPY,
  },
  tap: {
    scale: 0.985,
    transition: SPRING,
  },
}

export const BUTTON_INTERACTION_VARIANTS = {
  rest: { y: 0, scale: 1, x: 0 },
  float: HERO_CTA_LOOP_VARIANTS.float,
  hover: {
    y: -2,
    transition: SPRING_SNAPPY,
  },
  tap: {
    scale: 0.95,
    y: 0,
    transition: SPRING,
  },
}

export const ICON_BUTTON_VARIANTS = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 12,
    transition: SPRING_SNAPPY,
  },
  tap: {
    scale: 0.85,
    transition: SPRING,
  },
}

export const NAV_LINK_VARIANTS = {
  rest: { x: 0 },
  hover: {
    x: 3,
    transition: { duration: DUR.micro },
  },
}

export const MOBILE_MENU_VARIANTS = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: { duration: DUR.fast, ease: EASE_OUT },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_HEAVY },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DUR.fast * 0.65, ease: EASE_OUT },
  },
}

export const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DUR.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: DUR.fast * 0.65 },
  },
}

export const DIALOG_CONTENT_VARIANTS = {
  hidden: { scale: 0.92, opacity: 0, y: 16 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: SPRING_HEAVY,
  },
  exit: {
    scale: 0.88,
    opacity: 0,
    y: 8,
    transition: { duration: DUR.fast },
  },
}

export const DRAWER_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...SPRING,
      delay: index * 0.04,
    },
  }),
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: DUR.fast * 0.65 },
  },
}

export const LOADING_LABEL_VARIANTS = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: DUR.fast } },
  exit: { opacity: 0, y: -8, transition: { duration: DUR.fast * 0.65 } },
}

export const LOADING_SPINNER_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DUR.fast } },
  exit: { opacity: 0, y: -8, transition: { duration: DUR.fast * 0.65 } },
}

export const BADGE_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.12, 1],
    opacity: 1,
    transition: {
      duration: DUR.fast,
      times: [0, 0.6, 1],
    },
  },
  hover: {
    scale: 1.06,
    transition: { duration: DUR.micro },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: DUR.fast * 0.65 },
  },
}

export const INPUT_ERROR_VARIANTS = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SNAPPY,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DUR.fast * 0.65 },
  },
}

export const STATUS_PULSE_VARIANTS = {
  rest: { opacity: 1, scale: 1 },
  pulse: { opacity: [1, 0.4, 1], scale: [1, 1.18, 1] },
}

export const STATUS_PULSE_TRANSITION = {
  repeat: Infinity,
  duration: 1.6,
  ease: 'easeInOut',
}
