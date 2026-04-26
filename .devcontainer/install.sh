#!/usr/bin/env bash
set -euo pipefail

SOLANA_VERSION="v1.18.17"
ANCHOR_VERSION="0.29.0"

echo ">>> [1/4] Instalando Solana CLI ${SOLANA_VERSION}..."
sh -c "$(curl -sSfL https://release.solana.com/${SOLANA_VERSION}/install)"

# Agregar Solana al PATH de forma permanente para el usuario vscode
SOLANA_PATH="/home/vscode/.local/share/solana/install/active_release/bin"
echo "export PATH=\"\$PATH:${SOLANA_PATH}\"" >> /home/vscode/.bashrc
echo "export PATH=\"\$PATH:${SOLANA_PATH}\"" >> /home/vscode/.profile
export PATH="$PATH:${SOLANA_PATH}"

echo ">>> [2/4] Verificando Solana..."
solana --version

echo ">>> [3/4] Instalando AVM y Anchor CLI ${ANCHOR_VERSION}..."
# AVM (Anchor Version Manager)
AVM_PATH="/home/vscode/.avm/bin"
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force --quiet
echo "export PATH=\"\$PATH:${AVM_PATH}\"" >> /home/vscode/.bashrc
echo "export PATH=\"\$PATH:${AVM_PATH}\"" >> /home/vscode/.profile
export PATH="$PATH:${AVM_PATH}"

avm install ${ANCHOR_VERSION}
avm use ${ANCHOR_VERSION}

echo ">>> [4/4] Generando keypair de desarrollo local..."
# Generar keypair solo si no existe
if [ ! -f /home/vscode/.config/solana/id.json ]; then
  mkdir -p /home/vscode/.config/solana
  solana-keygen new --no-bip39-passphrase --silent --outfile /home/vscode/.config/solana/id.json
fi

# Configurar CLI para localnet por defecto
solana config set --url localhost

echo ""
echo ">>> Instalacion completada exitosamente."
echo "    solana : $(solana --version)"
echo "    anchor : $(anchor --version)"
echo "    rustc  : $(rustc --version)"