"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProgram } from "./useAnchorProgram";
import { deriveTallerStatePda } from "@/lib/anchor";
import type { TallerStateAccount } from "@/types";

/**
 * Verifica si el TallerState ya fue inicializado para la wallet conectada.
 * Retorna null si no existe (requiere llamar a initialize_taller primero).
 */
export function useTallerState() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();

  return useQuery<TallerStateAccount | null>({
    queryKey: ["tallerState", publicKey?.toString()],
    queryFn: async () => {
      if (!program || !publicKey) return null;

      const [tallerStatePda] = deriveTallerStatePda(publicKey);

      try {
        const state = await program.account.tallerState.fetch(tallerStatePda);
        return state as TallerStateAccount;
      } catch {
        // La cuenta no existe aun (no inicializada)
        return null;
      }
    },
    enabled: !!program && !!publicKey,
  });
}
