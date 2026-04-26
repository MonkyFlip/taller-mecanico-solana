use anchor_lang::prelude::*;

/// Cuenta PDA que representa un servicio de mantenimiento aplicado a un vehiculo.
///
/// Seeds: ["servicio", vehiculo.key(), id.to_le_bytes()]
#[account]
#[derive(Default)]
pub struct Servicio {
    /// PDA del vehiculo sobre el que se realizo el servicio.
    pub vehiculo_owner: Pubkey,

    /// Identificador unico incremental dentro del vehiculo.
    pub id: u64,

    /// Tipo o descripcion del servicio realizado.
    pub tipo_servicio: String,

    /// Costo del servicio en centavos (u64 para precision sin flotantes).
    pub costo: u64,

    /// Fecha del servicio en formato UNIX timestamp (segundos).
    pub fecha: i64,

    /// Notas adicionales sobre el servicio.
    pub notas: String,

    /// Bump del PDA derivado por el runtime.
    pub bump: u8,
}

impl Servicio {
    pub const TIPO_SERVICIO_MAX: usize = 128;
    pub const NOTAS_MAX: usize = 256;

    /// Espacio total: 8+32+8+4+128+8+8+4+256+1 = 457 bytes
    pub const SPACE: usize = 8
        + 32  // vehiculo_owner
        + 8   // id
        + (4 + Self::TIPO_SERVICIO_MAX)
        + 8   // costo
        + 8   // fecha
        + (4 + Self::NOTAS_MAX)
        + 1;  // bump
}
