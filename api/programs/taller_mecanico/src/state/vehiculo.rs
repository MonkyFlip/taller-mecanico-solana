use anchor_lang::prelude::*;

/// Cuenta PDA que representa un vehiculo asociado a un cliente.
///
/// Seeds: ["vehiculo", cliente.key(), id.to_le_bytes()]
#[account]
#[derive(Default)]
pub struct Vehiculo {
    /// PDA del cliente propietario del vehiculo.
    pub cliente_owner: Pubkey,

    /// Identificador unico incremental dentro del cliente.
    pub id: u64,

    /// Marca del vehiculo (e.g. "Toyota", "Ford").
    pub marca: String,

    /// Modelo del vehiculo (e.g. "Corolla", "F-150").
    pub modelo: String,

    /// Anio de fabricacion del vehiculo.
    pub anio: u16,

    /// Numero de placas del vehiculo.
    pub placas: String,

    /// Numero de identificacion del vehiculo (VIN).
    pub vin: String,

    /// Contador de servicios registrados bajo este vehiculo.
    pub servicio_count: u64,

    /// Bump del PDA derivado por el runtime.
    pub bump: u8,
}

impl Vehiculo {
    pub const MARCA_MAX: usize = 32;
    pub const MODELO_MAX: usize = 48;
    pub const PLACAS_MAX: usize = 12;
    pub const VIN_MAX: usize = 17;

    /// Espacio total: 8+32+8+4+32+4+48+2+4+12+4+17+8+1 = 184 bytes
    pub const SPACE: usize = 8
        + 32  // cliente_owner
        + 8   // id
        + (4 + Self::MARCA_MAX)
        + (4 + Self::MODELO_MAX)
        + 2   // anio
        + (4 + Self::PLACAS_MAX)
        + (4 + Self::VIN_MAX)
        + 8   // servicio_count
        + 1;  // bump
}
