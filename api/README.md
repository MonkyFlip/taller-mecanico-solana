# API - Taller Mecanico (Solana / Anchor)

Programa on-chain desarrollado con el framework Anchor sobre Solana.
Gestiona entidades de un taller mecanico usando Program Derived Accounts (PDAs).

---

## Requisitos previos

| Herramienta      | Version minima | Instalacion                                      |
|------------------|----------------|--------------------------------------------------|
| Rust             | 1.75+          | https://rustup.rs                                |
| Solana CLI       | 1.18+          | https://docs.solanalabs.com/cli/install          |
| Anchor CLI       | 0.29.0         | `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked` |
| Node.js          | 18+            | https://nodejs.org                               |
| Yarn             | 1.22+          | `npm install -g yarn`                            |

---

## Instalacion de dependencias

```bash
# Dentro de la carpeta api/
yarn install
```

---

## Desarrollo local

### 1. Configurar wallet de pruebas

```bash
# Generar wallet local (si no existe)
solana-keygen new --outfile ~/.config/solana/id.json

# Configurar CLI para localnet
solana config set --url localhost

# Verificar configuracion
solana config get
```

### 2. Iniciar el validator local

```bash
# En una terminal separada
solana-test-validator --reset
```

### 3. Compilar el programa

```bash
anchor build
```

Esto genera:
- `target/deploy/taller_mecanico.so` — bytecode del programa
- `target/deploy/taller_mecanico-keypair.json` — keypair del programa
- `target/idl/taller_mecanico.json` — IDL para el frontend
- `target/types/taller_mecanico.ts` — tipos TypeScript

### 4. Obtener el Program ID real

```bash
solana address -k target/deploy/taller_mecanico-keypair.json
```

Copia ese valor y actualiza los siguientes archivos:
- `programs/taller_mecanico/src/lib.rs` — `declare_id!("NUEVO_ID")`
- `Anchor.toml` — seccion `[programs.localnet]`

Luego vuelve a compilar:

```bash
anchor build
```

### 5. Desplegar en localnet

```bash
anchor deploy
```

---

## Ejecutar pruebas

```bash
# Con el validator local corriendo
anchor test

# O si el validator ya esta iniciado externamente
anchor test --skip-local-validator
```

Las pruebas cubren el ciclo completo:
- Inicializacion del TallerState
- CRUD completo de Clientes
- CRUD completo de Vehiculos
- CRUD completo de Servicios
- Validaciones de errores (nombre vacio, longitud excedida)
- Eliminacion de cuentas y recuperacion de lamports

---

## Despliegue en Devnet

### 1. Cambiar configuracion a Devnet

```bash
solana config set --url devnet
```

### 2. Solicitar SOL de prueba

```bash
# Airdrop de 2 SOL (ejecutar 2-3 veces si hay rate limit)
solana airdrop 2
```

### 3. Actualizar Anchor.toml

```toml
[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[programs.devnet]
taller_mecanico = "TU_PROGRAM_ID_REAL"
```

### 4. Compilar y desplegar

```bash
anchor build
anchor deploy --provider.cluster devnet
```

### 5. Verificar despliegue

```bash
solana program show TU_PROGRAM_ID --url devnet
```

---

## Estructura de PDAs

### TallerState
```
Seeds: ["taller_state", authority_pubkey]
Proposito: Registro global del taller, almacena cliente_count
```

### Cliente
```
Seeds: ["cliente", authority_pubkey, cliente_id (u64, little-endian)]
Campos: authority, id, nombre, telefono, correo, notas, vehiculo_count, bump
```

### Vehiculo
```
Seeds: ["vehiculo", cliente_pda_pubkey, vehiculo_id (u64, little-endian)]
Campos: cliente_owner, id, marca, modelo, anio, placas, vin, servicio_count, bump
```

### Servicio
```
Seeds: ["servicio", vehiculo_pda_pubkey, servicio_id (u64, little-endian)]
Campos: vehiculo_owner, id, tipo_servicio, costo (centavos u64), fecha (unix i64), notas, bump
```

---

## Interaccion directa con el programa

Usando Anchor CLI o scripts TypeScript con `@coral-xyz/anchor`:

```typescript
import * as anchor from "@coral-xyz/anchor";

const provider = anchor.AnchorProvider.env();
const program = new anchor.Program(IDL, PROGRAM_ID, provider);

// Inicializar taller
await program.methods.initializeTaller().accounts({...}).rpc();

// Crear cliente
await program.methods.createCliente("Nombre", "Tel", "Correo", "Notas").accounts({...}).rpc();

// Leer todos los clientes de una authority
const clientes = await program.account.cliente.all([
  { memcmp: { offset: 8, bytes: authority.toBase58() } }
]);
```

---

## Notas tecnicas

- El costo de los servicios se almacena en **centavos** (u64) para evitar flotantes en la VM.
- El campo `fecha` usa timestamp UNIX en segundos (i64).
- Los campos `id` en cada PDA son contadores incrementales almacenados en el padre.
- La eliminacion de cuentas (`close = authority`) devuelve los lamports al firmante.
- No se implementa eliminacion en cascada on-chain; el frontend debe gestionar el orden correcto.
