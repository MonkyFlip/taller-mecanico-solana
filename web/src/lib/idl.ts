// Este archivo define el IDL del programa taller_mecanico.
// Generado manualmente para reflejar el programa Anchor en Rust.
// Despues de `anchor build`, el IDL real estara en target/idl/taller_mecanico.json

export type TallerMecanico = {
  version: "0.1.0";
  name: "taller_mecanico";
  instructions: [
    {
      name: "initializeTaller";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "tallerState"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [];
    },
    {
      name: "createCliente";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "tallerState"; isMut: true; isSigner: false },
        { name: "cliente"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "nombre"; type: "string" },
        { name: "telefono"; type: "string" },
        { name: "correo"; type: "string" },
        { name: "notas"; type: "string" }
      ];
    },
    {
      name: "updateCliente";
      accounts: [
        { name: "authority"; isMut: false; isSigner: true },
        { name: "cliente"; isMut: true; isSigner: false }
      ];
      args: [
        { name: "nombre"; type: "string" },
        { name: "telefono"; type: "string" },
        { name: "correo"; type: "string" },
        { name: "notas"; type: "string" }
      ];
    },
    {
      name: "deleteCliente";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "cliente"; isMut: true; isSigner: false }
      ];
      args: [];
    },
    {
      name: "createVehiculo";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "cliente"; isMut: true; isSigner: false },
        { name: "vehiculo"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "marca"; type: "string" },
        { name: "modelo"; type: "string" },
        { name: "anio"; type: "u16" },
        { name: "placas"; type: "string" },
        { name: "vin"; type: "string" }
      ];
    },
    {
      name: "updateVehiculo";
      accounts: [
        { name: "authority"; isMut: false; isSigner: true },
        { name: "cliente"; isMut: false; isSigner: false },
        { name: "vehiculo"; isMut: true; isSigner: false }
      ];
      args: [
        { name: "marca"; type: "string" },
        { name: "modelo"; type: "string" },
        { name: "anio"; type: "u16" },
        { name: "placas"; type: "string" },
        { name: "vin"; type: "string" }
      ];
    },
    {
      name: "deleteVehiculo";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "cliente"; isMut: false; isSigner: false },
        { name: "vehiculo"; isMut: true; isSigner: false }
      ];
      args: [];
    },
    {
      name: "createServicio";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "cliente"; isMut: false; isSigner: false },
        { name: "vehiculo"; isMut: true; isSigner: false },
        { name: "servicio"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "tipoServicio"; type: "string" },
        { name: "costo"; type: "u64" },
        { name: "fecha"; type: "i64" },
        { name: "notas"; type: "string" }
      ];
    },
    {
      name: "updateServicio";
      accounts: [
        { name: "authority"; isMut: false; isSigner: true },
        { name: "cliente"; isMut: false; isSigner: false },
        { name: "vehiculo"; isMut: false; isSigner: false },
        { name: "servicio"; isMut: true; isSigner: false }
      ];
      args: [
        { name: "tipoServicio"; type: "string" },
        { name: "costo"; type: "u64" },
        { name: "fecha"; type: "i64" },
        { name: "notas"; type: "string" }
      ];
    },
    {
      name: "deleteServicio";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "cliente"; isMut: false; isSigner: false },
        { name: "vehiculo"; isMut: false; isSigner: false },
        { name: "servicio"; isMut: true; isSigner: false }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "tallerState";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "clienteCount"; type: "u64" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "cliente";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "id"; type: "u64" },
          { name: "nombre"; type: "string" },
          { name: "telefono"; type: "string" },
          { name: "correo"; type: "string" },
          { name: "notas"; type: "string" },
          { name: "vehiculoCount"; type: "u64" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "vehiculo";
      type: {
        kind: "struct";
        fields: [
          { name: "clienteOwner"; type: "publicKey" },
          { name: "id"; type: "u64" },
          { name: "marca"; type: "string" },
          { name: "modelo"; type: "string" },
          { name: "anio"; type: "u16" },
          { name: "placas"; type: "string" },
          { name: "vin"; type: "string" },
          { name: "servicioCount"; type: "u64" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "servicio";
      type: {
        kind: "struct";
        fields: [
          { name: "vehiculoOwner"; type: "publicKey" },
          { name: "id"; type: "u64" },
          { name: "tipoServicio"; type: "string" },
          { name: "costo"; type: "u64" },
          { name: "fecha"; type: "i64" },
          { name: "notas"; type: "string" },
          { name: "bump"; type: "u8" }
        ];
      };
    }
  ];
  errors: [
    { code: 6000; name: "NombreVacio"; msg: "El nombre no puede estar vacio" },
    { code: 6001; name: "NombreDemasiadoLargo"; msg: "El nombre supera la longitud maxima" },
    { code: 6002; name: "TelefonoDemasiadoLargo"; msg: "El telefono supera la longitud maxima" },
    { code: 6003; name: "CorreoDemasiadoLargo"; msg: "El correo supera la longitud maxima" },
    { code: 6004; name: "NotasDemasiadoLargas"; msg: "Las notas superan la longitud maxima" },
    { code: 6005; name: "MarcaDemasiadoLarga"; msg: "La marca supera la longitud maxima" },
    { code: 6006; name: "ModeloDemasiadoLargo"; msg: "El modelo supera la longitud maxima" },
    { code: 6007; name: "PlacasDemasiadoLargas"; msg: "Las placas superan la longitud maxima" },
    { code: 6008; name: "VinDemasiadoLargo"; msg: "El VIN supera la longitud maxima" },
    { code: 6009; name: "TipoServicioVacio"; msg: "El tipo de servicio no puede estar vacio" },
    { code: 6010; name: "TipoServicioDemasiadoLargo"; msg: "El tipo de servicio supera la longitud maxima" },
    { code: 6011; name: "NoAutorizado"; msg: "Solo la autoridad puede modificar este registro" }
  ];
};
