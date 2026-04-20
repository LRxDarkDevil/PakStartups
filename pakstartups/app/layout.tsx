import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/context/AuthContext";
import CookieConsent from "@/components/layout/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://pakstartups.io"),
  title: {
    default: "PakStartups — Pakistan's Startup Ecosystem",
    template: "%s | PakStartups",
  },
  description:
    "Discover Pakistan's most innovative startups, find co-founders, access funding, and connect with the growing entrepreneurial community.",
  keywords: ["Pakistan startups", "startup ecosystem", "co-founder matching", "PakStartups", "entrepreneurship Pakistan"],
  authors: [{ name: "PakStartups Team" }],
  creator: "PakStartups",
  publisher: "PakStartups",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "PakStartups — Pakistan's Startup Ecosystem",
    description: "Where curious minds and dreamers build Pakistan's tomorrow together.",
    type: "website",
    url: "https://pakstartups.io",
    siteName: "PakStartups",
    images: [
      {
        url: "/images/image-038.jpg",
        width: 1200,
        height: 630,
        alt: "PakStartups Ecosystem Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PakStartups",
    creator: "@PakStartups",
    title: "PakStartups — Pakistan's Startup Ecosystem",
    description: "Discover Pakistan's most innovative startups, find co-founders, and connect with the growing entrepreneurial community.",
    images: ["/images/image-038.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
