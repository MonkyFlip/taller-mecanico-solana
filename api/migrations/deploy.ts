import * as anchor from "@coral-xyz/anchor";

// Script de despliegue de migracion para Anchor.
// Este modulo es invocado automaticamente por `anchor migrate` o `anchor deploy`.
module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);

  // El programa se despliega automaticamente por Anchor.
  // Aqui puedes agregar logica de inicializacion post-deploy si es necesario.
  console.log("Despliegue completado para taller_mecanico");
  console.log("Program ID:", provider.connection.rpcEndpoint);
};
