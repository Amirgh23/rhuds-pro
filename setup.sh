#!/bin/bash
# RHUDS Pro Monorepo Setup Script

echo "🚀 RHUDS Pro Monorepo Setup"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check pnpm
echo "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing pnpm..."
    npm install -g pnpm@8
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install pnpm"
        exit 1
    fi
fi
PNPM_VERSION=$(pnpm --version)
echo "✅ pnpm version: $PNPM_VERSION"

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

# Build packages
echo ""
echo "Building packages..."
pnpm build
if [ $? -ne 0 ]; then
    echo "⚠️  Build failed, but setup can continue"
else
    echo "✅ Packages built successfully"
fi

# Success message
echo ""
echo "✨ Setup complete!"
echo ""
echo "Available commands:"
echo "  pnpm dev          - Run all packages in development mode"
echo "  pnpm build        - Build all packages"
echo "  pnpm test         - Run all tests"
echo "  pnpm lint         - Lint all packages"
echo "  pnpm demo         - Run demo application"
echo "  pnpm storybook    - Run Storybook"
echo ""
echo "See MONOREPO_SETUP.md for more information"
