use anchor_lang::prelude::*;

/// Cuenta PDA que representa a un cliente del taller.
///
/// Seeds: ["cliente", authority.key(), id.to_le_bytes()]
/// Capacidad maxima de campos de texto: ver constantes en impl.
#[account]
#[derive(Default)]
pub struct Cliente {
    /// Billetera que creo y controla este cliente.
    pub authority: Pubkey,

    /// Identificador unico incremental dentro del taller state.
    pub id: u64,

    /// Nombre completo del cliente.
    pub nombre: String,

    /// Numero de telefono de contacto.
    pub telefono: String,

    /// Correo electronico del cliente.
    pub correo: String,

    /// Notas internas sobre el cliente.
    pub notas: String,

    /// Contador de vehiculos registrados bajo este cliente.
    pub vehiculo_count: u64,

    /// Bump del PDA derivado por el runtime.
    pub bump: u8,
}

impl Cliente {
    pub const NOMBRE_MAX: usize = 64;
    pub const TELEFONO_MAX: usize = 20;
    pub const CORREO_MAX: usize = 64;
    pub const NOTAS_MAX: usize = 256;

    /// Espacio total requerido para la cuenta.
    /// Discriminador (8) + Pubkey (32) + u64 (8) + strings con prefijos de longitud (4 bytes cada uno)
    /// + u64 (8) + u8 (1) = 8+32+8+4+64+4+20+4+64+4+256+8+1 = 477 bytes
    pub const SPACE: usize = 8
        + 32  // authority
        + 8   // id
        + (4 + Self::NOMBRE_MAX)
        + (4 + Self::TELEFONO_MAX)
        + (4 + Self::CORREO_MAX)
        + (4 + Self::NOTAS_MAX)
        + 8   // vehiculo_count
        + 1;  // bump
}
