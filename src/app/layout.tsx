import type { Metadata } from "next";
import { geistSans, geistMono } from "../utils/fonts";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "Profile Platform",
  description: "Platform for managing and viewing public profiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
