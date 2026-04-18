import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "PakStartups — Pakistan's Startup Ecosystem",
  description:
    "Discover Pakistan's most innovative startups, find co-founders, access funding, and connect with the growing entrepreneurial community.",
  keywords: ["Pakistan startups", "startup ecosystem", "co-founder matching", "PakStartups", "entrepreneurship Pakistan"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PakStartups — Pakistan's Startup Ecosystem",
    description: "Where curious minds and dreamers build Pakistan's tomorrow together.",
    type: "website",
    url: "https://pakstartups.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#e8ffee] text-[#002112] selection:bg-[#b1f0ce] selection:text-[#002114] antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
