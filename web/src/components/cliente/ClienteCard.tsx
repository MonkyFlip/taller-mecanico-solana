"use client";

import { FC } from "react";
import Link from "next/link";
import { Phone, Mail, Car, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Status";
import { truncatePubkey } from "@/lib/utils";
import type { ClienteWithPubkey } from "@/types";

interface ClienteCardProps {
  cliente: ClienteWithPubkey;
  onEdit: (cliente: ClienteWithPubkey) => void;
  onDelete: (cliente: ClienteWithPubkey) => void;
}

const ClienteCard: FC<ClienteCardProps> = ({ cliente, onEdit, onDelete }) => {
  const { account, pubkey } = cliente;
  const vehiculoCount = account.vehiculoCount.toNumber();

  return (
    <div className="group rounded-lg border border-border bg-surface-2 p-4 transition-colors hover:border-border-strong hover:bg-surface-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-accent/10 border border-accent/20 text-accent font-display text-lg">
            {account.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-text-primary">
              {account.nombre}
            </h3>
            <p className="font-mono text-xs text-text-muted">
              {truncatePubkey(pubkey)}
            </p>
          </div>
        </div>

        <Badge variant={vehiculoCount > 0 ? "accent" : "default"}>
          {vehiculoCount} {vehiculoCount === 1 ? "vehiculo" : "vehiculos"}
        </Badge>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1.5">
        {account.telefono && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Phone size={12} className="shrink-0 text-text-muted" />
            <span className="truncate">{account.telefono}</span>
          </div>
        )}
        {account.correo && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Mail size={12} className="shrink-0 text-text-muted" />
            <span className="truncate">{account.correo}</span>
          </div>
        )}
        {account.notas && (
          <p className="mt-1 truncate text-xs text-text-muted italic">
            {account.notas}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <Link
          href={`/clientes/${pubkey.toString()}`}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
        >
          <Car size={13} />
          Ver vehiculos
          <ChevronRight size={12} />
        </Link>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil size={13} />}
            onClick={() => onEdit(cliente)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={() => onDelete(cliente)}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClienteCard;
