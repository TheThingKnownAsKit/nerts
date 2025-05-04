# Nerts

Nerts is a fast-paced, solitaire-like, multiplayer card game where you compete against friends to clear your nerts pile first! Speed is the name of the game while you race to score points by playing cards to the middle, or by playing a nerts card. Be the first to 100 points to win the game (and bragging rights)!

To play, visit https://nerts-web-app.onrender.com or see [Installing and Running](#installing-and-running) to run it locally.

This web-app implementation of the game is powered by Node.js, Socket.io, Vite/React, Firebase, and Render. Developed for RAIK-284H by Ella, Joey, Shayna, and Carter.

## Installing and Running

> **Note:** Node.js and Node Package Manager (npm) are required to run this application locally. Make sure you have them installed before proceeding.

1. Clone this repo to somewhere accessible on your machine.
2. Run `npm run install-all` in the top-level directory to install all dependencies.
3. Run one of the initialization scripts to start the game
    - Run `npm run server` to run in production mode (builds front end to serve from back end server at http://localhost:3000).
    - Run `npm run start` to run in development mode (back end server at http://localhost:3000 and front end server at http://localhost:5173).
    - Run `npm run client` to run only the front end server (at http://localhost:5173).
