use anchor_lang::prelude::*;
use crate::errors::TallerError;
use crate::state::{Cliente, Vehiculo, Servicio};

// ---------------------------------------------------------------------------
// Instruccion: create_servicio
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct CreateServicio<'info> {
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
    )]
    pub vehiculo: Account<'info, Vehiculo>,

    #[account(
        init,
        payer = authority,
        space = Servicio::SPACE,
        seeds = [
            b"servicio",
            vehiculo.key().as_ref(),
            &vehiculo.servicio_count.to_le_bytes(),
        ],
        bump,
    )]
    pub servicio: Account<'info, Servicio>,

    pub system_program: Program<'info, System>,
}

pub fn create_servicio(
    ctx: Context<CreateServicio>,
    tipo_servicio: String,
    costo: u64,
    fecha: i64,
    notas: String,
) -> Result<()> {
    require!(!tipo_servicio.is_empty(), TallerError::TipoServicioVacio);
    require!(
        tipo_servicio.len() <= Servicio::TIPO_SERVICIO_MAX,
        TallerError::TipoServicioDemasiadoLargo
    );
    require!(notas.len() <= Servicio::NOTAS_MAX, TallerError::NotasDemasiadoLargas);

    let vehiculo = &mut ctx.accounts.vehiculo;
    let servicio = &mut ctx.accounts.servicio;

    servicio.vehiculo_owner = vehiculo.key();
    servicio.id = vehiculo.servicio_count;
    servicio.tipo_servicio = tipo_servicio;
    servicio.costo = costo;
    servicio.fecha = fecha;
    servicio.notas = notas;
    servicio.bump = ctx.bumps.servicio;

    vehiculo.servicio_count = vehiculo.servicio_count.saturating_add(1);

    Ok(())
}

// ---------------------------------------------------------------------------
// Instruccion: update_servicio
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct UpdateServicio<'info> {
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
        seeds = [
            b"vehiculo",
            cliente.key().as_ref(),
            &vehiculo.id.to_le_bytes(),
        ],
        bump = vehiculo.bump,
        constraint = vehiculo.cliente_owner == cliente.key() @ TallerError::NoAutorizado,
    )]
    pub vehiculo: Account<'info, Vehiculo>,

    #[account(
        mut,
        seeds = [
            b"servicio",
            vehiculo.key().as_ref(),
            &servicio.id.to_le_bytes(),
        ],
        bump = servicio.bump,
        constraint = servicio.vehiculo_owner == vehiculo.key() @ TallerError::NoAutorizado,
    )]
    pub servicio: Account<'info, Servicio>,
}

pub fn update_servicio(
    ctx: Context<UpdateServicio>,
    tipo_servicio: String,
    costo: u64,
    fecha: i64,
    notas: String,
) -> Result<()> {
    require!(!tipo_servicio.is_empty(), TallerError::TipoServicioVacio);
    require!(
        tipo_servicio.len() <= Servicio::TIPO_SERVICIO_MAX,
        TallerError::TipoServicioDemasiadoLargo
    );
    require!(notas.len() <= Servicio::NOTAS_MAX, TallerError::NotasDemasiadoLargas);

    let servicio = &mut ctx.accounts.servicio;
    servicio.tipo_servicio = tipo_servicio;
    servicio.costo = costo;
    servicio.fecha = fecha;
    servicio.notas = notas;

    Ok(())
}

// ---------------------------------------------------------------------------
// Instruccion: delete_servicio
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct DeleteServicio<'info> {
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
        seeds = [
            b"vehiculo",
            cliente.key().as_ref(),
            &vehiculo.id.to_le_bytes(),
        ],
        bump = vehiculo.bump,
        constraint = vehiculo.cliente_owner == cliente.key() @ TallerError::NoAutorizado,
    )]
    pub vehiculo: Account<'info, Vehiculo>,

    #[account(
        mut,
        seeds = [
            b"servicio",
            vehiculo.key().as_ref(),
            &servicio.id.to_le_bytes(),
        ],
        bump = servicio.bump,
        constraint = servicio.vehiculo_owner == vehiculo.key() @ TallerError::NoAutorizado,
        close = authority,
    )]
    pub servicio: Account<'info, Servicio>,
}

pub fn delete_servicio(_ctx: Context<DeleteServicio>) -> Result<()> {
    Ok(())
}
