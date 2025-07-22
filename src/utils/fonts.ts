// Font configuration with error handling
import { Geist, Geist_Mono } from "next/font/google";

// Safe font loading with fallbacks
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "Arial", "sans-serif"],
  display: "swap",
  adjustFontFallback: true,
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["ui-monospace", "SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
  display: "swap",
  adjustFontFallback: true,
});

// CSS variables for fallback fonts
export const fontFallbackCSS = `
  :root {
    --font-sans-fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono-fallback: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  }

  body {
    font-family: var(--font-geist-sans, var(--font-sans-fallback));
  }

  code, pre {
    font-family: var(--font-geist-mono, var(--font-mono-fallback));
  }
`;
