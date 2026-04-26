"use client";

import { FC } from "react";
import Link from "next/link";
import { Car, ChevronRight, Pencil, Trash2, Hash, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Status";
import { truncatePubkey } from "@/lib/utils";
import type { VehiculoWithPubkey } from "@/types";

interface VehiculoCardProps {
  vehiculo: VehiculoWithPubkey;
  clientePubkey: string;
  onEdit: (vehiculo: VehiculoWithPubkey) => void;
  onDelete: (vehiculo: VehiculoWithPubkey) => void;
}

const VehiculoCard: FC<VehiculoCardProps> = ({
  vehiculo,
  clientePubkey,
  onEdit,
  onDelete,
}) => {
  const { account, pubkey } = vehiculo;
  const servicioCount = account.servicioCount.toNumber();

  return (
    <div className="group rounded-lg border border-border bg-surface-2 p-4 transition-colors hover:border-border-strong hover:bg-surface-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-surface-4 border border-border">
            <Car size={16} className="text-text-secondary" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-text-primary">
              {account.marca} {account.modelo}
            </h3>
            <p className="font-mono text-xs text-text-muted">
              {truncatePubkey(pubkey)}
            </p>
          </div>
        </div>

        <Badge variant={servicioCount > 0 ? "success" : "default"}>
          {servicioCount} {servicioCount === 1 ? "servicio" : "servicios"}
        </Badge>
      </div>

      {/* Info */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Calendar size={11} className="text-text-muted" />
          {account.anio}
        </div>
        {account.placas && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Hash size={11} className="text-text-muted" />
            {account.placas}
          </div>
        )}
        {account.vin && (
          <div className="col-span-3 flex items-center gap-1.5 text-xs text-text-muted font-mono">
            VIN: {account.vin}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <Link
          href={`/vehiculos/${pubkey.toString()}?cliente=${clientePubkey}`}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Ver servicios
          <ChevronRight size={12} />
        </Link>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil size={13} />}
            onClick={() => onEdit(vehiculo)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={() => onDelete(vehiculo)}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehiculoCard;
