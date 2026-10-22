import SiteShell from "@/components/SiteShell";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VRINDA ÉLLE | Curated Jewellery",
  description: "Explore curated jewellery and enquire directly on WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html data-scroll-behavior="smooth"
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
