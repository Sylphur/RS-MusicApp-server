# RS-MusicApp-server
Backend server created for https://github.com/DashaErmolich/rs-clone  
Database [mongodb] - https://cloud.mongodb.com/v2/63e118c313c97e5c75b99d81#/metrics/replicaSet/63e1194e57877e74d2b480f6/explorer/test/  
Language - Node.js (node express)

Features:
 - registration/authorization via JSON web tokens, password hashing
 - store information about users: account name, icon, favorite songs, playlists etc.

How to use: 
 - clone this from main into your local repository
 - install dependencies **(npm -install)**, run app **(npm run dev)**
 - default port - 6060, you can change it from environment
 - dont worry about CORS - app will automatically send preflight responces with copy of yours preflight headers
 
 How not to use:
  - avoid using it with *http://* because app can set and read cookies - it will be blocked by any browser by permissons. Use localhost or *https://*  deploy
