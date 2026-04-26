"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { useAnchorProgram } from "./useAnchorProgram";
import { deriveTallerStatePda, deriveClientePda } from "@/lib/anchor";
import { costoToCentavos } from "@/constants";
import type { ClienteFormValues, ClienteWithPubkey } from "@/types";

const QUERY_KEY = "clientes";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Obtiene todos los clientes asociados a la wallet conectada.
 * Usa getProgramAccounts con filtro por authority (discriminador + 32 bytes).
 */
export function useClientes() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();

  return useQuery<ClienteWithPubkey[]>({
    queryKey: [QUERY_KEY, publicKey?.toString()],
    queryFn: async () => {
      if (!program || !publicKey) return [];

      const accounts = await program.account.cliente.all([
        {
          memcmp: {
            // Offset: 8 (discriminador) para llegar al campo authority
            offset: 8,
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      return accounts.map((a) => ({
        pubkey: a.publicKey,
        account: a.account as ClienteWithPubkey["account"],
      }));
    },
    enabled: !!program && !!publicKey,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useInitializeTaller() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const [tallerStatePda] = deriveTallerStatePda(publicKey);

      await program.methods
        .initializeTaller()
        .accounts({
          authority: publicKey,
          tallerState: tallerStatePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tallerState"] });
    },
  });
}

export function useCreateCliente() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClienteFormValues) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const [tallerStatePda] = deriveTallerStatePda(publicKey);
      const tallerState = await program.account.tallerState.fetch(tallerStatePda);
      const currentCount = tallerState.clienteCount as BN;

      const [clientePda] = deriveClientePda(publicKey, currentCount);

      await program.methods
        .createCliente(data.nombre, data.telefono, data.correo, data.notas)
        .accounts({
          authority: publicKey,
          tallerState: tallerStatePda,
          cliente: clientePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateCliente() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientePubkey,
      data,
    }: {
      clientePubkey: string;
      data: ClienteFormValues;
    }) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const { PublicKey } = await import("@solana/web3.js");

      await program.methods
        .updateCliente(data.nombre, data.telefono, data.correo, data.notas)
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteCliente() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientePubkey: string) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const { PublicKey } = await import("@solana/web3.js");

      await program.methods
        .deleteCliente()
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
