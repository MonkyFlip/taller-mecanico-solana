import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import WalletContextProvider from "@/providers/WalletProvider";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taller Mecanico | Sistema de Gestion On-Chain",
  description:
    "Sistema de registro de clientes, vehiculos y servicios de mantenimiento sobre Solana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body>
        <QueryProvider>
          <WalletContextProvider>
            <div className="min-h-screen bg-surface-0">
              <Navbar />
              <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {children}
              </main>
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#18181b",
                  color: "#e8e8ed",
                  border: "1px solid #2e2e34",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                },
                success: {
                  iconTheme: { primary: "#22c55e", secondary: "#0a0a0b" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#0a0a0b" },
                },
              }}
            />
          </WalletContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
