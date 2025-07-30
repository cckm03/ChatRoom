const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;
    // console.log(req.body);

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    // console.log(users);

    if (!username || !avatar || !name || !password) {
        res.json({ status: "error", error: "All fields are required." });
        return;
    }
    if (!containWordCharsOnly(username)) {
        res.json({ status: "error", error: "Username can only contains underscore, letters or numbers." });
        return;
    }
    if (users[username]){
        res.json({ status: "error", error: "Username already exists." });
        return;
    }

    users[username] = {
        avatar: avatar,
        name: name,
        password: bcrypt.hashSync(password, 10)
    }

    fs.writeFileSync("data/users.json", JSON.stringify(users, null, 2));

    console.log("User registered:", username);
    res.json({ status: "success" });

});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    // console.log(users);

    if (!username || !password) {
        res.json({ status: "error", error: "All fields are required." });
        return;
    }
    if (!users[username]) {
        res.json({ status: "error", error: "Username does not exist." });
        return;
    }
    if (!bcrypt.compareSync(password, users[username].password)) {
        res.json({ status: "error", error: "Password is incorrect." });
        return;
    }

    req.session.user = {username: username, avatar: users[username].avatar, name: users[username].name};
    res.json({
        status: "success",
        user: {
            username: username,
            avatar: users[username].avatar,
            name: users[username].name  
        }});
    console.log("User signed in:", username);

});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {


    const user = req.session.user;
    // console.log(user);

    if (!user) {
        res.json({ status: "error", error: "User is not signed in." });
        return;
    }
    res.json({
        status: "success", 
        user: {
            username: user.username,
            avatar: user.avatar,
            name: user.name  
        } });

});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    console.log("User signed out:", req.session.user.username);
    req.session.user = null;

    res.json({ status: "success" });
});

const {createServer} = require("http");
const {Server} = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer
    // , {
    // cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"]
    // }}
);
// Socket.IO server does not automatically make use of the current session
// explicitly ask the server to 'use' the session that is created above
// socket.request.session.user to access the user in the session data
io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

const onlineUsers = {};
io.on("connection", (socket) => {
    // console.log(socket.request.session.user);
    if (socket.request.session.user) {
        const user = socket.request.session.user;
        onlineUsers[user.username] = user;
        console.log("Users connected:", onlineUsers);
        io.emit("add user", JSON.stringify(user));
    }
    socket.on("get users", () => {
        const user = socket.request.session.user;
        if (user) {
            socket.emit("users", JSON.stringify(onlineUsers));
        }
    });
    socket.on("get messages", () => {
        const user = socket.request.session.user;
        if (user) {
            const messages = JSON.parse(fs.readFileSync("data/chatroom.json", "utf-8"));
            socket.emit("messages", JSON.stringify(messages));
        }
    });

    socket.on("post typing user", (username) => {
        const user = socket.request.session.user;
        if (user && user.username == username) {
            // console.log("User typing:", username);
            io.emit("typing user", JSON.stringify(username));
        }
    });
    socket.on("post stopped typing user", (username) => {
        const user = socket.request.session.user;
        if (user && user.username == username) {
            // console.log("User stopped typing:", username);
            io.emit("stopped typing user", JSON.stringify(username));
        }
    });

    socket.on("post message", (content) => {
        const user = socket.request.session.user;
        if (user) {
            // add to chatroom.json
            const newMessage = {
                user: user,
                datetime: new Date().toISOString(),
                content: content
            };

            // neccessary to parse string to json than convert back to string when saving
            const messages = JSON.parse(fs.readFileSync("data/chatroom.json", "utf-8"));
            messages.push(newMessage);
            fs.writeFileSync("data/chatroom.json", JSON.stringify(messages, null, 2));

            io.emit("add message", JSON.stringify(newMessage));
        }
    });
    socket.on("disconnect", () => {
        const user = socket.request.session.user;
        if (user) {
            delete onlineUsers[user.username];
            console.log("Users connected:", onlineUsers);
            io.emit("remove user", JSON.stringify(user));
        }
    });
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});
