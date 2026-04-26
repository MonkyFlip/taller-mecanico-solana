import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { PROGRAM_ID, SEEDS, SOLANA_RPC_ENDPOINT } from "@/constants";
import type { TallerMecanico } from "./idl";

// ---------------------------------------------------------------------------
// Instancia del programa (singleton por sesion)
// ---------------------------------------------------------------------------

let programInstance: Program<TallerMecanico> | null = null;

export function getConnection(): Connection {
  return new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
}

export function getProgram(provider: AnchorProvider): Program<TallerMecanico> {
  setProvider(provider);
  // En produccion el IDL se importa desde target/idl/taller_mecanico.json
  // y se pasa aqui como segundo argumento.
  // Por ahora se usa el PROGRAM_ID directamente con el IDL tipado.
  return new Program(
    // El IDL JSON real se generara tras `anchor build`
    // y debe ser importado aqui: import IDL from "@/lib/taller_mecanico.json"
    {} as TallerMecanico,
    PROGRAM_ID,
    provider
  );
}

// ---------------------------------------------------------------------------
// Derivacion de PDAs
// ---------------------------------------------------------------------------

export function deriveTallerStatePda(authority: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.TALLER_STATE), authority.toBuffer()],
    PROGRAM_ID
  );
}

export function deriveClientePda(authority: PublicKey, id: BN): [PublicKey, number] {
  const idBytes = Buffer.alloc(8);
  id.toArrayLike(Buffer, "le", 8).copy(idBytes);
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.CLIENTE), authority.toBuffer(), idBytes],
    PROGRAM_ID
  );
}

export function deriveVehiculoPda(
  clientePubkey: PublicKey,
  id: BN
): [PublicKey, number] {
  const idBytes = Buffer.alloc(8);
  id.toArrayLike(Buffer, "le", 8).copy(idBytes);
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.VEHICULO), clientePubkey.toBuffer(), idBytes],
    PROGRAM_ID
  );
}

export function deriveServicioPda(
  vehiculoPubkey: PublicKey,
  id: BN
): [PublicKey, number] {
  const idBytes = Buffer.alloc(8);
  id.toArrayLike(Buffer, "le", 8).copy(idBytes);
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.SERVICIO), vehiculoPubkey.toBuffer(), idBytes],
    PROGRAM_ID
  );
}
