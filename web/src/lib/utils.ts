import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { centavosToMXN } from "@/constants";

// ---------------------------------------------------------------------------
// Formateo de valores
// ---------------------------------------------------------------------------

export function formatCosto(centavos: BN | number): string {
  const valor = typeof centavos === "number" ? centavos : centavos.toNumber();
  return `$${centavosToMXN(valor)} MXN`;
}

export function formatFecha(timestamp: BN | number): string {
  const unix = typeof timestamp === "number" ? timestamp : timestamp.toNumber();
  return new Date(unix * 1000).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatFechaInput(timestamp: BN | number): string {
  const unix = typeof timestamp === "number" ? timestamp : timestamp.toNumber();
  return new Date(unix * 1000).toISOString().split("T")[0];
}

export function fechaToUnix(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime() / 1000);
}

// ---------------------------------------------------------------------------
// Formateo de claves publicas
// ---------------------------------------------------------------------------

export function truncatePubkey(pubkey: PublicKey | string, chars = 4): string {
  const str = pubkey.toString();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

// ---------------------------------------------------------------------------
// Manejo de errores de Anchor
// ---------------------------------------------------------------------------

export function parseAnchorError(err: unknown): string {
  if (err instanceof Error) {
    // Extraer mensaje del error de Anchor si esta disponible
    const match = err.message.match(/Error Message: (.+)/);
    if (match) return match[1];

    // Errores de transaccion de Solana
    if (err.message.includes("User rejected")) return "Transaccion rechazada por el usuario";
    if (err.message.includes("insufficient funds")) return "Fondos insuficientes en la wallet";
    if (err.message.includes("already in use")) return "Esta cuenta ya existe en la blockchain";

    return err.message;
  }
  return "Error desconocido";
}

// ---------------------------------------------------------------------------
// Validacion de VIN (formato estandar SAE)
// ---------------------------------------------------------------------------

export function isValidVin(vin: string): boolean {
  if (vin.length === 0) return true; // Opcional
  if (vin.length !== 17) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.toUpperCase());
}
