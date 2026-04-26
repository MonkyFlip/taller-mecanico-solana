use anchor_lang::prelude::*;
use crate::errors::TallerError;
use crate::state::{Cliente, TallerState};

// ---------------------------------------------------------------------------
// Instruccion: create_cliente
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct CreateCliente<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"taller_state", authority.key().as_ref()],
        bump = taller_state.bump,
    )]
    pub taller_state: Account<'info, TallerState>,

    #[account(
        init,
        payer = authority,
        space = Cliente::SPACE,
        seeds = [
            b"cliente",
            authority.key().as_ref(),
            &taller_state.cliente_count.to_le_bytes(),
        ],
        bump,
    )]
    pub cliente: Account<'info, Cliente>,

    pub system_program: Program<'info, System>,
}

pub fn create_cliente(
    ctx: Context<CreateCliente>,
    nombre: String,
    telefono: String,
    correo: String,
    notas: String,
) -> Result<()> {
    require!(!nombre.is_empty(), TallerError::NombreVacio);
    require!(nombre.len() <= Cliente::NOMBRE_MAX, TallerError::NombreDemasiadoLargo);
    require!(telefono.len() <= Cliente::TELEFONO_MAX, TallerError::TelefonoDemasiadoLargo);
    require!(correo.len() <= Cliente::CORREO_MAX, TallerError::CorreoDemasiadoLargo);
    require!(notas.len() <= Cliente::NOTAS_MAX, TallerError::NotasDemasiadoLargas);

    let taller_state = &mut ctx.accounts.taller_state;
    let cliente = &mut ctx.accounts.cliente;

    cliente.authority = ctx.accounts.authority.key();
    cliente.id = taller_state.cliente_count;
    cliente.nombre = nombre;
    cliente.telefono = telefono;
    cliente.correo = correo;
    cliente.notas = notas;
    cliente.vehiculo_count = 0;
    cliente.bump = ctx.bumps.cliente;

    taller_state.cliente_count = taller_state.cliente_count.saturating_add(1);

    Ok(())
}

// ---------------------------------------------------------------------------
// Instruccion: update_cliente
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct UpdateCliente<'info> {
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
}

pub fn update_cliente(
    ctx: Context<UpdateCliente>,
    nombre: String,
    telefono: String,
    correo: String,
    notas: String,
) -> Result<()> {
    require!(!nombre.is_empty(), TallerError::NombreVacio);
    require!(nombre.len() <= Cliente::NOMBRE_MAX, TallerError::NombreDemasiadoLargo);
    require!(telefono.len() <= Cliente::TELEFONO_MAX, TallerError::TelefonoDemasiadoLargo);
    require!(correo.len() <= Cliente::CORREO_MAX, TallerError::CorreoDemasiadoLargo);
    require!(notas.len() <= Cliente::NOTAS_MAX, TallerError::NotasDemasiadoLargas);

    let cliente = &mut ctx.accounts.cliente;
    cliente.nombre = nombre;
    cliente.telefono = telefono;
    cliente.correo = correo;
    cliente.notas = notas;

    Ok(())
}

// ---------------------------------------------------------------------------
// Instruccion: delete_cliente
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct DeleteCliente<'info> {
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
        close = authority,
    )]
    pub cliente: Account<'info, Cliente>,
}

pub fn delete_cliente(_ctx: Context<DeleteCliente>) -> Result<()> {
    // El cierre de la cuenta y devolucion de lamports se maneja mediante
    // el atributo `close = authority` en la constraint.
    Ok(())
}
