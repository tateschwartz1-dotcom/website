import type { Metadata } from "next";
import { Press_Start_2P, Courier_Prime } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

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
        className={`${pressStart2P.variable} ${courierPrime.variable} font-serif antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
