import type { Metadata } from "next";
import { Courier_Prime } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tate Schwartz",
  description: "Personal portfolio website of Tate Schwartz",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Tate Schwartz",
    description: "Personal portfolio website of Tate Schwartz",
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
        className={`${courierPrime.variable} font-serif antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
