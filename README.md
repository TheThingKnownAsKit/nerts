# Nerts

1. Client

a. css
This is where all the css styles will go. We were unsure what all needs to go in here, so if
changes need to be made let us know or just make them

b. js
This is where all our javascript files attached to the front-end will go. For example, socket.js is what handles
front-end implementation/connection of socket.io
Other files that might go here could include more advanced buttons, events, and page logic (some of this is back-end work)

2. Server

This is where all our back-end code will go

a. controllers
This is where we'll put our logic that handles incoming requests and returning appropriate responses. It will update classes and call relevant functions and such.

b. model
This is where we're putting all of our object designs

c. routes
This will define the routes that requests can take through the application and send the requests to the relevant controller

d. sockets
This will handle our back-end logic for websocket connections

package-lock.json and package.json are automatically generated files that just manage the dependencies of the project

# Running Backend

server.js is what actually starts everything, consider it the main
To start the server: navigate to the top level folder that server.js is in and run `nodemon server.js`

# Running Frontend

While the two parts are disconnected, to run the frontend navigate to the `client` folder and run `npm run dev`
