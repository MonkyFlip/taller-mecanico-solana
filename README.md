# Taller Mecanico - Sistema de Gestion On-Chain

Sistema completo de gestion para talleres mecanicos construido sobre la blockchain de Solana.
Permite registrar clientes, vehiculos y servicios de mantenimiento de forma inmutable,
usando Program Derived Accounts (PDAs) como estructura de datos descentralizada.

---

## Descripcion general

El proyecto esta dividido en dos modulos independientes:

| Modulo | Tecnologia | Descripcion |
|--------|-----------|-------------|
| `api/` | Solana + Anchor (Rust) | Programa on-chain con logica de negocio y validaciones |
| `web/` | Next.js 14 + TypeScript + TailwindCSS | Interfaz web que interactua con el programa via Wallet Adapter |

El backend no es un servidor HTTP tradicional. Es un programa deployado en la red de Solana
que ejecuta instrucciones firmadas por la wallet del usuario.

---

## Arquitectura

```
Usuario (Browser)
    |
    | Firma transacciones con Phantom/Solflare
    v
Next.js 14 (App Router)
    |
    | @coral-xyz/anchor + @solana/web3.js
    v
Solana RPC Node (Devnet)
    |
    | Envia transacciones al runtime de Solana
    v
Programa Anchor: taller_mecanico
    |
    | Lee/escribe cuentas PDA
    v
Accounts Storage (Solana Ledger)
    [TallerState] [Cliente] [Vehiculo] [Servicio]
```

---

## Diagrama conceptual de PDAs

```
Wallet (authority)
    |
    +-- TallerState PDA
    |   Seeds: ["taller_state", authority]
    |   Almacena: cliente_count
    |
    +-- Cliente PDA (0)
    |   Seeds: ["cliente", authority, 0]
    |   Almacena: nombre, telefono, correo, notas, vehiculo_count
    |   |
    |   +-- Vehiculo PDA (0)
    |   |   Seeds: ["vehiculo", cliente_pda, 0]
    |   |   Almacena: marca, modelo, anio, placas, vin, servicio_count
    |   |   |
    |   |   +-- Servicio PDA (0)
    |   |   |   Seeds: ["servicio", vehiculo_pda, 0]
    |   |   |   Almacena: tipo_servicio, costo, fecha, notas
    |   |   |
    |   |   +-- Servicio PDA (1)
    |   |       Seeds: ["servicio", vehiculo_pda, 1]
    |   |
    |   +-- Vehiculo PDA (1)
    |       Seeds: ["vehiculo", cliente_pda, 1]
    |
    +-- Cliente PDA (1)
        Seeds: ["cliente", authority, 1]
```

La jerarquia es determinista: dado el par (authority, id), cualquier PDA puede ser
recalculada off-chain sin necesidad de almacenar indices adicionales.

---

## Flujo Cliente - Vehiculo - Servicio

```
1. initialize_taller(authority)
       |
       v
   TallerState { cliente_count: 0 }

2. create_cliente(nombre, telefono, correo, notas)
       |
       +-- Lee TallerState.cliente_count (= N)
       +-- Deriva Cliente PDA con seed N
       +-- Crea la cuenta Cliente
       +-- Incrementa TallerState.cliente_count

3. create_vehiculo(marca, modelo, anio, placas, vin)
       |
       +-- Verifica autoridad sobre Cliente PDA
       +-- Lee Cliente.vehiculo_count (= M)
       +-- Deriva Vehiculo PDA con seed M bajo ese Cliente
       +-- Crea la cuenta Vehiculo
       +-- Incrementa Cliente.vehiculo_count

4. create_servicio(tipo, costo, fecha, notas)
       |
       +-- Verifica cadena de autoridad: authority -> Cliente -> Vehiculo
       +-- Lee Vehiculo.servicio_count (= K)
       +-- Deriva Servicio PDA con seed K bajo ese Vehiculo
       +-- Crea la cuenta Servicio
       +-- Incrementa Vehiculo.servicio_count
```

Cada instruccion valida la cadena completa de ownership antes de ejecutar
cualquier escritura, garantizando que solo el propietario original pueda
modificar o eliminar sus registros.

---

## Levantar el proyecto en desarrollo

### 1. Backend (api/)

```bash
cd api

# Instalar dependencias JS
yarn install

# Iniciar validator local (en terminal separada)
solana-test-validator --reset

# Configurar CLI para localnet
solana config set --url localhost

# Compilar el programa
anchor build

# Obtener y configurar el Program ID real
solana address -k target/deploy/taller_mecanico-keypair.json
# -> Actualizar declare_id! en lib.rs y Anchor.toml

anchor build  # Segunda compilacion con el ID correcto

# Desplegar
anchor deploy

# Ejecutar pruebas
anchor test --skip-local-validator
```

### 2. Frontend (web/)

```bash
cd web

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar NEXT_PUBLIC_PROGRAM_ID con el ID generado en el paso anterior

# Iniciar servidor de desarrollo
yarn dev
```

Navegar a http://localhost:3000

---

## Despliegue en Devnet

```bash
# Configurar CLI
solana config set --url devnet

# Solicitar SOL de prueba
solana airdrop 2

# Desde la carpeta api/
anchor build

# Actualizar Anchor.toml: cluster = "Devnet"
anchor deploy --provider.cluster devnet

# Copiar Program ID a web/.env.local
echo "NEXT_PUBLIC_PROGRAM_ID=$(solana address -k target/deploy/taller_mecanico-keypair.json)" >> ../web/.env.local
echo "NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com" >> ../web/.env.local

# Construir frontend para produccion
cd ../web
yarn build
```

---

## Estructura de carpetas

```
taller-mecanico-solana/
|
+-- api/                                  Backend Solana/Anchor
|   +-- Anchor.toml                       Configuracion del workspace
|   +-- Cargo.toml                        Workspace de Rust
|   +-- package.json                      Dependencias JS para pruebas
|   +-- tsconfig.json                     Configuracion TypeScript para tests
|   +-- README.md
|   +-- migrations/
|   |   +-- deploy.ts                     Script de migracion post-deploy
|   +-- programs/
|   |   +-- taller_mecanico/
|   |       +-- Cargo.toml
|   |       +-- src/
|   |           +-- lib.rs                Entry point del programa Anchor
|   |           +-- errors.rs             Codigos de error personalizados
|   |           +-- state/               Definicion de cuentas PDA
|   |           |   +-- mod.rs
|   |           |   +-- taller_state.rs
|   |           |   +-- cliente.rs
|   |           |   +-- vehiculo.rs
|   |           |   +-- servicio.rs
|   |           +-- instructions/        Logica de instrucciones CRUD
|   |               +-- mod.rs
|   |               +-- cliente/mod.rs
|   |               +-- vehiculo/mod.rs
|   |               +-- servicio/mod.rs
|   +-- tests/
|       +-- taller_mecanico.ts           Tests de integracion Anchor
|
+-- web/                                  Frontend Next.js
|   +-- package.json
|   +-- tsconfig.json
|   +-- tailwind.config.ts
|   +-- next.config.ts
|   +-- README.md
|   +-- src/
|       +-- app/                          Rutas App Router
|       +-- components/                   Componentes React
|       +-- hooks/                        React Query hooks
|       +-- lib/                          Utilidades y configuracion Anchor
|       +-- providers/                    Contextos de React
|       +-- types/                        Tipos del dominio
|       +-- constants/                    Configuracion de red y semillas
|
+-- README.md                             Este archivo
```

---

## Como contribuir

1. Haz fork del repositorio.
2. Crea una rama descriptiva: `git checkout -b feature/nombre-funcionalidad`
3. Realiza tus cambios con commits atomicos y mensajes claros en ingles.
4. Si modificas el programa Rust, ejecuta `anchor test` y asegurate de que todas las pruebas pasen.
5. Si modificas el frontend, ejecuta `yarn build` para verificar que no hay errores de tipo.
6. Abre un Pull Request con una descripcion detallada del cambio y su motivacion.

---

## Notas tecnicas importantes

### Gestion de costos
Los costos de servicios se almacenan como enteros en **centavos** (u64) para evitar
aritmetica de punto flotante en la VM de Solana. La conversion a pesos MXN se realiza
exclusivamente en el frontend.

### Inmutabilidad del ID
Una vez creada una PDA, su `id` es inmutable porque forma parte de las seeds.
Si un cliente es eliminado y recreado, obtendra un nuevo `id` (el contador no retrocede).

### Eliminacion no en cascada
El programa no elimina automaticamente las cuentas hijas al eliminar una cuenta padre.
El frontend debe guiar al usuario a eliminar servicios -> vehiculos -> cliente en ese orden.
Eliminar un cliente con vehiculos activos dejara PDAs huerfanas en la blockchain.

### Ownership estricto
Cada instruccion de modificacion verifica la cadena completa:
`authority -> TallerState/Cliente -> Vehiculo -> Servicio`.
Una wallet no puede modificar registros de otra wallet, garantizado por el runtime de Solana.

### IDL y tipos generados
Despues de cada `anchor build`, el archivo `target/idl/taller_mecanico.json` contiene
el IDL actualizado. Debe copiarse al frontend para mantener la sincronizacion de tipos.
