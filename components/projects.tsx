"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";

const PROJECT_FILTER_TABS = [
  "All",
  "Cloud & DevOps",
  "QA & Backend",
  "Full-Stack & IoT",
] as const;

type ProjectFilterTab = (typeof PROJECT_FILTER_TABS)[number];

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.15);
  const [activeCategory, setActiveCategory] =
    useState<ProjectFilterTab>("All");

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((project) => project.category === activeCategory);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>My Projects</SectionHeading>

      <div
        className="mb-8 flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter projects by category"
      >
        {PROJECT_FILTER_TABS.map((category) => {
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
                  layoutId="activeProjectFilter"
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

      <div>
        {filteredProjects.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
