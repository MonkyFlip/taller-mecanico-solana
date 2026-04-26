use anchor_lang::prelude::*;

/// Cuenta PDA global que actua como registro del taller.
/// Almacena el contador de clientes y la autoridad administradora.
///
/// Seeds: ["taller_state", authority.key()]
#[account]
#[derive(Default)]
pub struct TallerState {
    /// Billetera administradora del taller.
    pub authority: Pubkey,

    /// Contador total de clientes creados (sirve como seed para PDAs de clientes).
    pub cliente_count: u64,

    /// Bump del PDA derivado por el runtime.
    pub bump: u8,
}

impl TallerState {
    /// Espacio total: 8 + 32 + 8 + 1 = 49 bytes
    pub const SPACE: usize = 8 + 32 + 8 + 1;
}
