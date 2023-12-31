"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MetaMaskProvider } from "@/contexts/WalletContext";
import { AuctionProvider } from "@/contexts/AuctionContext";
import { ProjectDetailProvider } from "@/contexts/ProjectDetailContext"
import { NavBar } from "@/components/NavBar";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "900"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuctionProvider>
        <ProjectDetailProvider>
          <MetaMaskProvider>
            <body className={`bg-whiteBackground ${poppins.className}`}>
              <NavBar />
              {children}
            </body>
          </MetaMaskProvider>
        </ProjectDetailProvider>
      </AuctionProvider>
    </html>
  );
}
