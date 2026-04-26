"use client";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FIELD_LIMITS } from "@/constants";
import { isValidVin } from "@/lib/utils";
import type { VehiculoFormValues, VehiculoWithPubkey } from "@/types";

interface VehiculoFormProps {
  defaultValues?: VehiculoWithPubkey;
  onSubmit: (data: VehiculoFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VehiculoForm: FC<VehiculoFormProps> = ({
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
  } = useForm<VehiculoFormValues>({
    defaultValues: defaultValues
      ? {
          marca: defaultValues.account.marca,
          modelo: defaultValues.account.modelo,
          anio: defaultValues.account.anio,
          placas: defaultValues.account.placas,
          vin: defaultValues.account.vin,
        }
      : {
          marca: "",
          modelo: "",
          anio: new Date().getFullYear(),
          placas: "",
          vin: "",
        },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        marca: defaultValues.account.marca,
        modelo: defaultValues.account.modelo,
        anio: defaultValues.account.anio,
        placas: defaultValues.account.placas,
        vin: defaultValues.account.vin,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Marca"
          placeholder="Toyota"
          error={errors.marca?.message}
          {...register("marca", {
            maxLength: {
              value: FIELD_LIMITS.MARCA_MAX,
              message: `Maximo ${FIELD_LIMITS.MARCA_MAX} caracteres`,
            },
          })}
        />

        <Input
          label="Modelo"
          placeholder="Corolla"
          error={errors.modelo?.message}
          {...register("modelo", {
            maxLength: {
              value: FIELD_LIMITS.MODELO_MAX,
              message: `Maximo ${FIELD_LIMITS.MODELO_MAX} caracteres`,
            },
          })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Anio"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          error={errors.anio?.message}
          {...register("anio", {
            valueAsNumber: true,
            min: { value: 1900, message: "Anio invalido" },
            max: {
              value: new Date().getFullYear() + 1,
              message: "Anio invalido",
            },
          })}
        />

        <Input
          label="Placas"
          placeholder="ABC-123"
          error={errors.placas?.message}
          {...register("placas", {
            maxLength: {
              value: FIELD_LIMITS.PLACAS_MAX,
              message: `Maximo ${FIELD_LIMITS.PLACAS_MAX} caracteres`,
            },
          })}
        />
      </div>

      <Input
        label="VIN (opcional)"
        placeholder="1HGBH41JXMN109186"
        hint="Numero de identificacion vehicular de 17 caracteres"
        error={errors.vin?.message}
        {...register("vin", {
          maxLength: {
            value: FIELD_LIMITS.VIN_MAX,
            message: `Maximo ${FIELD_LIMITS.VIN_MAX} caracteres`,
          },
          validate: (value) =>
            isValidVin(value) || "VIN invalido (debe ser 17 caracteres alfanumericos)",
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
          {defaultValues ? "Guardar cambios" : "Registrar vehiculo"}
        </Button>
      </div>
    </form>
  );
};

export default VehiculoForm;
