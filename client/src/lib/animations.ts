/**
 * Apple-style Animation Presets
 * Smooth, natural animations with spring physics
 * Optimized for iOS/Safari and mobile devices
 */

import { Variants, Transition } from "framer-motion";

// Spring configurations (iOS-like physics)
export const springConfig = {
  default: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  gentle: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
    mass: 1,
  },
  snappy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
    mass: 0.6,
  },
  smooth: {
    type: "tween" as const,
    duration: 0.3,
    ease: [0.4, 0.0, 0.2, 1], // Apple's ease-in-out curve
  },
};

// Modal animations (scale + fade from center)
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springConfig.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: springConfig.smooth,
  },
};

// Backdrop animations (fade)
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: springConfig.smooth,
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: springConfig.smooth,
  },
};

// Sidebar slide animations
export const sidebarVariants: Variants = {
  hidden: {
    x: "-100%",
    transition: springConfig.snappy,
  },
  visible: {
    x: 0,
    transition: springConfig.snappy,
  },
};

// Dropdown/Accordion animations
export const dropdownVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: springConfig.smooth,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: springConfig.smooth,
  },
};

// Folder expansion animations
export const folderVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: springConfig.gentle,
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: springConfig.gentle,
  },
};

// List item stagger animations
export const listContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springConfig.gentle,
  },
};

// Button press animation
export const buttonTapAnimation = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

// Card hover animation
export const cardHoverAnimation = {
  scale: 1.02,
  y: -2,
  transition: springConfig.gentle,
};

// Toast/Notification animations (slide from top)
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springConfig.snappy,
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: springConfig.smooth,
  },
};

// Fade in/out
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: springConfig.smooth,
  },
  exit: {
    opacity: 0,
    transition: springConfig.smooth,
  },
};

// Slide up (bottom sheet style)
export const slideUpVariants: Variants = {
  hidden: {
    y: "100%",
    transition: springConfig.snappy,
  },
  visible: {
    y: 0,
    transition: springConfig.snappy,
  },
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springConfig.default,
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: springConfig.smooth,
  },
};

// Rotation animations (for icons)
export const rotateVariants: Variants = {
  collapsed: {
    rotate: 0,
    transition: springConfig.smooth,
  },
  expanded: {
    rotate: 180,
    transition: springConfig.smooth,
  },
};

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: springConfig.smooth,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: springConfig.smooth,
  },
};
