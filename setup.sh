#!/bin/bash

# Hotel Booking App Setup Script

echo "Setting up Hotel Booking App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi
echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi
echo "✅ npm is installed"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi
echo "✅ Git is installed"

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI is not installed. Installing Expo CLI..."
    npm install -g expo-cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Expo CLI. Please install it manually."
        exit 1
    fi
fi
echo "✅ Expo CLI is installed"

# Create necessary directories if they don't exist
echo "Creating necessary directories..."
mkdir -p assets
mkdir -p src

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi
echo "✅ Dependencies installed successfully"

# Check if ImageMagick is installed for creating a placeholder splash image
if command -v convert &> /dev/null; then
    echo "Creating placeholder splash image..."
    convert -size 1024x1024 xc:white -fill black -gravity center -pointsize 72 -annotate 0 "Hotel Booking App" assets/splash.png
    echo "✅ Placeholder splash image created at assets/splash.png"
else
    echo "⚠️ ImageMagick is not installed. Please create a splash.png image manually in the assets directory."
fi

echo "✨ Setup complete!"
echo "To start the app, run: npm start"
echo "To run on specific platform:"
echo "  - iOS: npm run ios"
echo "  - Android: npm run android"
echo "  - Web: npm run web"
