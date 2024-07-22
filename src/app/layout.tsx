// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Tracker",
  description: "Generated by Crypto Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}