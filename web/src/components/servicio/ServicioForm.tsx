"use client";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FIELD_LIMITS } from "@/constants";
import { formatFechaInput } from "@/lib/utils";
import type { ServicioFormValues, ServicioWithPubkey } from "@/types";

interface ServicioFormProps {
  defaultValues?: ServicioWithPubkey;
  onSubmit: (data: ServicioFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ServicioForm: FC<ServicioFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const todayIso = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicioFormValues>({
    defaultValues: defaultValues
      ? {
          tipoServicio: defaultValues.account.tipoServicio,
          costo: (defaultValues.account.costo.toNumber() / 100).toFixed(2),
          fecha: formatFechaInput(defaultValues.account.fecha),
          notas: defaultValues.account.notas,
        }
      : {
          tipoServicio: "",
          costo: "",
          fecha: todayIso,
          notas: "",
        },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        tipoServicio: defaultValues.account.tipoServicio,
        costo: (defaultValues.account.costo.toNumber() / 100).toFixed(2),
        fecha: formatFechaInput(defaultValues.account.fecha),
        notas: defaultValues.account.notas,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Tipo de servicio"
        placeholder="Cambio de aceite 5W-30 + filtros"
        error={errors.tipoServicio?.message}
        {...register("tipoServicio", {
          required: "El tipo de servicio es requerido",
          maxLength: {
            value: FIELD_LIMITS.TIPO_SERVICIO_MAX,
            message: `Maximo ${FIELD_LIMITS.TIPO_SERVICIO_MAX} caracteres`,
          },
        })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Costo (MXN)"
          type="number"
          step="0.01"
          min="0"
          placeholder="850.00"
          hint="Monto en pesos mexicanos"
          error={errors.costo?.message}
          {...register("costo", {
            required: "El costo es requerido",
            min: { value: 0, message: "El costo no puede ser negativo" },
          })}
        />

        <Input
          label="Fecha del servicio"
          type="date"
          error={errors.fecha?.message}
          {...register("fecha", {
            required: "La fecha es requerida",
          })}
        />
      </div>

      <Textarea
        label="Notas del servicio"
        placeholder="Detalles adicionales del servicio realizado..."
        error={errors.notas?.message}
        {...register("notas", {
          maxLength: {
            value: FIELD_LIMITS.NOTAS_MAX,
            message: `Maximo ${FIELD_LIMITS.NOTAS_MAX} caracteres`,
          },
        })}
      />

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {defaultValues ? "Guardar cambios" : "Registrar servicio"}
        </Button>
      </div>
    </form>
  );
};

export default ServicioForm;
