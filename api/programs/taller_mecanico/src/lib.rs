use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::TallerState;

// Reemplaza este ID con el generado tras ejecutar `anchor build` y
// verificar con `solana address -k target/deploy/taller_mecanico-keypair.json`
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod taller_mecanico {
    use super::*;

    // -----------------------------------------------------------------------
    // TallerState - inicializacion del registro global
    // -----------------------------------------------------------------------

    /// Inicializa el TallerState para la autoridad firmante.
    /// Debe llamarse una sola vez por wallet antes de registrar clientes.
    pub fn initialize_taller(ctx: Context<InitializeTaller>) -> Result<()> {
        let state = &mut ctx.accounts.taller_state;
        state.authority = ctx.accounts.authority.key();
        state.cliente_count = 0;
        state.bump = ctx.bumps.taller_state;
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Clientes
    // -----------------------------------------------------------------------

    pub fn create_cliente(
        ctx: Context<CreateCliente>,
        nombre: String,
        telefono: String,
        correo: String,
        notas: String,
    ) -> Result<()> {
        instructions::cliente::create_cliente(ctx, nombre, telefono, correo, notas)
    }

    pub fn update_cliente(
        ctx: Context<UpdateCliente>,
        nombre: String,
        telefono: String,
        correo: String,
        notas: String,
    ) -> Result<()> {
        instructions::cliente::update_cliente(ctx, nombre, telefono, correo, notas)
    }

    pub fn delete_cliente(ctx: Context<DeleteCliente>) -> Result<()> {
        instructions::cliente::delete_cliente(ctx)
    }

    // -----------------------------------------------------------------------
    // Vehiculos
    // -----------------------------------------------------------------------

    pub fn create_vehiculo(
        ctx: Context<CreateVehiculo>,
        marca: String,
        modelo: String,
        anio: u16,
        placas: String,
        vin: String,
    ) -> Result<()> {
        instructions::vehiculo::create_vehiculo(ctx, marca, modelo, anio, placas, vin)
    }

    pub fn update_vehiculo(
        ctx: Context<UpdateVehiculo>,
        marca: String,
        modelo: String,
        anio: u16,
        placas: String,
        vin: String,
    ) -> Result<()> {
        instructions::vehiculo::update_vehiculo(ctx, marca, modelo, anio, placas, vin)
    }

    pub fn delete_vehiculo(ctx: Context<DeleteVehiculo>) -> Result<()> {
        instructions::vehiculo::delete_vehiculo(ctx)
    }

    // -----------------------------------------------------------------------
    // Servicios
    // -----------------------------------------------------------------------

    pub fn create_servicio(
        ctx: Context<CreateServicio>,
        tipo_servicio: String,
        costo: u64,
        fecha: i64,
        notas: String,
    ) -> Result<()> {
        instructions::servicio::create_servicio(ctx, tipo_servicio, costo, fecha, notas)
    }

    pub fn update_servicio(
        ctx: Context<UpdateServicio>,
        tipo_servicio: String,
        costo: u64,
        fecha: i64,
        notas: String,
    ) -> Result<()> {
        instructions::servicio::update_servicio(ctx, tipo_servicio, costo, fecha, notas)
    }

    pub fn delete_servicio(ctx: Context<DeleteServicio>) -> Result<()> {
        instructions::servicio::delete_servicio(ctx)
    }
}

// ---------------------------------------------------------------------------
// Contexto de inicializacion del TallerState
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct InitializeTaller<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = TallerState::SPACE,
        seeds = [b"taller_state", authority.key().as_ref()],
        bump,
    )]
    pub taller_state: Account<'info, TallerState>,

    pub system_program: Program<'info, System>,
}
