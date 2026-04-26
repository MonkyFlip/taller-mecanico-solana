import { PublicKey } from "@solana/web3.js";

// ---------------------------------------------------------------------------
// Configuracion de red
// ---------------------------------------------------------------------------

export const SOLANA_NETWORK = "devnet" as const;

export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? "https://api.devnet.solana.com";

// ---------------------------------------------------------------------------
// Program ID
// Actualiza este valor con el ID real despues de ejecutar `anchor build`
// ---------------------------------------------------------------------------

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ??
    "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
);

// ---------------------------------------------------------------------------
// Seeds para derivacion de PDAs (deben coincidir con el programa Anchor)
// ---------------------------------------------------------------------------

export const SEEDS = {
  TALLER_STATE: "taller_state",
  CLIENTE: "cliente",
  VEHICULO: "vehiculo",
  SERVICIO: "servicio",
} as const;

// ---------------------------------------------------------------------------
// Limites de campos (deben coincidir con constantes del programa)
// ---------------------------------------------------------------------------

export const FIELD_LIMITS = {
  NOMBRE_MAX: 64,
  TELEFONO_MAX: 20,
  CORREO_MAX: 64,
  NOTAS_MAX: 256,
  MARCA_MAX: 32,
  MODELO_MAX: 48,
  PLACAS_MAX: 12,
  VIN_MAX: 17,
  TIPO_SERVICIO_MAX: 128,
} as const;

// ---------------------------------------------------------------------------
// Conversion de costo: el programa almacena centavos como u64
// ---------------------------------------------------------------------------

export const COSTO_DECIMALES = 2;

export function costoToCentavos(mxn: number): number {
  return Math.round(mxn * 100);
}

export function centavosToMXN(centavos: number): string {
  return (centavos / 100).toFixed(2);
}
