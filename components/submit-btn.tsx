"use client";

import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="group h-[3rem] w-[8rem] cursor-pointer bg-gray-900 text-white rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-100 hover:bg-gray-950 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-900/65 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:disabled:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <div
            className="h-5 w-5 animate-spin rounded-full border-b-2 border-white dark:border-gray-950"
            aria-hidden="true"
          />
          <span className="sr-only">Sending...</span>
        </>
      ) : (
        <>
          Submit{" "}
          <FaPaperPlane
            className="text-xs opacity-70 transition-all group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}
