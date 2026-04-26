"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { useAnchorProgram } from "./useAnchorProgram";
import { deriveServicioPda } from "@/lib/anchor";
import { costoToCentavos } from "@/constants";
import { fechaToUnix } from "@/lib/utils";
import type { ServicioFormValues, ServicioWithPubkey } from "@/types";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Obtiene todos los servicios asociados a un vehiculo especifico (por PDA).
 */
export function useServicios(vehiculoPubkey: string | null) {
  const program = useAnchorProgram();

  return useQuery<ServicioWithPubkey[]>({
    queryKey: ["servicios", vehiculoPubkey],
    queryFn: async () => {
      if (!program || !vehiculoPubkey) return [];

      const accounts = await program.account.servicio.all([
        {
          memcmp: {
            offset: 8, // Offset al campo vehiculoOwner
            bytes: vehiculoPubkey,
          },
        },
      ]);

      return accounts.map((a) => ({
        pubkey: a.publicKey,
        account: a.account as ServicioWithPubkey["account"],
      }));
    },
    enabled: !!program && !!vehiculoPubkey,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useCreateServicio(
  clientePubkey: string,
  vehiculoPubkey: string
) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServicioFormValues) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const vehiculoPk = new PublicKey(vehiculoPubkey);
      const vehiculoAccount = await program.account.vehiculo.fetch(vehiculoPk);
      const servicioCount = vehiculoAccount.servicioCount as BN;

      const [servicioPda] = deriveServicioPda(vehiculoPk, servicioCount);

      const costoEnCentavos = costoToCentavos(parseFloat(data.costo));
      const fechaUnix = new BN(fechaToUnix(data.fecha));

      await program.methods
        .createServicio(
          data.tipoServicio,
          new BN(costoEnCentavos),
          fechaUnix,
          data.notas
        )
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
          vehiculo: vehiculoPk,
          servicio: servicioPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios", vehiculoPubkey] });
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
    },
  });
}

export function useUpdateServicio(
  clientePubkey: string,
  vehiculoPubkey: string
) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      servicioPubkey,
      data,
    }: {
      servicioPubkey: string;
      data: ServicioFormValues;
    }) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      const costoEnCentavos = costoToCentavos(parseFloat(data.costo));
      const fechaUnix = new BN(fechaToUnix(data.fecha));

      await program.methods
        .updateServicio(
          data.tipoServicio,
          new BN(costoEnCentavos),
          fechaUnix,
          data.notas
        )
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
          vehiculo: new PublicKey(vehiculoPubkey),
          servicio: new PublicKey(servicioPubkey),
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios", vehiculoPubkey] });
    },
  });
}

export function useDeleteServicio(
  clientePubkey: string,
  vehiculoPubkey: string
) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (servicioPubkey: string) => {
      if (!program || !publicKey) throw new Error("Wallet no conectada");

      await program.methods
        .deleteServicio()
        .accounts({
          authority: publicKey,
          cliente: new PublicKey(clientePubkey),
          vehiculo: new PublicKey(vehiculoPubkey),
          servicio: new PublicKey(servicioPubkey),
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios", vehiculoPubkey] });
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
    },
  });
}
