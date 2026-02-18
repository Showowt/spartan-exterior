"use client";

import { useCallback, useEffect, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function useKonami(callback: () => void): void {
  const inputRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Clear timeout on new key
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add key to sequence
      inputRef.current.push(e.code);

      // Keep only last N keys (where N = KONAMI_CODE length)
      if (inputRef.current.length > KONAMI_CODE.length) {
        inputRef.current.shift();
      }

      // Check if sequence matches
      const isMatch =
        inputRef.current.length === KONAMI_CODE.length &&
        inputRef.current.every((key, i) => key === KONAMI_CODE[i]);

      if (isMatch) {
        inputRef.current = [];
        callback();
      }

      // Reset after 2 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        inputRef.current = [];
      }, 2000);
    },
    [callback],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);
}
