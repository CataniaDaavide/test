"use client";

import { useState } from "react";
import { color, motion } from "motion/react";

export default function TestPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-screen min-h-screen flex flex-col gap-3 items-center p-6">
      <h1 className="text-5xl font-bold">TEST PAGE</h1>

      <div className="w-full h-20 bg-red-500" onClick={() => setOpen(!open)} />
      <div className="w-full flex flex-col gap-3">
        <motion.div
          className="w-full h-20 bg-yellow-500"
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-full h-20 bg-blue-500"
          animate={{ y: open ? 0 : -90 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p>{open ? "true" : "false"}</p>
    </div>
  );
}
