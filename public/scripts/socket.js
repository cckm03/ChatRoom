const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

            // Get the chatroom messages
            socket.emit("get messages");
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });

        // Set up the messages event
        socket.on("messages", (chatroom) => {
            chatroom = JSON.parse(chatroom);

            // Show the chatroom messages
            ChatPanel.update(chatroom);
        });

        // Set up the add message event
        socket.on("add message", (message) => {
            message = JSON.parse(message);

            // Add the message to the chatroom
            ChatPanel.addMessage(message);
        });

        // Set up the typing user event
        socket.on("typing user", (username) => {
            // console.log("Typing user:", username);
            // Show the typing user
            ChatPanel.addTypingUser(username);
        });

        // Set up the stopped typing user event
        socket.on("stopped typing user", (username) => {
            // console.log("Stopped typing user:", username);
            // Remove the typing user
            ChatPanel.removeTypingUser(username);
        });
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // This function sends a post message event to the server
    const postMessage = function(content) {
        if (socket && socket.connected) {
            socket.emit("post message", content);
        }
    };

    // This function sends a post typing user event to the server
    const postTypingUser = function(username) {
        if (socket && socket.connected) {
            socket.emit("post typing user", username);
        }
    }

    // This function sends a post stopped typing user event to the server
    const postStoppedTypingUser = function(username) {
        if (socket && socket.connected) {
            socket.emit("post stopped typing user", username);
        }
    }
    return { getSocket, connect, disconnect, postMessage, postTypingUser, postStoppedTypingUser };
})();
