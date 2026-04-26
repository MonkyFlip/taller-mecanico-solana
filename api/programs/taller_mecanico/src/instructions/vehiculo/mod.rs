use anchor_lang::prelude::*;
use crate::errors::TallerError;
use crate::state::{Cliente, Vehiculo};

// ---------------------------------------------------------------------------
// Instruccion: create_vehiculo
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct CreateVehiculo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"cliente",
            authority.key().as_ref(),
            &cliente.id.to_le_bytes(),
        ],
        bump = cliente.bump,
        constraint = cliente.authority == authority.key() @ TallerError::NoAutorizado,
    )]
    pub cliente: Account<'info, Cliente>,

    #[account(
        init,
        payer = authority,
        space = Vehiculo::SPACE,
        seeds = [
            b"vehiculo",
            cliente.key().as_ref(),
            &cliente.vehiculo_count.to_le_bytes(),
        ],
        bump,
    )]
    pub vehiculo: Account<'info, Vehiculo>,

    pub system_program: Program<'info, System>,
}

pub fn create_vehiculo(
    ctx: Context<CreateVehiculo>,
    marca: String,
    modelo: String,
    anio: u16,
    placas: String,
    vin: String,
) -> Result<()> {
    require!(marca.len() <= Vehiculo::MARCA_MAX, TallerError::MarcaDemasiadoLarga);
    require!(modelo.len() <= Vehiculo::MODELO_MAX, TallerError::ModeloDemasiadoLargo);
    require!(placas.len() <= Vehiculo::PLACAS_MAX, TallerError::PlacasDemasiadoLargas);
    require!(vin.len() <= Vehiculo::VIN_MAX, TallerError::VinDemasiadoLargo);

    let cliente = &mut ctx.accounts.cliente;
    let vehiculo = &mut ctx.accounts.vehiculo;

    vehiculo.cliente_owner = cliente.key();
    vehiculo.id = cliente.vehiculo_count;
    vehiculo.marca = marca;
    vehiculo.modelo = modelo;
    vehiculo.anio = anio;
    vehiculo.placas = placas;
    vehiculo.vin = vin;
    vehiculo.servicio_count = 0;
    vehiculo.bump = ctx.bumps.vehiculo;

    cliente.vehiculo_count = cliente.vehiculo_count.saturating_add(1);

    Ok(())
}

// ---------------------------------------------------------------------------
// Instruccion: update_vehiculo
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct UpdateVehiculo<'info> {
    pub authority: Signer<'info>,

    #[account(
        seeds = [
            b"cliente",
            authority.key().as_ref(),
            &cliente.id.to_le_bytes(),
        ],
        bump = cliente.bump,
        constraint = cliente.authority == authority.key() @ TallerError::NoAutorizado,
    )]
    pub cliente: Account<'info, Cliente>,

    #[account(
        mut,
        seeds = [
            b"vehiculo",
            cliente.key().as_ref(),
            &vehiculo.id.to_le_bytes(),
        ],
        bump = vehiculo.bump,
        constraint = vehiculo.cliente_owner == cliente.key() @ TallerError::NoAutorizado,
    )]
    pub vehiculo: Account<'info, Vehiculo>,
}

pub fn update_vehiculo(
    ctx: Context<UpdateVehiculo>,
    marca: String,
    modelo: String,
    anio: u16,
    placas: String,
    vin: String,
) -> Result<()> {
    require!(marca.len() <= Vehiculo::MARCA_MAX, TallerError::MarcaDemasiadoLarga);
    require!(modelo.len() <= Vehiculo::MODELO_MAX, TallerError::ModeloDemasiadoLargo);
    require!(placas.len() <= Vehiculo::PLACAS_MAX, TallerError::PlacasDemasiadoLargas);
    require!(vin.len() <= Vehiculo::VIN_MAX, TallerError::VinDemasiadoLargo);

    let vehiculo = &mut ctx.accounts.vehiculo;
    vehiculo.marca = marca;
    vehiculo.modelo = modelo;
    vehiculo.anio = anio;
    vehiculo.placas = placas;
    vehiculo.vin = vin;

    Ok(())
}

// ---------------------------------------------------------------------------
// Instruccion: delete_vehiculo
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct DeleteVehiculo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [
            b"cliente",
            authority.key().as_ref(),
            &cliente.id.to_le_bytes(),
        ],
        bump = cliente.bump,
        constraint = cliente.authority == authority.key() @ TallerError::NoAutorizado,
    )]
    pub cliente: Account<'info, Cliente>,

    #[account(
        mut,
        seeds = [
            b"vehiculo",
            cliente.key().as_ref(),
            &vehiculo.id.to_le_bytes(),
        ],
        bump = vehiculo.bump,
        constraint = vehiculo.cliente_owner == cliente.key() @ TallerError::NoAutorizado,
        close = authority,
    )]
    pub vehiculo: Account<'info, Vehiculo>,
}

pub fn delete_vehiculo(_ctx: Context<DeleteVehiculo>) -> Result<()> {
    Ok(())
}
