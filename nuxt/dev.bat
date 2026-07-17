@echo off
powershell -NoProfile -Command "$env:NODE_OPTIONS='--loader file:///' + (Resolve-Path 'scripts/esm-loader.mjs').ToString().Replace('\','/'); npx nuxt dev %*"
