# Overview
<img width="840" height="663" alt="chatroom" src="https://github.com/user-attachments/assets/0cea6eec-63aa-4f2d-a88b-5ccc13480f42" />

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
<img width="1343" height="849" alt="frontend" src="https://github.com/user-attachments/assets/f30e406e-305f-4818-8618-a57857f17d85" />

## Chat Session
<img width="1340" height="847" alt="frontend_chatroom" src="https://github.com/user-attachments/assets/03ecceb8-aa69-4095-9493-6bcc611c99c5" />

### Typing status
<img width="321" height="117" alt="typing_status" src="https://github.com/user-attachments/assets/e9508e0b-f6a2-429a-bbc0-98651d7e82f4" />

### User Info
<img width="271" height="130" alt="user_info" src="https://github.com/user-attachments/assets/9ee3b000-7692-4b70-9faa-603b0df2478e" />

## Online user list
<img width="1340" height="847" alt="frontend_online_user_list" src="https://github.com/user-attachments/assets/13cbea8d-4b46-48bd-ac72-11d7e0354a6c" />

# API
| Description | HTTP Method | Path | Input | Output |
| :--- | :--- | :--- | :--- | :--- |
| Register for a new account| POST        | /register  | New user account: `{username, avatar, name, password}`               | If successful: `{status: "success"}`<br>Otherwise: `{status: "error", error}`                                                                |
| Sign in the chatroom      | POST        | /signin    | Username/password: `{username, password}`                            | If successful: `{status: "success", user: {username, avatar, name}}`<br>Otherwise: `{status: "error", error}`                                |
| Validate a sign-in session| GET         | /validate  | None                                                                  | If successful: `{status: "success", user: {username, avatar, name}}`<br>Otherwise: `{status: "error", error}`                                |
| Sign out the chatroom     | GET         | /signout   | None                                                                  | Always returns: `{status: "success"}`                                                                                                        |
