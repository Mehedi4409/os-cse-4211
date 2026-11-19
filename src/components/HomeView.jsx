import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ArrowRight, Cpu } from "lucide-react";

// Hand-notes PDF. The file must be in: public/downloads/
const filename = "os-note-kulsuma-mid.pdf";
const notesFile = {
  filename,
  type: filename.split(".").pop().toUpperCase(),
  href: `/downloads/${filename}`,
};

console.log("[Download Debug] Step 0 - Module loaded:", {
  filename,
  notesFile,
  origin: typeof window !== "undefined" ? window.location.origin : "SSR",
  fullUrl:
    typeof window !== "undefined"
      ? `${window.location.origin}${notesFile.href}`
      : notesFile.href,
});

// --- Animation Configuration & Helper ---
const EASING = [0.16, 1, 0.3, 1];

const getEntranceAnimation = (delay = 0, yOffset = 20, duration = 0.7) => ({
  initial: { opacity: 0, y: yOffset },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASING },
});

const BUTTON_INTERACTION = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 },
};

// --- Single-Responsibility Sub-Components ---
const ArchitectureBadge = () => (
  <motion.div
    {...getEntranceAnimation(0, -15, 0.6)}
    className="mb-6 inline-flex items-center gap-2"
  >
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111d4a] text-white">
      <Cpu className="h-3 w-3" />
    </div>
    <span className="text-xs font-medium tracking-wide text-gray-600">
      CSE - 4211: Operating Systems
    </span>
  </motion.div>
);

const HeroHeader = () => (
  <>
    <motion.h1
      {...getEntranceAnimation(0.1, 20, 0.7)}
      className="font-extrabold tracking-tight text-gray-900"
      style={{
        fontSize: "clamp(2.25rem, 5vw + 1rem, 4rem)",
        lineHeight: "1.1",
      }}
    >
      Master Operating Systems <br />
      <span className="bg-gradient-to-r from-[#111d4a] to-[#92140c] bg-clip-text text-transparent">
        Visually & Interactively
      </span>
    </motion.h1>

    <motion.p
      {...getEntranceAnimation(0.2, 20, 0.7)}
      className="mt-6 max-w-xl text-gray-500"
      style={{
        fontSize: "clamp(1rem, 1vw + 0.5rem, 1.15rem)",
        lineHeight: "1.6",
      }}
    >
      Explore kernel internals, process synchronization, and CPU scheduling
      through real-time front-end simulations designed for clarity.
    </motion.p>
  </>
);

const ActionButton = ({ onClick, children }) => (
  <motion.button
    {...BUTTON_INTERACTION}
    type="button"
    onClick={onClick}
    className="group relative inline-flex w-full sm:w-64 items-center justify-center gap-2.5 rounded-xl bg-[#111d4a] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#111d4a]/15 transition-all hover:bg-[#111d4a]/90"
  >
    {children}
  </motion.button>
);

const ActionGroup = ({ onStartLecture, onDownloadClick }) => (
  <motion.div
    {...getEntranceAnimation(0.3, 25, 0.8)}
    className="mt-10 flex w-full flex-col sm:flex-row items-center justify-center gap-4 px-4"
  >
    <ActionButton onClick={onStartLecture}>
      <span>Start Lecture 1</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </ActionButton>

    <a
      href={notesFile.href}
      download={notesFile.filename}
      onClick={onDownloadClick}
      className="group relative inline-flex w-full sm:w-64 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#92140c]/40 hover:text-[#92140c] active:scale-[0.98]"
    >
      <Download className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#92140c]" />
      <span>Download Hand Notes</span>
    </a>
  </motion.div>
);

const CourseCredits = () => (
  <motion.div
    {...getEntranceAnimation(0.4, 20, 0.8)}
    className="mt-16 border-t border-gray-100 pt-8 text-center"
  >
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
      <span>
        Course Teacher:{"  "}
        <strong className="font-semibold text-gray-700">
          MD. Mizanur Rahman
        </strong>
      </span>
      <span className="hidden sm:inline text-gray-200">•</span>
      <span>
        Notes by:{"  "}
        <strong className="font-semibold text-gray-700">Kulsuma Akhter</strong>
      </span>
      <span className="hidden sm:inline text-gray-200">•</span>
      <span>
        Developed by:{"  "}
        <strong className="font-semibold text-gray-700">Mehedi Hasan</strong>
      </span>
    </div>
  </motion.div>
);

// --- Main View Component ---
const HomeView = ({ onStartLecture }) => {
  useEffect(() => {
    console.log("[Download Debug] Step 1 - HomeView mounted, checking file availability:", notesFile.href);

    fetch(notesFile.href, { method: "HEAD" })
      .then((res) => {
        console.log("[Download Debug] Step 1b - HEAD response received:", {
          status: res.status,
          ok: res.ok,
          statusText: res.statusText,
          contentType: res.headers.get("content-type"),
          contentLength: res.headers.get("content-length"),
          redirected: res.redirected,
          url: res.url,
        });
        if (!res.ok) {
          console.error(
            "[Download Debug] ERROR - File check failed! Make sure the file exists at public/downloads/" +
              notesFile.filename +
              " and exact spelling/case matches."
          );
        }
      })
      .catch((err) => {
        console.error("[Download Debug] ERROR - Fetch HEAD threw an error:", err);
      });
  }, []);

  const handleDownloadClick = async (e) => {
    console.log("[Download Debug] Step 2 - Anchor clicked:", {
      defaultPrevented: e.defaultPrevented,
      hrefAttr: e.currentTarget.getAttribute("href"),
      resolvedHref: e.currentTarget.href,
      downloadAttr: e.currentTarget.getAttribute("download"),
      target: e.currentTarget.target,
    });

    try {
      console.log("[Download Debug] Step 3 - Testing GET request to:", notesFile.href);
      const res = await fetch(notesFile.href);
      console.log("[Download Debug] Step 4 - GET response status:", {
        status: res.status,
        ok: res.ok,
        contentType: res.headers.get("content-type"),
        contentDisposition: res.headers.get("content-disposition"),
        url: res.url,
      });

      if (!res.ok) {
        const previewText = await res.text();
        console.error("[Download Debug] Step 5 - Server returned non-OK response:", {
          status: res.status,
          bodyPreview: previewText.slice(0, 200),
        });
        return;
      }

      const blob = await res.blob();
      console.log("[Download Debug] Step 5 - Blob received:", {
        size: blob.size,
        type: blob.type,
      });

      if (blob.type.includes("text/html")) {
        console.warn(
          "[Download Debug] WARNING - Received text/html instead of PDF! Likely falling back to index.html (404 SPA fallback) or wrong path."
        );
      }
    } catch (err) {
      console.error("[Download Debug] Step 3/4/5 ERROR - Request failed:", err);
    }
  };

  return (
    <div
      className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-white px-6 py-12 text-gray-900 selection:bg-[#92140c]/10 selection:text-[#92140c]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40">
        <div className="h-[30vw] w-[30vw] rounded-full bg-gradient-to-tr from-[#111d4a]/5 to-[#92140c]/5 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <ArchitectureBadge />
        <HeroHeader />
        <ActionGroup
          onStartLecture={onStartLecture}
          onDownloadClick={handleDownloadClick}
        />
        <CourseCredits />
      </div>
    </div>
  );
};

export default HomeView;