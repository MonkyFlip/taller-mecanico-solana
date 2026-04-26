"use client";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FIELD_LIMITS } from "@/constants";
import type { ClienteFormValues, ClienteWithPubkey } from "@/types";

interface ClienteFormProps {
  defaultValues?: ClienteWithPubkey;
  onSubmit: (data: ClienteFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClienteForm: FC<ClienteFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    defaultValues: defaultValues
      ? {
          nombre: defaultValues.account.nombre,
          telefono: defaultValues.account.telefono,
          correo: defaultValues.account.correo,
          notas: defaultValues.account.notas,
        }
      : {
          nombre: "",
          telefono: "",
          correo: "",
          notas: "",
        },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        nombre: defaultValues.account.nombre,
        telefono: defaultValues.account.telefono,
        correo: defaultValues.account.correo,
        notas: defaultValues.account.notas,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nombre completo"
        placeholder="Juan Perez Garcia"
        error={errors.nombre?.message}
        {...register("nombre", {
          required: "El nombre es requerido",
          maxLength: {
            value: FIELD_LIMITS.NOMBRE_MAX,
            message: `Maximo ${FIELD_LIMITS.NOMBRE_MAX} caracteres`,
          },
        })}
      />

      <Input
        label="Telefono"
        placeholder="+52 555 123 4567"
        error={errors.telefono?.message}
        {...register("telefono", {
          maxLength: {
            value: FIELD_LIMITS.TELEFONO_MAX,
            message: `Maximo ${FIELD_LIMITS.TELEFONO_MAX} caracteres`,
          },
        })}
      />

      <Input
        label="Correo electronico"
        type="email"
        placeholder="cliente@ejemplo.com"
        error={errors.correo?.message}
        {...register("correo", {
          maxLength: {
            value: FIELD_LIMITS.CORREO_MAX,
            message: `Maximo ${FIELD_LIMITS.CORREO_MAX} caracteres`,
          },
        })}
      />

      <Textarea
        label="Notas"
        placeholder="Observaciones internas del cliente..."
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
          {defaultValues ? "Guardar cambios" : "Registrar cliente"}
        </Button>
      </div>
    </form>
  );
};

export default ClienteForm;
