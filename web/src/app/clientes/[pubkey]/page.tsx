"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChevronLeft, PlusCircle, Car } from "lucide-react";
import toast from "react-hot-toast";
import { useVehiculos, useCreateVehiculo, useUpdateVehiculo, useDeleteVehiculo } from "@/hooks/useVehiculos";
import { useAnchorProgram } from "@/hooks/useAnchorProgram";
import VehiculoCard from "@/components/vehiculo/VehiculoCard";
import VehiculoForm from "@/components/vehiculo/VehiculoForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/ui/Status";
import { parseAnchorError, truncatePubkey } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { VehiculoWithPubkey, VehiculoFormValues, ModalMode } from "@/types";
import { PublicKey } from "@solana/web3.js";

export default function ClienteDetallePage() {
  const params = useParams<{ pubkey: string }>();
  const clientePubkey = params.pubkey;

  const { connected } = useWallet();
  const program = useAnchorProgram();

  // Obtener datos del cliente
  const { data: clienteAccount } = useQuery({
    queryKey: ["cliente", clientePubkey],
    queryFn: async () => {
      if (!program) return null;
      return program.account.cliente.fetch(new PublicKey(clientePubkey));
    },
    enabled: !!program && !!clientePubkey,
  });

  const { data: vehiculos = [], isLoading, error } = useVehiculos(clientePubkey);
  const createMutation = useCreateVehiculo(clientePubkey);
  const updateMutation = useUpdateVehiculo(clientePubkey);
  const deleteMutation = useDeleteVehiculo(clientePubkey);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoWithPubkey | null>(null);

  const closeModal = () => {
    setModalMode(null);
    setSelectedVehiculo(null);
  };

  const handleCreate = async (data: VehiculoFormValues) => {
    const toastId = toast.loading("Registrando vehiculo...");
    try {
      await createMutation.mutateAsync(data);
      toast.success("Vehiculo registrado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const handleUpdate = async (data: VehiculoFormValues) => {
    if (!selectedVehiculo) return;
    const toastId = toast.loading("Actualizando vehiculo...");
    try {
      await updateMutation.mutateAsync({
        vehiculoPubkey: selectedVehiculo.pubkey.toString(),
        data,
      });
      toast.success("Vehiculo actualizado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const handleDelete = async () => {
    if (!selectedVehiculo) return;
    const toastId = toast.loading("Eliminando vehiculo...");
    try {
      await deleteMutation.mutateAsync(selectedVehiculo.pubkey.toString());
      toast.success("Vehiculo eliminado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  if (!connected) {
    return (
      <EmptyState
        icon={<Car size={22} />}
        title="Wallet no conectada"
        description="Conecta tu wallet para ver los vehiculos del cliente"
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
        <span className="font-mono text-text-muted">
          {truncatePubkey(clientePubkey, 6)}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-widest text-text-primary">
            {clienteAccount ? clienteAccount.nombre.toUpperCase() : "VEHICULOS"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {vehiculos.length} vehiculo{vehiculos.length !== 1 ? "s" : ""} registrado
            {vehiculos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button
          icon={<PlusCircle size={15} />}
          onClick={() => setModalMode("create")}
        >
          Nuevo vehiculo
        </Button>
      </div>

      {error && (
        <ErrorState message="No se pudieron cargar los vehiculos." />
      )}

      {isLoading && (
        <div className="py-16">
          <LoadingSpinner label="Consultando vehiculos en la blockchain..." />
        </div>
      )}

      {!isLoading && !error && vehiculos.length === 0 && (
        <EmptyState
          icon={<Car size={22} />}
          title="Sin vehiculos registrados"
          description="Este cliente no tiene vehiculos aun"
          action={
            <Button
              icon={<PlusCircle size={14} />}
              onClick={() => setModalMode("create")}
            >
              Registrar vehiculo
            </Button>
          }
        />
      )}

      {vehiculos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehiculos.map((vehiculo) => (
            <VehiculoCard
              key={vehiculo.pubkey.toString()}
              vehiculo={vehiculo}
              clientePubkey={clientePubkey}
              onEdit={(v) => {
                setSelectedVehiculo(v);
                setModalMode("edit");
              }}
              onDelete={(v) => {
                setSelectedVehiculo(v);
                setModalMode("delete");
              }}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalMode === "create"}
        onClose={closeModal}
        title="Registrar vehiculo"
        description="El vehiculo quedara vinculado al cliente en la blockchain"
      >
        <VehiculoForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        open={modalMode === "edit"}
        onClose={closeModal}
        title="Editar vehiculo"
      >
        <VehiculoForm
          defaultValues={selectedVehiculo ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      <Modal
        open={modalMode === "delete"}
        onClose={closeModal}
        title="Eliminar vehiculo"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Esta accion cerrara la cuenta PDA del vehiculo{" "}
            <span className="font-semibold text-text-primary">
              {selectedVehiculo?.account.marca} {selectedVehiculo?.account.modelo}
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
