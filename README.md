# Introduction 
This demo show .glb files in WebXR.

## If you do not have Node.js and nmp in your local machine
1. Download "nvm-setup.zip" from https://github.com/coreybutler/nvm-windows
2. Run "nvm-setup.exe"
3. `nvm version` in terminal # check nvm is installed
4. `nvm install 22.13.1`
5. `nvm use 22.13.1`
6. `node -v` # result should be 22.13.1
7. `npm -v` # show npm version

# Getting Started
1. `npm install` # install all packages. This is only first time.
2. `npm run start` # run client and server sides together in dev mode. Now you can access on http://localhost:5173/
#### If you want to build production and preview it in your local
1. `npm run build` # create production folder which call 'dict'
2. `node dist/server.js` # run server side separately
3. `npm run preview`  # run client side that is under dict folder