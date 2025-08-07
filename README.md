# Overview
<div align="center">
  <img width="700" alt="chatroom" src="https://github.com/user-attachments/assets/0cea6eec-63aa-4f2d-a88b-5ccc13480f42" />
</div>

# Setup
## Install packages

```
npm install expres
npm install bcrypt
npm install express-session
npm install socket.io
```

## Start the server

```
node chat_server.js
```

# Features
## Registration and Sign in
<div align="center">
  <img src="https://github.com/user-attachments/assets/f30e406e-305f-4818-8618-a57857f17d85" alt="frontend" width="700" />
</div>

## Chat Session
<div align="center">
  <img width="700" alt="frontend_chatroom" src="https://github.com/user-attachments/assets/03ecceb8-aa69-4095-9493-6bcc611c99c5" />
</div>

### Typing status
<img width="321" height="117" alt="typing_status" src="https://github.com/user-attachments/assets/e9508e0b-f6a2-429a-bbc0-98651d7e82f4" />

### User Info
<img width="271" height="130" alt="user_info" src="https://github.com/user-attachments/assets/9ee3b000-7692-4b70-9faa-603b0df2478e" />

## Online user list
<div align="center">
  <img width="700" alt="frontend_online_user_list" src="https://github.com/user-attachments/assets/13cbea8d-4b46-48bd-ac72-11d7e0354a6c" />
</div>

# API endpoints
## Registration and Sign in
| Description | HTTP Method | Path | Input | Output |
| :--- | :--- | :--- | :--- | :--- |
| Register for a new account| POST        | /register  | New user account: `{username, avatar, name, password}`               | If successful: `{status: "success"}`<br>Otherwise: `{status: "error", error}`                                                                |
| Sign in the chatroom      | POST        | /signin    | Username/password: `{username, password}`                            | If successful: `{status: "success", user: {username, avatar, name}}`<br>Otherwise: `{status: "error", error}`                                |
| Validate a sign-in session| GET         | /validate  | None                                                                  | If successful: `{status: "success", user: {username, avatar, name}}`<br>Otherwise: `{status: "error", error}`                                |
| Sign out the chatroom     | GET         | /signout   | None                                                                  | Always returns: `{status: "success"}`                                                                                                        |

## Chatroom frontend
| Description                          | Event Name    | Message Content                   |
| :--- | :--- | :--- |
| Request for the online user list     | get users     | -                                 |
| Request for the chatroom messages    | get messages  | -                                 |
| Post a new message in the chatroom   | post message  | *text content of the message*     |

## Chatroom backend
| Description                                      | Type       | Event Name    | Message Content                                      |
| :--- | :--- | :--- | :--- |
| Add a signed-in user to the online user list     | *Broadcast*| add user      | `{ username, avatar, name }`                         |
| Remove a disconnected user from the online list  | *Broadcast*| remove user   | `{ username, avatar, name }`                         |
| Send the current online users                    | *Socket*   | users         | *JSON representation of the online user list*        |
| Send the chatroom messages from the JSON file    | *Socket*   | messages      | *JSON representation of the chatroom messages*       |
| Add a new message to the chatroom                | *Broadcast*| add message   | *JSON representation of the chatroom message*        |

