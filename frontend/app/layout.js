"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MetaMaskProvider } from "@/contexts/WalletContext";
import { NavBar } from "@/components/NavBar";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "900"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <MetaMaskProvider>
        <body className={`bg-whiteBackground ${poppins.className}`}>
          <NavBar />
          {children}
        </body>
      </MetaMaskProvider>
    </html>
  );
}
