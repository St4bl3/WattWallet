import type { Metadata } from "next";
import ModalProvider from "../components/ModalProvider";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Watt Wallet",
  description: "Next Gen Crypto Energy Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <ModalProvider>
            <main className="flex-grow">{children}</main>
          </ModalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
