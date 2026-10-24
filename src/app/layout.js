import SiteShell from "@/components/SiteShell";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata = {
  title: "VRINDA ÉLLE | Curated Jewellery",
  description: "Explore curated jewellery and enquire directly on WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html data-scroll-behavior="smooth"
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col"><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
