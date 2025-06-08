import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutClient from "./RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReviseMaster",
  description: "Your AI-powered study companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
