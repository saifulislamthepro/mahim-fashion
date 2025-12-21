// app/layout.tsx (Server Component by default)
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import Providers from "./providers"; // <-- create a wrapper for SessionProvider

export const metadata: Metadata = {
  title: "Mahim Fashion",
  description: "The best fashion wholeseller store in Dhaka Bangladesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <WhatsApp />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}