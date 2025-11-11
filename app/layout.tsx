import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Абылайхан & Дильназ - Үйлену тойына шақыру",
  description: "Сіз(дер)ді ұлымыз бен келініміз Абылайхан мен Дильназдың үйлену тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз! 13.12.2025 жыл, сағат 15:00, Ресторан Туран, Екібастұз қаласы",
  keywords: "үйлену тойы, той, шақыру, Абылайхан, Дильназ, wedding, invitation",
  authors: [{ name: "Толеген-Маххабат" }],
  openGraph: {
    title: "Абылайхан & Дильназ - Үйлену тойына шақыру",
    description: "Сіз(дер)ді ұлымыз бен келініміз Абылайхан мен Дильназдың үйлену тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
    type: "website",
    locale: "kk_KZ",
    siteName: "Абылайхан & Дильназ Wedding",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
