"use client";

import React from "react";
import Link from "next/link";
import { cvConfig, cvProfile } from "@/lib/cv-data";
import { BsArrowLeft, BsGithub, BsLinkedin } from "react-icons/bs";
import { HiDownload, HiMail, HiPrinter } from "react-icons/hi";

export default function CvPage() {
  const skillEntries = Object.entries(cvProfile.skillCategories);

  return (
    <main
      id="home"
      className="mx-auto max-w-[54rem] scroll-mt-28 px-4 pb-16 pt-2 print:max-w-none print:p-0"
    >
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/5">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          <BsArrowLeft aria-hidden="true" />
          Back to Portfolio
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
          >
            <HiPrinter className="text-base" aria-hidden="true" />
            Print / Save as PDF
          </button>

          <a
            href="/api/cv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
          >
            <HiDownload className="text-base" aria-hidden="true" />
            Download PDF File
          </a>
        </div>
      </div>

      <article className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-950/90 sm:p-10 print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none">
        <div className="border-b border-gray-200 pb-5 dark:border-white/15 print:border-gray-300">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white print:text-black">
                {cvProfile.name}
              </h1>
              <p className="mt-1 text-base font-medium text-gray-700 dark:text-gray-200 print:text-gray-800">
                {cvProfile.headline}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 print:text-gray-700">
                {cvProfile.location}
              </p>
            </div>
            <div className="flex flex-col gap-0.5 text-xs text-gray-600 sm:items-end dark:text-gray-300 print:text-gray-700">
              <a
                href={`mailto:${cvProfile.email}`}
                className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950"
              >
                <HiMail aria-hidden="true" />
                {cvProfile.email}
              </a>
              <a
                href={cvProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950"
              >
                <BsGithub aria-hidden="true" />
                github.com/sowmikshovon
              </a>
              <a
                href={cvProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950"
              >
                <BsLinkedin aria-hidden="true" />
                linkedin.com/in/sowmikshovon
              </a>
              <span className="no-print font-mono text-[11px] text-gray-600 dark:text-gray-400">
                Updated {cvConfig.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 print:text-gray-600">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200 print:text-gray-800">
            {cvProfile.summary}
          </p>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-3 print:grid-cols-3">
          <div className="space-y-6 md:col-span-2 print:col-span-2">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 print:text-gray-600">
                Experience
              </h2>
              <div className="mt-2.5 space-y-3">
                {cvProfile.experience.map((exp) => (
                  <div key={`${exp.company}-${exp.role}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white print:text-black">
                        {exp.role} · {exp.company}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300 print:text-gray-800">
                      {exp.highlights.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 print:text-gray-600">
                Featured Engineering Projects
              </h2>
              <div className="mt-2.5 space-y-3">
                {cvProfile.featuredProjects.map((project) => (
                  <div
                    key={project.title}
                    className="border-l-2 border-gray-200 pl-3 dark:border-white/15 print:border-gray-300"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-mx-1.5 inline-flex items-center rounded-md px-1.5 py-1 text-sm font-semibold text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950 print:text-black"
                      >
                        {project.title}
                      </a>
                      <span className="font-mono text-[11px] font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">
                        {project.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300 print:text-gray-800">
                      {project.description}
                    </p>
                    <p className="mt-1 font-mono text-[11px] font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">
                      {project.tags.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 print:text-gray-600">
                Education
              </h2>
              <div className="mt-2.5 space-y-3">
                {cvProfile.education.map((edu) => (
                  <div key={`${edu.title}-${edu.institution}`}>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white print:text-black">
                      {edu.title}
                    </h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 print:text-gray-800">
                      {edu.institution}
                    </p>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">
                      {edu.period}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 print:text-gray-600">
                Technical Skills
              </h2>
              <div className="mt-2.5 space-y-3">
                {skillEntries.map(([categoryName, skills]) => (
                  <div key={categoryName}>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white print:text-black">
                      {categoryName}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300 print:text-gray-800">
                      {skills.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
