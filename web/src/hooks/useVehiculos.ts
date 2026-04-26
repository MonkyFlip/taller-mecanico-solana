"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { useAnchorProgram } from "./useAnchorProgram";
import { deriveVehiculoPda } from "@/lib/anchor";
import type { VehiculoFormValues, VehiculoWithPubkey } from "@/types";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Obtiene todos los vehiculos asociados a un cliente especifico (por PDA).
 * Filtra por el campo clienteOwner (offset 8, longitud 32 bytes).
 */
export function useVehiculos(clientePubkey: string | null) {
  const program = useAnchorProgram();

  return useQuery<VehiculoWithPubkey[]>({
    queryKey: ["vehiculos", clientePubkey],
    queryFn: async () => {
      if (!program || !clientePubkey) return [];

      const accounts = await program.account.vehiculo.all([
        {
          memcmp: {
            offset: 8, // Offset al campo clienteOwner
            bytes: clientePubkey,
          },
        },
      ]);

      return accounts.map((a) => ({
        pubkey: a.publicKey,
        account: a.account as VehiculoWithPubkey["account"],
      }));
    },
    enabled: !!program && !!clientePubkey,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useCreateVehiculo(clientePubkey: string) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VehiculoFormValues) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const clientePk = new PublicKey(clientePubkey);
      const clienteAccount = await program.account.cliente.fetch(clientePk);
      const vehiculoCount = clienteAccount.vehiculoCount as BN;

      const [vehiculoPda] = deriveVehiculoPda(clientePk, vehiculoCount);

      await program.methods
        .createVehiculo(
          data.marca,
          data.modelo,
          data.anio,
          data.placas,
          data.vin
        )
        .accounts({
          authority: publicKey,
          cliente: clientePk,
          vehiculo: vehiculoPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos", clientePubkey] });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

export function useUpdateVehiculo(clientePubkey: string) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vehiculoPubkey,
      data,
    }: {
      vehiculoPubkey: string;
      data: VehiculoFormValues;
    }) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      await program.methods
        .updateVehiculo(data.marca, data.modelo, data.anio, data.placas, data.vin)
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
          vehiculo: new PublicKey(vehiculoPubkey),
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos", clientePubkey] });
    },
  });
}

export function useDeleteVehiculo(clientePubkey: string) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehiculoPubkey: string) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      await program.methods
        .deleteVehiculo()
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
          vehiculo: new PublicKey(vehiculoPubkey),
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos", clientePubkey] });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}
