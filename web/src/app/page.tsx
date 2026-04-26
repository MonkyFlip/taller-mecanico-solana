"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { Users, Car, Wrench, ArrowRight, AlertCircle } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { useTallerState } from "@/hooks/useTallerState";
import { useInitializeTaller } from "@/hooks/useClientes";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/Status";
import toast from "react-hot-toast";
import { parseAnchorError } from "@/lib/utils";

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const { data: tallerState, isLoading: loadingState } = useTallerState();
  const { data: clientes = [], isLoading: loadingClientes } = useClientes();
  const initMutation = useInitializeTaller();

  const handleInitialize = async () => {
    const toastId = toast.loading("Inicializando taller en la blockchain...");
    try {
      await initMutation.mutateAsync();
      toast.success("Taller inicializado correctamente", { id: toastId });
    } catch (err) {
      toast.error(parseAnchorError(err), { id: toastId });
    }
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-32">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-surface-2 mb-6">
            <Wrench size={28} className="text-accent" />
          </div>
          <h1 className="font-display text-4xl tracking-widest text-text-primary mb-3">
            TALLER MECANICO
          </h1>
          <p className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed">
            Sistema de gestion de clientes, vehiculos y servicios de mantenimiento
            registrado de forma inmutable sobre la blockchain de Solana.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <WalletMultiButton />
          <p className="text-xs text-text-muted">Conecta tu wallet de Devnet para continuar</p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mt-4">
          {[
            { icon: Users, label: "Clientes", desc: "Registro permanente on-chain" },
            { icon: Car, label: "Vehiculos", desc: "Vinculados a su propietario" },
            { icon: Wrench, label: "Servicios", desc: "Historial inmutable de mantenimiento" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-surface-2 p-4 text-center"
            >
              <Icon size={20} className="text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary">{label}</p>
              <p className="text-xs text-text-muted mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loadingState) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner label="Verificando estado del taller..." />
      </div>
    );
  }

  // Wallet conectada pero TallerState no inicializado
  if (!tallerState) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32">
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-6 max-w-md w-full text-center">
          <AlertCircle size={28} className="text-warning mx-auto mb-3" />
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Taller no inicializado
          </h2>
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            Debes crear tu cuenta de taller en la blockchain antes de registrar
            clientes. Esta operacion requiere una transaccion firmada.
          </p>
          <Button
            onClick={handleInitialize}
            loading={initMutation.isPending}
            className="w-full justify-center"
          >
            Inicializar taller en Devnet
          </Button>
        </div>
      </div>
    );
  }

  const totalVehiculos = clientes.reduce(
    (sum, c) => sum + c.account.vehiculoCount.toNumber(),
    0
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl tracking-widest text-text-primary">
          PANEL DE CONTROL
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Resumen del estado del taller en la red Devnet de Solana
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Clientes registrados",
            value: loadingClientes ? "-" : clientes.length,
            icon: Users,
            href: "/clientes",
          },
          {
            label: "Vehiculos totales",
            value: loadingClientes ? "-" : totalVehiculos,
            icon: Car,
            href: "/clientes",
          },
          {
            label: "Total de clientes creados",
            value: tallerState.clienteCount.toNumber(),
            icon: Wrench,
            href: null,
          },
        ].map(({ label, value, icon: Icon, href }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-surface-2 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
              <Icon size={15} className="text-text-muted" />
            </div>
            <p className="text-3xl font-display tracking-wider text-text-primary">
              {value}
            </p>
            {href && (
              <Link
                href={href}
                className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
              >
                Ver detalle <ArrowRight size={11} />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="rounded-lg border border-border bg-surface-2 p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-1">
          Acciones rapidas
        </h2>
        <p className="text-xs text-text-muted mb-4">
          Navega rapidamente a las secciones principales del sistema
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/clientes">
            <Button variant="secondary" icon={<Users size={14} />}>
              Gestionar clientes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
