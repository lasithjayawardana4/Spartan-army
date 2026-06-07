import type { Metadata } from "next";
import { MedievalSharp, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const medievalSharp = MedievalSharp({
  variable: "--font-medieval",
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Spartan Supplements | Premium Sports Nutrition Kandy",
  description: "Built for Warriors. Trusted by Athletes. Premium supplements for strength, muscle growth, recovery, and peak performance in Sri Lanka.",
  keywords: "Spartan Supplements, sports nutrition Kandy, whey protein Sri Lanka, creatine monohydrate, pre-workout, mass gainers Sri Lanka, gym supplements",
  authors: [{ name: "Spartan Supplements" }],
  openGraph: {
    title: "Spartan Supplements | Premium Sports Nutrition",
    description: "Premium Supplements for Strength, Muscle Growth, Recovery & Peak Performance.",
    url: "https://spartansupplements.lk",
    siteName: "Spartan Supplements",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${medievalSharp.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans selection:bg-spartan-red selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-grow flex flex-col w-full max-w-full overflow-x-hidden relative">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
