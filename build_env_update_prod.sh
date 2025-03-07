#!/bin/bash

# Define files
SRC_ENV=".env.prod"
DEST_ENV=".env"

# Check if source file exists
if [ ! -f "$SRC_ENV" ]; then
    echo "Error: $SRC_ENV file not found!"
    exit 1
fi

# Copy the production env file
cp "$SRC_ENV" "$DEST_ENV"
echo "Updated .env file for production."
