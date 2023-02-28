# API
- Internal: http://localhost:6060
- External: https://music-app-user-server.herokuapp.com

## Start local server: 
```
>npm install
>npm run dev
```
## User schema:
<details>  

```typescript
{
  username: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String},
  userIconId : {type: Number, required: true},
  userFavorites: {
    tracks: {type: [Number], default: []},
    albums: {type: [Number], default: []},
    artists: {type: [Number], default: []},
    playlists: {type: [Number], default: []},
    radio: {type: [Number], default: []},
  },
  customPlaylists: {type: [{
    id: {type: String},
    title: {type: String},
    creator: {
      name: {type: String}
    },
    tracks: {
      data: {type: [Number]}
    },
    nb_tracks: {type: Number},
  }], default: []}
}
```
      
</details>

## Restful:
### Registration
- `POST` /api/registration
- body: 
```js
{
"username": "valid username",
"email": "valid email",
"password": "valid password"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  {
  username,
  email,
  id, //database id
  isActivated,
  userIconId ,
  userFavorites,
  customPlaylists,
  },
  accessToken,
  refreshToken;  //set at cookie 
}
```
Errors:
- `400` (BadRequest) + message:
  - validation error: **'Validation error'**
  - db error (email already taken): **'Email is already taken: ${email}'**
  - mail service error (extreme rare): **'Sending mail error. Log: ', err**
      
</details>  
  

### Login
- `POST` /api/login
- body: 
```js
{
"email": "valid email",
"password": "valid password"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  {
  username,
  email,
  id, //database id
  isActivated,
  userIconId ,
  userFavorites,
  customPlaylists,
  },
  accessToken,
  refreshToken;  //set at cookie
}
```
Errors:
- `400` (BadRequest) + message:
  - email is not found: **'Incorrect email'**
  - wrong password: **'Incorrect password'**
      
</details>  

### Logout
- `POST` /api/logout
- header: 
```js
cookie: {
"refreshToken": "string"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  deleteResult; //special JWT type, not useful at all
}
```
</details>  

### Activate account via click at link at email
- `GET` /api/activate/:link
- header: 
```js
params: {
"link": "string"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
//redirect to https://dashaermolich-rs-clone.netlify.app/welcome
```
Errors:
- `400` (BadRequest) + message:
  - wrong link: **'Incorrect activation link'**
      
</details>  

### Check and refresh user tokens
- `GET` /api/refresh
- header: 
```js
cookie: {
"refreshToken": "string"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  {
  username,
  email,
  id, //database id
  isActivated,
  userIconId ,
  userFavorites,
  customPlaylists,
  },
  accessToken,
  refreshToken;  //set at cookie 
}
```
Errors:
- `401` (UnauthorizedError), message: **'Пользователь не авторизован'**
  - no refresh token
  - invalid token or not exist in db
      
</details>  

### Getter: current user
*Safer analog to refresh, lighter and without errors*
- `GET` /api/user
- header: 
```js
cookie: {
"refreshToken": "string"
},
Authorization: {
"token": "Bearer accessToken"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  {
  username,
  email,
  id, //database id
  isActivated,
  userIconId ,
  userFavorites,
  customPlaylists,
  },
  accessToken,
  refreshToken;  //set at cookie 
}
```
- No/invalid refresh token: 
```js
{ }
```
</details>  

### Setter: account settings
*Method for changing icon and username. Need email to bind to corresponding user*
- `POST` /api/settings
- header: 
```js
Authorization: {
"token": "Bearer accessToken"
}
```
- body: 
```js
{
"email": "valid email",
"newUsername": "valid username",
"newIconId": "valid number"
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  {
  username,
  email,
  id, //database id
  isActivated,
  userIconId ,
  userFavorites,
  customPlaylists,
  }
}
```
Errors:
- `400` (BadRequest) + message:
  - validation error: **'Validation error'**
  - db error (no taken email): **'Incorrect email'**
      
</details>  

### Setter: user favorites, custom playlists
*Method to save most sensitive (because it not our) data. Authorization, validation, database identical checks. Require an object of the relevant interface, near impossible to test it via postman.*  
*Also it can be used to set username and icon id, but there is no point of it. Changes the other fields will ignored or may result in an error*
- `POST` /api/setter
- header: 
```js
Authorization: {
"token": "Bearer accessToken"
},
cookie: {
"refreshToken": "string"
}
```
- body: 
```js
//interface-like object from store component who contains userFavorites and customPlaylists we want to set.
{
  {
    username,
    email,
    id,
    isActivated,
    userIconId ,
    userFavorites,
    customPlaylists,
  },
}
```
<details>  
<summary>Response</summary>

- `200` `OK` 
```js
{
  {
  username,
  email,
  id,
  isActivated,
  userIconId ,
  userFavorites,
  customPlaylists,
  }
}
```
Errors:
- `400` (BadRequest) + message:
  - validation error: **'Validation error'**
- `401` (UnauthorizedError), message: **'Пользователь не авторизован'**
  - no refresh token
  - invalid token or not exist in db
      
</details>  
