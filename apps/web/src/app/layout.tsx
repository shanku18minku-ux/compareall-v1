import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "../lib/location/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CompareAll",
  description: "Search once. Compare everywhere. Choose better.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered'); })
                    .catch(function(err) { console.log('SW error', err); });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
