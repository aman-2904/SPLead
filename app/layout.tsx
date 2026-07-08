import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "ShaadiPlatform.com | Premium Wedding Planning & Vendor Network",
    template: "%s | ShaadiPlatform.com"
  },
  description: "Plan your dream wedding with ShaadiPlatform.com. Discover luxury venues, elite wedding vendors, and seamless tools for checklist, guest list, and budget planning.",
  keywords: ["wedding planner", "luxury wedding", "indian wedding", "wedding venues", "wedding vendors", "checklist", "budget manager", "guestlist"],
  authors: [{ name: "ShaadiPlatform Team" }],
  creator: "ShaadiPlatform",
  publisher: "ShaadiPlatform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://shaadiplatform.com",
    title: "ShaadiPlatform.com | Premium Wedding Planning Platform",
    description: "Curated vendors, stunning layouts, and intuitive coordination tools for the modern bride and groom.",
    siteName: "ShaadiPlatform.com",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "ShaadiPlatform.com - Premium Wedding Planning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShaadiPlatform.com | Premium Wedding Planning",
    description: "Plan your luxury wedding with our high-end, elegant vendor networks and interactive features.",
    images: ["/logo.png"],
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

export const viewport: Viewport = {
  themeColor: "#8C1D40",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --font-cormorant: 'Cormorant Garamond', Georgia, serif;
            --font-jakarta: 'Plus Jakarta Sans', system-ui, sans-serif;
          }
        `}} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
