"use client";

import { useMemo } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/lib/anchor";
import type { TallerMecanico } from "@/lib/idl";

/**
 * Hook que retorna una instancia del programa Anchor lista para uso.
 * Depende de la wallet conectada y la conexion de Solana.
 * Retorna null si la wallet no esta conectada.
 */
export function useAnchorProgram(): Program<TallerMecanico> | null {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      return null;
    }

    const provider = new AnchorProvider(
      connection,
      wallet as Parameters<typeof AnchorProvider>[1],
      { commitment: "confirmed" }
    );

    return getProgram(provider);
  }, [connection, wallet]);
}
