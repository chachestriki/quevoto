import type { Metadata } from "next";
import { Archivo_Black, Rubik } from "next/font/google";
import "./globals.css";

const title = Archivo_Black({ variable: "--font-title", weight: "400", subsets: ["latin"] });
const body = Rubik({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "quevoto? · Los programas electorales, en cristiano",
  description: "Resúmenes claros de los programas de cada partido y un chat que responde con lo que pone de verdad, citando la página.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${title.variable} ${body.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
