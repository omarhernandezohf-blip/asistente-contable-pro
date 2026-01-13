import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/layout/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asistente Contable Pro",
  description: "Suite contable impulsada por IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={clsx(inter.className, "bg-slate-950 text-slate-50 antialiased")}>
        {/* FORCE UPDATE INDICATOR */}
        <div className="fixed top-0 left-0 w-full bg-indigo-600 text-white text-center py-1 text-xs font-bold z-[100] animate-pulse">
          SISTEMA ACTUALIZADO V3.0 - SI VES ESTO, YA TIENES LA NUEVA VERSIÓN
        </div>
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
