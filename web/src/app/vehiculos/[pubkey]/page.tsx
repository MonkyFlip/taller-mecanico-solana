"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChevronLeft, PlusCircle, Wrench, Car } from "lucide-react";
import toast from "react-hot-toast";
import { useServicios, useCreateServicio, useUpdateServicio, useDeleteServicio } from "@/hooks/useServicios";
import { useAnchorProgram } from "@/hooks/useAnchorProgram";
import ServicioCard from "@/components/servicio/ServicioCard";
import ServicioForm from "@/components/servicio/ServicioForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/ui/Status";
import { parseAnchorError, truncatePubkey, formatCosto } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import type { ServicioWithPubkey, ServicioFormValues, ModalMode } from "@/types";

export default function VehiculoDetallePage() {
  const params = useParams<{ pubkey: string }>();
  const searchParams = useSearchParams();
  const vehiculoPubkey = params.pubkey;
  const clientePubkey = searchParams.get("cliente") ?? "";

  const { connected } = useWallet();
  const program = useAnchorProgram();

  const { data: vehiculoAccount } = useQuery({
    queryKey: ["vehiculo", vehiculoPubkey],
    queryFn: async () => {
      if (!program) return null;
      return program.account.vehiculo.fetch(new PublicKey(vehiculoPubkey));
    },
    enabled: !!program && !!vehiculoPubkey,
  });

  const { data: servicios = [], isLoading, error } = useServicios(vehiculoPubkey);
  const createMutation = useCreateServicio(clientePubkey, vehiculoPubkey);
  const updateMutation = useUpdateServicio(clientePubkey, vehiculoPubkey);
  const deleteMutation = useDeleteServicio(clientePubkey, vehiculoPubkey);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedServicio, setSelectedServicio] = useState<ServicioWithPubkey | null>(null);

  const closeModal = () => {
    setModalMode(null);
    setSelectedServicio(null);
  };

  const handleCreate = async (data: ServicioFormValues) => {
    const toastId = toast.loading("Registrando servicio...");
    try {
      await createMutation.mutateAsync(data);
      toast.success("Servicio registrado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const handleUpdate = async (data: ServicioFormValues) => {
    if (!selectedServicio) return;
    const toastId = toast.loading("Actualizando servicio...");
    try {
      await updateMutation.mutateAsync({
        servicioPubkey: selectedServicio.pubkey.toString(),
        data,
      });
      toast.success("Servicio actualizado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const handleDelete = async () => {
    if (!selectedServicio) return;
    const toastId = toast.loading("Eliminando servicio...");
    try {
      await deleteMutation.mutateAsync(selectedServicio.pubkey.toString());
      toast.success("Servicio eliminado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const totalCosto = servicios.reduce(
    (sum, s) => sum + s.account.costo.toNumber(),
    0
  );

  if (!connected) {
    return (
      <EmptyState
        icon={<Wrench size={22} />}
        title="Wallet no conectada"
        description="Conecta tu wallet para ver los servicios del vehiculo"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/clientes"
          className="flex items-center gap-1 hover:text-text-secondary transition-colors"
        >
          <ChevronLeft size={14} />
          Clientes
        </Link>
        <span>/</span>
        {clientePubkey && (
          <>
            <Link
              href={`/clientes/${clientePubkey}`}
              className="hover:text-text-secondary transition-colors font-mono"
            >
              {truncatePubkey(clientePubkey, 4)}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-mono">{truncatePubkey(vehiculoPubkey, 4)}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Car size={16} className="text-text-muted" />
            {vehiculoAccount && (
              <span className="text-sm text-text-secondary">
                {vehiculoAccount.marca} {vehiculoAccount.modelo} {vehiculoAccount.anio}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl tracking-widest text-text-primary">
            SERVICIOS
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {servicios.length} servicio{servicios.length !== 1 ? "s" : ""} &bull; Total:{" "}
            <span className="text-text-primary font-medium font-mono">
              {formatCosto(totalCosto)}
            </span>
          </p>
        </div>

        <Button
          icon={<PlusCircle size={15} />}
          onClick={() => setModalMode("create")}
        >
          Nuevo servicio
        </Button>
      </div>

      {error && (
        <ErrorState message="No se pudieron cargar los servicios." />
      )}

      {isLoading && (
        <div className="py-16">
          <LoadingSpinner label="Consultando servicios en la blockchain..." />
        </div>
      )}

      {!isLoading && !error && servicios.length === 0 && (
        <EmptyState
          icon={<Wrench size={22} />}
          title="Sin servicios registrados"
          description="Este vehiculo no tiene historial de servicios aun"
          action={
            <Button
              icon={<PlusCircle size={14} />}
              onClick={() => setModalMode("create")}
            >
              Registrar primer servicio
            </Button>
          }
        />
      )}

      {servicios.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {servicios
            .sort((a, b) => b.account.fecha.toNumber() - a.account.fecha.toNumber())
            .map((servicio) => (
              <ServicioCard
                key={servicio.pubkey.toString()}
                servicio={servicio}
                onEdit={(s) => {
                  setSelectedServicio(s);
                  setModalMode("edit");
                }}
                onDelete={(s) => {
                  setSelectedServicio(s);
                  setModalMode("delete");
                }}
              />
            ))}
        </div>
      )}

      <Modal
        open={modalMode === "create"}
        onClose={closeModal}
        title="Registrar servicio"
        description="El servicio quedara vinculado al vehiculo en la blockchain"
      >
        <ServicioForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        open={modalMode === "edit"}
        onClose={closeModal}
        title="Editar servicio"
      >
        <ServicioForm
          defaultValues={selectedServicio ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      <Modal
        open={modalMode === "delete"}
        onClose={closeModal}
        title="Eliminar servicio"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Esta accion cerrara la cuenta PDA del servicio{" "}
            <span className="font-semibold text-text-primary">
              {selectedServicio?.account.tipoServicio}
            </span>{" "}
            en la blockchain. Esta operacion es irreversible.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Confirmar eliminacion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
