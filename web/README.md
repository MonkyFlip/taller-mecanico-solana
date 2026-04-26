# Web - Taller Mecanico Frontend

Interfaz web profesional desarrollada con Next.js 14, TypeScript, TailwindCSS y Solana Wallet Adapter.
Se comunica directamente con el programa Anchor desplegado en Devnet.

---

## Requisitos previos

| Herramienta | Version minima |
|-------------|----------------|
| Node.js     | 18+            |
| Yarn        | 1.22+          |

Una wallet de Solana compatible con Devnet:
- Phantom (https://phantom.app)
- Solflare (https://solflare.com)

---

## Instalacion de dependencias

```bash
# Dentro de la carpeta web/
yarn install
```

---

## Configuracion de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local

# Editar con tus valores reales
nano .env.local
```

Variables disponibles:

| Variable                    | Descripcion                              | Default                          |
|-----------------------------|------------------------------------------|----------------------------------|
| `NEXT_PUBLIC_RPC_ENDPOINT`  | Endpoint RPC de Solana                   | https://api.devnet.solana.com    |
| `NEXT_PUBLIC_PROGRAM_ID`    | Program ID del contrato desplegado       | (placeholder, debe actualizarse) |

---

## Ejecutar en desarrollo

```bash
yarn dev
```

Abre http://localhost:3000 en tu navegador.

---

## Build de produccion

```bash
yarn build
yarn start
```

---

## Conectar la wallet

1. Instala Phantom o Solflare en tu navegador.
2. En la configuracion de la wallet, cambia la red a **Devnet**.
3. Solicita SOL de prueba:
   - En Phantom: Configuracion > Red > Devnet, luego usa el faucet interno.
   - Alternativa: https://faucet.solana.com
4. Haz clic en el boton "Conectar" en la navbar del sitio.
5. Selecciona tu wallet en el modal.
6. Aprueba la conexion desde la extension.

---

## Flujo de uso del sistema

### Primera vez con una wallet nueva

1. Conectar la wallet.
2. En el panel principal, hacer clic en **"Inicializar taller en Devnet"**.
3. Aprobar la transaccion en la wallet (crea el `TallerState` PDA).

### Registrar un cliente

1. Ir a la seccion **Clientes**.
2. Hacer clic en **"Nuevo cliente"**.
3. Completar el formulario y confirmar la transaccion.

### Registrar un vehiculo

1. Desde la lista de clientes, hacer clic en **"Ver vehiculos"** del cliente.
2. Hacer clic en **"Nuevo vehiculo"**.
3. Completar el formulario y confirmar la transaccion.

### Registrar un servicio

1. Desde la lista de vehiculos, hacer clic en **"Ver servicios"**.
2. Hacer clic en **"Nuevo servicio"**.
3. Ingresar el tipo de servicio, costo en MXN y fecha.
4. Confirmar la transaccion.

---

## Interaccion con el backend Anchor

El frontend usa `@coral-xyz/anchor` para interactuar con el programa on-chain:

- `useAnchorProgram()` — construye el cliente del programa desde la wallet conectada.
- `useClientes()` — consulta todas las cuentas `Cliente` de la authority actual via `getProgramAccounts`.
- `useVehiculos(clientePubkey)` — consulta vehiculos filtrados por `clienteOwner`.
- `useServicios(vehiculoPubkey)` — consulta servicios filtrados por `vehiculoOwner`.

Todos los hooks de mutacion manejan la derivacion de PDAs automaticamente antes de invocar la instruccion Anchor.

---

## Actualizacion del IDL

Despues de hacer cambios al programa Anchor y recompilar:

```bash
# En la carpeta api/
anchor build

# Copiar el IDL generado al frontend
cp target/idl/taller_mecanico.json ../web/src/lib/taller_mecanico.json
cp target/types/taller_mecanico.ts ../web/src/lib/idl.ts
```

Luego actualiza `src/lib/anchor.ts` para importar el JSON real en lugar del IDL inline.

---

## Estructura de carpetas

```
src/
  app/               Rutas de Next.js 14 (App Router)
    page.tsx         Dashboard principal
    clientes/        Lista de clientes
      [pubkey]/      Vehiculos de un cliente especifico
    vehiculos/
      [pubkey]/      Servicios de un vehiculo especifico
  components/
    layout/          Navbar y elementos de layout
    cliente/         Tarjetas y formularios de clientes
    vehiculo/        Tarjetas y formularios de vehiculos
    servicio/        Tarjetas y formularios de servicios
    ui/              Componentes atomicos reutilizables
  hooks/             Hooks de React Query para cada entidad
  lib/               Utilidades, IDL y configuracion de Anchor
  providers/         WalletProvider y QueryProvider
  types/             Tipos TypeScript del dominio
  constants/         Configuracion de red, seeds y limites
```
