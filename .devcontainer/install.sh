#!/usr/bin/env bash
set -euo pipefail

SOLANA_VERSION="v1.18.17"
ANCHOR_VERSION="0.29.0"
SOLANA_DIR="$HOME/.local/share/solana/install/active_release"
AVM_BIN="$HOME/.avm/bin"

echo ">>> [1/4] Descargando Solana CLI ${SOLANA_VERSION} desde GitHub Releases..."
curl -fsSL \
  "https://github.com/solana-labs/solana/releases/download/${SOLANA_VERSION}/solana-release-x86_64-unknown-linux-gnu.tar.bz2" \
  -o /tmp/solana.tar.bz2

tar xjf /tmp/solana.tar.bz2 -C /tmp
mkdir -p "${SOLANA_DIR}"
mv /tmp/solana-release/* "${SOLANA_DIR}/"
rm /tmp/solana.tar.bz2

# Agregar Solana al PATH de forma permanente
echo "export PATH=\"\$PATH:${SOLANA_DIR}/bin\"" >> "$HOME/.bashrc"
echo "export PATH=\"\$PATH:${SOLANA_DIR}/bin\"" >> "$HOME/.profile"
export PATH="$PATH:${SOLANA_DIR}/bin"

echo ">>> [2/4] Verificando Solana..."
solana --version

echo ">>> [3/4] Instalando AVM y Anchor CLI ${ANCHOR_VERSION}..."
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force --quiet

echo "export PATH=\"\$PATH:${AVM_BIN}\"" >> "$HOME/.bashrc"
echo "export PATH=\"\$PATH:${AVM_BIN}\"" >> "$HOME/.profile"
export PATH="$PATH:${AVM_BIN}"

avm install ${ANCHOR_VERSION}
avm use ${ANCHOR_VERSION}

echo ">>> [4/4] Configurando wallet de desarrollo..."
if [ ! -f "$HOME/.config/solana/id.json" ]; then
  mkdir -p "$HOME/.config/solana"
  solana-keygen new --no-bip39-passphrase --silent --outfile "$HOME/.config/solana/id.json"
fi

solana config set --url localhost

echo ""
echo ">>> Instalacion completada."
solana --version
anchor --version
rustc --version