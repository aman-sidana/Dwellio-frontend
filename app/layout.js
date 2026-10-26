import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dwellio — Real Estate Property Platform",
  description: "Find your dream home, apartment, villa, or commercial property across India with Dwellio.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} w-full min-h-screen antialiased`}
    >
      <body className="w-full min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden m-0 p-0">
        <Navbar />
        <main className="w-full flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
