import "@/index.css";
import Providers from "./providers";

export const metadata = {
  title: "AXIS | Premium Footwear & Sneakers",
  description: "The definitive destination for curated footwear and rare sneakers.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-kinetic selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
