
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { dark } from "@clerk/themes";
import "../globals.css";

export const metadata: Metadata = {
  title: "threads",
  description: "Next 13 threads web application",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }} >
      <html lang="en">
        <body className={`${inter.className} bg-dark-2`}>
     {children}
            
            </body>
      </html>
    </ClerkProvider>
  );
}
