"use client";

import React, { useState } from "react";
import SectionHeading from "./section-heading";
import { skillCategories, skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";

const SKILL_FILTER_TABS = [
  "All",
  "Cloud & DevOps",
  "QA & Test Automation",
  "Backend & Databases",
  "Frontend & Product",
] as const;

type SkillFilterTab = (typeof SKILL_FILTER_TABS)[number];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.025 * index,
    },
  }),
};

export default function Skills() {
  const { ref } = useSectionInView("Skills", 0.3);
  const [activeCategory, setActiveCategory] = useState<SkillFilterTab>("All");

  const displayedSkills =
    activeCategory === "All" ? skillsData : skillCategories[activeCategory];

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 max-w-[54rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading>My Skills</SectionHeading>

      <div
        className="mb-8 flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter skills by category"
      >
        {SKILL_FILTER_TABS.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`relative min-h-10 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900 ${
                isActive
                  ? "border border-transparent text-white dark:text-gray-950"
                  : "border border-black/10 bg-white/80 text-gray-700 hover:bg-gray-100 dark:border-white/15 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeSkillFilter"
                  aria-hidden="true"
                  className="absolute inset-0 z-[5] rounded-full bg-gray-900 shadow-sm dark:bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>

      <ul className="flex flex-wrap justify-center gap-2.5 text-gray-800">
        {displayedSkills.map((skill, index) => (
          <motion.li
            className="rounded-xl border border-black/10 bg-white/90 px-4 py-2.5 font-mono text-sm sm:text-base shadow-xs backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white/85"
            key={skill}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
