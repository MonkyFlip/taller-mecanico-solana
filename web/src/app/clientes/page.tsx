"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { UserPlus, Users, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  useClientes,
  useCreateCliente,
  useUpdateCliente,
  useDeleteCliente,
} from "@/hooks/useClientes";
import ClienteCard from "@/components/cliente/ClienteCard";
import ClienteForm from "@/components/cliente/ClienteForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/ui/Status";
import { parseAnchorError } from "@/lib/utils";
import type { ClienteWithPubkey, ClienteFormValues, ModalMode } from "@/types";

export default function ClientesPage() {
  const { connected } = useWallet();
  const { data: clientes = [], isLoading, error } = useClientes();

  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();
  const deleteMutation = useDeleteCliente();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCliente, setSelectedCliente] = useState<ClienteWithPubkey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClientes = clientes.filter(
    (c) =>
      c.account.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.account.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.account.telefono.includes(searchQuery)
  );

  const closeModal = () => {
    setModalMode(null);
    setSelectedCliente(null);
  };

  const handleCreate = async (data: ClienteFormValues) => {
    const toastId = toast.loading("Registrando cliente en la blockchain...");
    try {
      await createMutation.mutateAsync(data);
      toast.success("Cliente registrado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const handleUpdate = async (data: ClienteFormValues) => {
    if (!selectedCliente) return;
    const toastId = toast.loading("Actualizando cliente...");
    try {
      await updateMutation.mutateAsync({
        clientePubkey: selectedCliente.pubkey.toString(),
        data,
      });
      toast.success("Cliente actualizado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  const handleDelete = async () => {
    if (!selectedCliente) return;
    const toastId = toast.loading("Eliminando cliente de la blockchain...");
    try {
      await deleteMutation.mutateAsync(selectedCliente.pubkey.toString());
      toast.success("Cliente eliminado correctamente", { id: toastId });
      closeModal();
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  if (!connected) {
    return (
      <EmptyState
        icon={<Users size={22} />}
        title="Wallet no conectada"
        description="Conecta tu wallet para gestionar clientes"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-widest text-text-primary">
            CLIENTES
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado
            {clientes.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button
          icon={<UserPlus size={15} />}
          onClick={() => setModalMode("create")}
        >
          Nuevo cliente
        </Button>
      </div>

      {/* Search */}
      {clientes.length > 0 && (
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o telefono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 sm:max-w-sm"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <ErrorState message="No se pudieron cargar los clientes. Verifica tu conexion y el ID del programa." />
      )}

      {/* Loading */}
      {isLoading && (
        <div className="py-16">
          <LoadingSpinner label="Consultando cuentas en la blockchain..." />
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && clientes.length === 0 && (
        <EmptyState
          icon={<Users size={22} />}
          title="Sin clientes registrados"
          description="Registra el primer cliente del taller"
          action={
            <Button
              icon={<UserPlus size={14} />}
              onClick={() => setModalMode("create")}
            >
              Registrar primer cliente
            </Button>
          }
        />
      )}

      {/* No results after search */}
      {!isLoading && !error && clientes.length > 0 && filteredClientes.length === 0 && (
        <EmptyState
          icon={<Search size={22} />}
          title="Sin resultados"
          description={`No se encontraron clientes para "${searchQuery}"`}
        />
      )}

      {/* Grid */}
      {filteredClientes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClientes.map((cliente) => (
            <ClienteCard
              key={cliente.pubkey.toString()}
              cliente={cliente}
              onEdit={(c) => {
                setSelectedCliente(c);
                setModalMode("edit");
              }}
              onDelete={(c) => {
                setSelectedCliente(c);
                setModalMode("delete");
              }}
            />
          ))}
        </div>
      )}

      {/* Modal: Create */}
      <Modal
        open={modalMode === "create"}
        onClose={closeModal}
        title="Registrar cliente"
        description="Los datos se almacenaran de forma permanente en la blockchain de Solana"
      >
        <ClienteForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Modal: Edit */}
      <Modal
        open={modalMode === "edit"}
        onClose={closeModal}
        title="Editar cliente"
        description="Modifica los datos del cliente seleccionado"
      >
        <ClienteForm
          defaultValues={selectedCliente ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      {/* Modal: Delete */}
      <Modal
        open={modalMode === "delete"}
        onClose={closeModal}
        title="Eliminar cliente"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Esta accion cerrara la cuenta PDA de{" "}
            <span className="font-semibold text-text-primary">
              {selectedCliente?.account.nombre}
            </span>{" "}
            en la blockchain y devolvera los lamports al firmante. Esta operacion
            es irreversible.
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
