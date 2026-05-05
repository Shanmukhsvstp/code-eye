"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.startLoader = () => {
      setVisible(true);
    };
    window.stopLoader = () => {
        setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 300); // smooth finish delay

      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return (
    <md-linear-progress
      indeterminate
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}
    />
  );
}