import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TallerMecanico } from "../target/types/taller_mecanico";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("taller_mecanico", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TallerMecanico as Program<TallerMecanico>;
  const authority = provider.wallet as anchor.Wallet;

  // PDAs derivadas durante las pruebas
  let tallerStatePda: PublicKey;
  let clientePda: PublicKey;
  let vehiculoPda: PublicKey;
  let servicioPda: PublicKey;

  // ---------------------------------------------------------------------------
  // Helpers de derivacion de PDAs
  // ---------------------------------------------------------------------------

  async function deriveTallerState(auth: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("taller_state"), auth.toBuffer()],
      program.programId
    );
  }

  async function deriveCliente(
    auth: PublicKey,
    clienteCount: anchor.BN
  ): Promise<[PublicKey, number]> {
    const idBytes = Buffer.alloc(8);
    clienteCount.toArrayLike(Buffer, "le", 8).copy(idBytes);
    return PublicKey.findProgramAddressSync(
      [Buffer.from("cliente"), auth.toBuffer(), idBytes],
      program.programId
    );
  }

  async function deriveVehiculo(
    clientePubkey: PublicKey,
    vehiculoCount: anchor.BN
  ): Promise<[PublicKey, number]> {
    const idBytes = Buffer.alloc(8);
    vehiculoCount.toArrayLike(Buffer, "le", 8).copy(idBytes);
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vehiculo"), clientePubkey.toBuffer(), idBytes],
      program.programId
    );
  }

  async function deriveServicio(
    vehiculoPubkey: PublicKey,
    servicioCount: anchor.BN
  ): Promise<[PublicKey, number]> {
    const idBytes = Buffer.alloc(8);
    servicioCount.toArrayLike(Buffer, "le", 8).copy(idBytes);
    return PublicKey.findProgramAddressSync(
      [Buffer.from("servicio"), vehiculoPubkey.toBuffer(), idBytes],
      program.programId
    );
  }

  // ---------------------------------------------------------------------------
  // Suite: TallerState
  // ---------------------------------------------------------------------------

  describe("initialize_taller", () => {
    it("inicializa el TallerState correctamente", async () => {
      [tallerStatePda] = await deriveTallerState(authority.publicKey);

      await program.methods
        .initializeTaller()
        .accounts({
          authority: authority.publicKey,
          tallerState: tallerStatePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const state = await program.account.tallerState.fetch(tallerStatePda);
      assert.ok(state.authority.equals(authority.publicKey));
      assert.equal(state.clienteCount.toNumber(), 0);
    });
  });

  // ---------------------------------------------------------------------------
  // Suite: Clientes
  // ---------------------------------------------------------------------------

  describe("clientes", () => {
    it("crea un cliente correctamente", async () => {
      const state = await program.account.tallerState.fetch(tallerStatePda);
      [clientePda] = await deriveCliente(authority.publicKey, state.clienteCount);

      await program.methods
        .createCliente(
          "Juan Perez Garcia",
          "+52 555 123 4567",
          "juan.perez@ejemplo.com",
          "Cliente preferencial, pago puntual"
        )
        .accounts({
          authority: authority.publicKey,
          tallerState: tallerStatePda,
          cliente: clientePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const cliente = await program.account.cliente.fetch(clientePda);
      assert.equal(cliente.nombre, "Juan Perez Garcia");
      assert.equal(cliente.telefono, "+52 555 123 4567");
      assert.equal(cliente.correo, "juan.perez@ejemplo.com");
      assert.equal(cliente.vehiculoCount.toNumber(), 0);
      assert.ok(cliente.authority.equals(authority.publicKey));
    });

    it("actualiza un cliente correctamente", async () => {
      await program.methods
        .updateCliente(
          "Juan Perez Garcia (actualizado)",
          "+52 555 999 8888",
          "j.perez.nuevo@ejemplo.com",
          "Datos actualizados en segunda visita"
        )
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
        })
        .rpc();

      const cliente = await program.account.cliente.fetch(clientePda);
      assert.equal(cliente.nombre, "Juan Perez Garcia (actualizado)");
    });

    it("rechaza nombre vacio", async () => {
      const state = await program.account.tallerState.fetch(tallerStatePda);
      const [nuevoPda] = await deriveCliente(authority.publicKey, state.clienteCount);

      try {
        await program.methods
          .createCliente("", "+52 555 000 0000", "x@x.com", "")
          .accounts({
            authority: authority.publicKey,
            tallerState: tallerStatePda,
            cliente: nuevoPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        assert.fail("Debia rechazar nombre vacio");
      } catch (err: any) {
        assert.include(err.message, "NombreVacio");
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Suite: Vehiculos
  // ---------------------------------------------------------------------------

  describe("vehiculos", () => {
    it("crea un vehiculo correctamente", async () => {
      const cliente = await program.account.cliente.fetch(clientePda);
      [vehiculoPda] = await deriveVehiculo(clientePda, cliente.vehiculoCount);

      await program.methods
        .createVehiculo(
          "Toyota",
          "Corolla",
          2019,
          "ABC-123",
          "1HGBH41JXMN109186"
        )
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
          vehiculo: vehiculoPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const vehiculo = await program.account.vehiculo.fetch(vehiculoPda);
      assert.equal(vehiculo.marca, "Toyota");
      assert.equal(vehiculo.modelo, "Corolla");
      assert.equal(vehiculo.anio, 2019);
      assert.equal(vehiculo.placas, "ABC-123");
      assert.ok(vehiculo.clienteOwner.equals(clientePda));
    });

    it("actualiza un vehiculo correctamente", async () => {
      await program.methods
        .updateVehiculo("Toyota", "Corolla Cross", 2020, "XYZ-789", "1HGBH41JXMN109186")
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
          vehiculo: vehiculoPda,
        })
        .rpc();

      const vehiculo = await program.account.vehiculo.fetch(vehiculoPda);
      assert.equal(vehiculo.modelo, "Corolla Cross");
    });
  });

  // ---------------------------------------------------------------------------
  // Suite: Servicios
  // ---------------------------------------------------------------------------

  describe("servicios", () => {
    it("crea un servicio correctamente", async () => {
      const vehiculo = await program.account.vehiculo.fetch(vehiculoPda);
      [servicioPda] = await deriveServicio(vehiculoPda, vehiculo.servicioCount);

      const fechaUnix = Math.floor(new Date("2024-03-15").getTime() / 1000);

      await program.methods
        .createServicio(
          "Cambio de aceite 5W-30 + filtros",
          85000, // en centavos: $850.00 MXN
          new anchor.BN(fechaUnix),
          "Aceite sintetico Mobil 1, filtro de aceite y aire reemplazados"
        )
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
          vehiculo: vehiculoPda,
          servicio: servicioPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const servicio = await program.account.servicio.fetch(servicioPda);
      assert.equal(servicio.tipoServicio, "Cambio de aceite 5W-30 + filtros");
      assert.equal(servicio.costo.toNumber(), 85000);
      assert.ok(servicio.vehiculoOwner.equals(vehiculoPda));
    });

    it("actualiza un servicio correctamente", async () => {
      const fechaUnix = Math.floor(new Date("2024-03-15").getTime() / 1000);

      await program.methods
        .updateServicio(
          "Cambio de aceite 5W-30 + filtros + revision de frenos",
          97000,
          new anchor.BN(fechaUnix),
          "Se agrego revision de frenos al servicio"
        )
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
          vehiculo: vehiculoPda,
          servicio: servicioPda,
        })
        .rpc();

      const servicio = await program.account.servicio.fetch(servicioPda);
      assert.equal(servicio.costo.toNumber(), 97000);
    });

    it("elimina un servicio correctamente", async () => {
      await program.methods
        .deleteServicio()
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
          vehiculo: vehiculoPda,
          servicio: servicioPda,
        })
        .rpc();

      try {
        await program.account.servicio.fetch(servicioPda);
        assert.fail("La cuenta debia estar cerrada");
      } catch (err: any) {
        assert.include(err.message, "Account does not exist");
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Suite: Eliminacion en cascada
  // ---------------------------------------------------------------------------

  describe("delete_vehiculo", () => {
    it("elimina un vehiculo correctamente", async () => {
      await program.methods
        .deleteVehiculo()
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
          vehiculo: vehiculoPda,
        })
        .rpc();

      try {
        await program.account.vehiculo.fetch(vehiculoPda);
        assert.fail("La cuenta debia estar cerrada");
      } catch (err: any) {
        assert.include(err.message, "Account does not exist");
      }
    });
  });

  describe("delete_cliente", () => {
    it("elimina un cliente correctamente", async () => {
      await program.methods
        .deleteCliente()
        .accounts({
          authority: authority.publicKey,
          cliente: clientePda,
        })
        .rpc();

      try {
        await program.account.cliente.fetch(clientePda);
        assert.fail("La cuenta debia estar cerrada");
      } catch (err: any) {
        assert.include(err.message, "Account does not exist");
      }
    });
  });
});
