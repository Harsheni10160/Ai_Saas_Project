import { Variants } from "framer-motion";

export const STAGGER_CHILD_DELAY = 0.1;

export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        filter: "blur(4px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for premium feel
        },
    },
};

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: STAGGER_CHILD_DELAY,
        },
    },
};

export const hoverLift: Variants = {
    initial: {
        y: 0,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    hover: {
        y: -4,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

export const scaleIn: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

export const sidebarItemVariant: Variants = {
    initial: { x: -10, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
};
