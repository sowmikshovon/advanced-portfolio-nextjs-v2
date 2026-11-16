"use client";

import React, { useRef } from "react";
import { projectsData } from "@/lib/data";
import {
  useScroll,
  motion,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { BsArrowUpRight } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";

type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  category,
  description,
  tags,
  imageUrl,
  githubUrl,
  liveUrl,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.65, 1]);

  return (
    <motion.div
      ref={ref}
      style={
        shouldReduceMotion
          ? undefined
          : {
              scale: scaleProgress,
              opacity: opacityProgress,
            }
      }
      className="group mb-4 sm:mb-8 last:mb-0"
    >
      <section className="relative max-w-[44rem] overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md sm:min-h-[21.5rem] sm:pr-8 sm:group-even:pl-8 sm:group-even:pr-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.11]">
        <div className="flex h-full flex-col px-5 pb-7 pt-5 sm:max-w-[52%] sm:pl-9 sm:pr-2 sm:pt-8 sm:group-even:ml-[20rem]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-full border border-black/10 bg-gray-100/90 px-2.5 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-gray-700 dark:border-white/15 dark:bg-white/10 dark:text-gray-200">
              {category}
            </span>
          </div>

          <div className="sm:hidden mb-4 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <a
              href={liveUrl ?? githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${title} preview`}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white"
            >
              <Image
                src={imageUrl}
                alt={`${title} project preview`}
                sizes="(max-width: 640px) 92vw, 452px"
                className="h-44 w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
              />
            </a>
          </div>

          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/75">
            {description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                className="rounded-full bg-black/[0.75] px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-white dark:bg-white/15 dark:text-white/85"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} source code on GitHub`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-black/15 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-800 transition hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:border-white/15 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20 dark:focus-visible:ring-white"
            >
              <FaGithub className="text-sm" aria-hidden="true" />
              <span>GitHub</span>
            </a>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title} live demo`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
              >
                <span>Live Demo</span>
                <BsArrowUpRight className="text-[0.7rem]" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <a
          href={liveUrl ?? githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} preview`}
          className="absolute -right-40 top-8 hidden w-[28.25rem] rounded-t-lg transition group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:-rotate-2 group-hover:scale-[1.04] group-even:-left-40 group-even:right-[initial] group-even:group-hover:translate-x-3 group-even:group-hover:rotate-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white sm:block"
        >
          <Image
            src={imageUrl}
            alt={`${title} project preview`}
            sizes="(max-width: 640px) 92vw, 452px"
            className="h-auto w-full rounded-t-lg shadow-2xl"
          />
        </a>
      </section>
    </motion.div>
  );
}
