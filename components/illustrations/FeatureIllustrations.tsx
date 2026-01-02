"use client";

import { motion } from "framer-motion";

// Micro-illustrations for feature cards
// Uses brand colors: Navy #001F3D, Orange #ED985F, Light Orange #F7B980

export const FlexiblePlanningIllustration = () => (
  <svg viewBox="0 0 80 60" fill="none" className="w-20 h-auto">
    {/* Calendar/Goals icon with flexibility */}
    <motion.rect
      x="10"
      y="10"
      width="35"
      height="40"
      rx="4"
      fill="#F7B980"
      fillOpacity="0.3"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.rect
      x="15"
      y="22"
      width="25"
      height="3"
      rx="1.5"
      fill="#ED985F"
      initial={{ width: 0 }}
      animate={{ width: 25 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    />
    <motion.rect
      x="15"
      y="28"
      width="18"
      height="3"
      rx="1.5"
      fill="#001F3D"
      fillOpacity="0.5"
      initial={{ width: 0 }}
      animate={{ width: 18 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    />
    <motion.rect
      x="15"
      y="34"
      width="22"
      height="3"
      rx="1.5"
      fill="#ED985F"
      fillOpacity="0.7"
      initial={{ width: 0 }}
      animate={{ width: 22 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    />
    {/* Split arrow */}
    <motion.path
      d="M50 25 L65 15 M50 25 L65 35"
      stroke="#001F3D"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    />
  </svg>
);

export const CpfSmartIllustration = () => (
  <svg viewBox="0 0 80 60" fill="none" className="w-20 h-auto">
    {/* Shield with calculator/percentage */}
    <motion.path
      d="M40 5 L60 15 L60 35 C60 45 50 52 40 55 C30 52 20 45 20 35 L20 15 Z"
      fill="#F7B980"
      fillOpacity="0.3"
      stroke="#ED985F"
      strokeWidth="2"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
    {/* Percentage symbol */}
    <motion.circle
      cx="33"
      cy="25"
      r="5"
      stroke="#001F3D"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    />
    <motion.circle
      cx="47"
      cy="40"
      r="5"
      stroke="#001F3D"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    />
    <motion.line
      x1="50"
      y1="22"
      x2="30"
      y2="42"
      stroke="#ED985F"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    />
  </svg>
);

export const UnifiedDashboardIllustration = () => (
  <svg viewBox="0 0 80 60" fill="none" className="w-20 h-auto">
    {/* Dashboard cards */}
    <motion.rect
      x="5"
      y="10"
      width="30"
      height="20"
      rx="3"
      fill="#ED985F"
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 5, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.rect
      x="45"
      y="10"
      width="30"
      height="20"
      rx="3"
      fill="#001F3D"
      fillOpacity="0.7"
      initial={{ x: 90, opacity: 0 }}
      animate={{ x: 45, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    />
    {/* Unified bottom card */}
    <motion.rect
      x="15"
      y="35"
      width="50"
      height="18"
      rx="3"
      fill="#F7B980"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 35, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    {/* Connection lines */}
    <motion.path
      d="M20 30 L30 35 M60 30 L50 35"
      stroke="#001F3D"
      strokeWidth="1.5"
      strokeOpacity="0.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    />
  </svg>
);
