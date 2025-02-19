#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the Next.js project
yarn build

# Remove the existing pb_public directory if it exists
if [ -d "fly-prod/pb_public" ]; then
    rm -r fly-prod/pb_public
    echo "Removed existing fly-prod/pb_public directory."
fi

# Copy the built output to the target directory
cp -r out fly-prod/pb_public

echo "Build completed and files copied successfully!"

cd fly-prod

flyctl deploy
