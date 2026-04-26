use anchor_lang::prelude::*;

#[error_code]
pub enum TallerError {
    #[msg("El nombre no puede estar vacio")]
    NombreVacio,

    #[msg("El nombre supera la longitud maxima permitida (64 caracteres)")]
    NombreDemasiadoLargo,

    #[msg("El telefono supera la longitud maxima permitida (20 caracteres)")]
    TelefonoDemasiadoLargo,

    #[msg("El correo supera la longitud maxima permitida (64 caracteres)")]
    CorreoDemasiadoLargo,

    #[msg("Las notas superan la longitud maxima permitida (256 caracteres)")]
    NotasDemasiadoLargas,

    #[msg("La marca supera la longitud maxima permitida (32 caracteres)")]
    MarcaDemasiadoLarga,

    #[msg("El modelo supera la longitud maxima permitida (48 caracteres)")]
    ModeloDemasiadoLargo,

    #[msg("Las placas superan la longitud maxima permitida (12 caracteres)")]
    PlacasDemasiadoLargas,

    #[msg("El VIN supera la longitud maxima permitida (17 caracteres)")]
    VinDemasiadoLargo,

    #[msg("El tipo de servicio no puede estar vacio")]
    TipoServicioVacio,

    #[msg("El tipo de servicio supera la longitud maxima permitida (128 caracteres)")]
    TipoServicioDemasiadoLargo,

    #[msg("Solo la autoridad que creo el registro puede modificarlo")]
    NoAutorizado,
}
