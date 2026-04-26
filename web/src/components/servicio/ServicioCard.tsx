"use client";

import { FC } from "react";
import { Calendar, DollarSign, Pencil, Trash2, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCosto, formatFecha, truncatePubkey } from "@/lib/utils";
import type { ServicioWithPubkey } from "@/types";

interface ServicioCardProps {
  servicio: ServicioWithPubkey;
  onEdit: (servicio: ServicioWithPubkey) => void;
  onDelete: (servicio: ServicioWithPubkey) => void;
}

const ServicioCard: FC<ServicioCardProps> = ({ servicio, onEdit, onDelete }) => {
  const { account, pubkey } = servicio;

  return (
    <div className="group rounded-lg border border-border bg-surface-2 transition-colors hover:border-border-strong hover:bg-surface-3">
      {/* Top bar with accent */}
      <div className="h-0.5 w-full rounded-t-lg bg-gradient-to-r from-accent/60 to-transparent" />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-accent/10 border border-accent/20">
              <FileText size={15} className="text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary leading-tight">
                {account.tipoServicio}
              </h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">
                {truncatePubkey(pubkey)}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-base font-bold text-text-primary font-mono">
              {formatCosto(account.costo)}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Calendar size={11} className="text-text-muted" />
            {formatFecha(account.fecha)}
          </div>
        </div>

        {/* Notas */}
        {account.notas && (
          <p className="mt-2 text-xs text-text-muted italic leading-relaxed border-l-2 border-border pl-2">
            {account.notas}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-1 border-t border-border-subtle pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil size={13} />}
            onClick={() => onEdit(servicio)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={() => onDelete(servicio)}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicioCard;
