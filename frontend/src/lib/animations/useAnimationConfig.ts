import { useReducedMotion } from 'framer-motion'
import {
  BACKDROP_VARIANTS,
  BADGE_VARIANTS,
  BUTTON_INTERACTION_VARIANTS,
  CARD_INTERACTION_VARIANTS,
  DIALOG_CONTENT_VARIANTS,
  DRAWER_ITEM_VARIANTS,
  HERO_CTA_LOOP_TRANSITION,
  HERO_CTA_LOOP_VARIANTS,
  ICON_BUTTON_VARIANTS,
  INPUT_ERROR_VARIANTS,
  LIST_CONTAINER_VARIANTS,
  LIST_ITEM_VARIANTS,
  LOADING_LABEL_VARIANTS,
  LOADING_SPINNER_VARIANTS,
  MOBILE_MENU_VARIANTS,
  NAV_LINK_VARIANTS,
  SPRING,
  SPRING_HEAVY,
  SPRING_SNAPPY,
  STATUS_PULSE_TRANSITION,
  STATUS_PULSE_VARIANTS,
  variants,
} from './tokens'

const ZERO_DURATION = { duration: 0 }

export function useAnimationConfig() {
  const reducedMotion = useReducedMotion()

  return {
    reducedMotion,
    variants,
    viewport: {
      once: true,
      amount: reducedMotion ? 0 : 0.2,
    },
    transitions: {
      default: reducedMotion ? ZERO_DURATION : SPRING,
      heavy: reducedMotion ? ZERO_DURATION : SPRING_HEAVY,
      snappy: reducedMotion ? ZERO_DURATION : SPRING_SNAPPY,
    },
    listContainer: reducedMotion
      ? {
          ...LIST_CONTAINER_VARIANTS,
          visible: {
            transition: { staggerChildren: 0, delayChildren: 0 },
          },
        }
      : LIST_CONTAINER_VARIANTS,
    listItem: LIST_ITEM_VARIANTS,
    cardInteraction: CARD_INTERACTION_VARIANTS,
    buttonInteraction: BUTTON_INTERACTION_VARIANTS,
    iconButtonInteraction: ICON_BUTTON_VARIANTS,
    navLinkInteraction: NAV_LINK_VARIANTS,
    mobileMenu: MOBILE_MENU_VARIANTS,
    backdrop: BACKDROP_VARIANTS,
    dialog: DIALOG_CONTENT_VARIANTS,
    drawerItem: DRAWER_ITEM_VARIANTS,
    loadingLabel: LOADING_LABEL_VARIANTS,
    loadingSpinner: LOADING_SPINNER_VARIANTS,
    badge: BADGE_VARIANTS,
    inputError: INPUT_ERROR_VARIANTS,
    heroCtaLoop: {
      animate: reducedMotion ? 'rest' : 'float',
      variants: HERO_CTA_LOOP_VARIANTS,
      transition: reducedMotion ? ZERO_DURATION : HERO_CTA_LOOP_TRANSITION,
    },
    statusPulse: {
      animate: reducedMotion ? 'rest' : 'pulse',
      variants: STATUS_PULSE_VARIANTS,
      transition: reducedMotion ? ZERO_DURATION : STATUS_PULSE_TRANSITION,
    },
  }
}
