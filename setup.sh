#!/bin/bash

# Hotel Booking App Setup Script

echo "Setting up Hotel Booking App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm and try again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create assets directory if it doesn't exist
mkdir -p assets

# Check if ImageMagick is installed for creating a placeholder splash image
if command -v convert &> /dev/null; then
    echo "Creating placeholder splash image..."
    convert -size 1024x1024 xc:white -fill black -gravity center -pointsize 72 -annotate 0 "Hotel Booking App" assets/splash.png
    echo "Placeholder splash image created at assets/splash.png"
else
    echo "ImageMagick is not installed. Please create a splash.png image manually in the assets directory."
fi

echo "Setup complete!"
echo "To start the app, run: npm start"
