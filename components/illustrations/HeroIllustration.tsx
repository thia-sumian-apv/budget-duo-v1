"use client";

import { motion } from "framer-motion";

// Animated illustration showing couple planning finances
// Uses abstract geometric figures with brand colors
// Can be replaced with Lottie animation - see instructions below

/*
 * TO USE A LOTTIE ANIMATION:
 * 1. Download a JSON from https://lottiefiles.com/free-animations/financial-planning
 * 2. Use LottieFiles editor to change colors to brand palette:
 *    - Navy: #001F3D
 *    - Orange: #ED985F
 *    - Light Orange: #F7B980
 * 3. Save JSON to /public/animations/hero.json
 * 4. Uncomment the Lottie import and LottieHero component below
 */

// import Lottie from "lottie-react";
// import heroAnimation from "@/public/animations/hero.json";
//
// export const HeroIllustration = () => (
//   <Lottie animationData={heroAnimation} loop className="w-full h-auto max-w-md" />
// );

export const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-lg">
      <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Background decorative elements */}
        <motion.circle
          cx="200"
          cy="160"
          r="120"
          fill="#F7B980"
          fillOpacity="0.15"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Floating chart element - animates up and down */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Chart background */}
          <rect x="140" y="80" width="120" height="80" rx="8" fill="white" />
          <rect x="140" y="80" width="120" height="80" rx="8" stroke="#001F3D" strokeOpacity="0.1" strokeWidth="1" />

          {/* Bar chart bars */}
          <motion.rect
            x="155"
            y="120"
            width="20"
            height="30"
            rx="2"
            fill="#ED985F"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="185"
            y="105"
            width="20"
            height="45"
            rx="2"
            fill="#001F3D"
            fillOpacity="0.7"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="215"
            y="95"
            width="20"
            height="55"
            rx="2"
            fill="#ED985F"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ transformOrigin: "bottom" }}
          />
        </motion.g>

        {/* Person 1 - Left figure */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Body */}
          <ellipse cx="120" cy="220" rx="35" ry="50" fill="#001F3D" fillOpacity="0.9" />
          {/* Head */}
          <circle cx="120" cy="155" r="25" fill="#F7B980" />
          {/* Arm pointing */}
          <motion.path
            d="M145 200 L180 170"
            stroke="#001F3D"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
        </motion.g>

        {/* Person 2 - Right figure */}
        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Body */}
          <ellipse cx="280" cy="220" rx="35" ry="50" fill="#ED985F" />
          {/* Head */}
          <circle cx="280" cy="155" r="25" fill="#F7B980" />
          {/* Arm gesturing */}
          <motion.path
            d="M255 195 L230 175"
            stroke="#ED985F"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          />
        </motion.g>

        {/* Floating coin elements */}
        <motion.g
          animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <circle cx="320" cy="100" r="15" fill="#ED985F" />
          <text x="320" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, -6, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <circle cx="80" cy="120" r="12" fill="#001F3D" fillOpacity="0.7" />
          <text x="80" y="125" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">$</text>
        </motion.g>

        {/* Connection line between people - shared planning */}
        <motion.path
          d="M150 180 Q200 140 250 180"
          stroke="#ED985F"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </svg>
    </div>
  );
};

export default HeroIllustration;
