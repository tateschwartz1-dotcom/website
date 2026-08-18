import type { Metadata } from "next";
import { Courier_Prime, EB_Garamond } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Reading typeface for posts. Adobe Garamond isn't licensed for the web;
// EB Garamond is the open cut of the same design.
const ebGaramond = EB_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tateschwartz.net"),
  title: "Tate Schwartz",
  description: "Personal portfolio website of Tate Schwartz",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Tate Schwartz",
    description: "Personal portfolio website of Tate Schwartz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tate Schwartz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tate Schwartz",
    description: "Personal portfolio website of Tate Schwartz",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body
        className={`${courierPrime.variable} ${ebGaramond.variable} font-serif antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
