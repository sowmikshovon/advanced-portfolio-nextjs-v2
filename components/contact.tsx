"use client";

import { useSectionInView } from "@/lib/hooks";
import React, { useRef } from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import toast from "react-hot-toast";

export default function Contact() {
  const { ref } = useSectionInView("Contact", 0.5);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <motion.section
      ref={ref}
      id="contact"
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center scroll-mt-28"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <SectionHeading>Contact Me</SectionHeading>
      <p className="text-gray-700 -mt-6 dark:text-white/80">
        Please feel free to contact me at{" "}
        <a
          className="underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white rounded-sm"
          href="mailto:sowmikshovon@gmail.com"
        >
          sowmikshovon@gmail.com
        </a>{" "}
        or through this form.
      </p>
      <form
        ref={formRef}
        action={async (formData) => {
          const { error } = await sendEmail(formData);

          if (error) {
            toast.error(error);
            return;
          }
          toast.success("Email sent successfully!");
          formRef.current?.reset();
        }}
        className="mt-10 flex flex-col text-left"
      >
        <label
          htmlFor="senderEmail"
          className="mb-1.5 text-left text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          Your email
        </label>
        <input
          id="senderEmail"
          className="h-14 rounded-lg px-4 bg-white text-gray-900 border border-black/15 placeholder:text-gray-400 dark:bg-white/5 dark:text-white dark:border-white/15 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white transition-all"
          name="senderEmail"
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          placeholder="name@example.com"
        />
        <label
          htmlFor="message"
          className="mt-4 mb-1.5 text-left text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          Your message
        </label>
        <textarea
          id="message"
          className="h-52 mb-4 rounded-lg p-4 bg-white text-gray-900 border border-black/15 placeholder:text-gray-400 dark:bg-white/5 dark:text-white dark:border-white/15 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white transition-all"
          name="message"
          placeholder="Write your message..."
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
}
