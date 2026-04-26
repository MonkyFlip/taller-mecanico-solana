import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

// ---------------------------------------------------------------------------
// Tipos de cuentas on-chain (reflejo del esquema Anchor)
// ---------------------------------------------------------------------------

export interface TallerStateAccount {
  authority: PublicKey;
  clienteCount: BN;
  bump: number;
}

export interface ClienteAccount {
  authority: PublicKey;
  id: BN;
  nombre: string;
  telefono: string;
  correo: string;
  notas: string;
  vehiculoCount: BN;
  bump: number;
}

export interface VehiculoAccount {
  clienteOwner: PublicKey;
  id: BN;
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  vin: string;
  servicioCount: BN;
  bump: number;
}

export interface ServicioAccount {
  vehiculoOwner: PublicKey;
  id: BN;
  tipoServicio: string;
  costo: BN;
  fecha: BN;
  notas: string;
  bump: number;
}

// ---------------------------------------------------------------------------
// Tipos con PDA publica incluida (para uso en UI)
// ---------------------------------------------------------------------------

export interface ClienteWithPubkey {
  pubkey: PublicKey;
  account: ClienteAccount;
}

export interface VehiculoWithPubkey {
  pubkey: PublicKey;
  account: VehiculoAccount;
}

export interface ServicioWithPubkey {
  pubkey: PublicKey;
  account: ServicioAccount;
}

// ---------------------------------------------------------------------------
// Tipos de formularios
// ---------------------------------------------------------------------------

export interface ClienteFormValues {
  nombre: string;
  telefono: string;
  correo: string;
  notas: string;
}

export interface VehiculoFormValues {
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  vin: string;
}

export interface ServicioFormValues {
  tipoServicio: string;
  costo: string;
  fecha: string;
  notas: string;
}

// ---------------------------------------------------------------------------
// Tipos de estado de UI
// ---------------------------------------------------------------------------

export type ModalMode = "create" | "edit" | "delete" | null;

export interface ToastMessage {
  type: "success" | "error" | "loading";
  message: string;
}
