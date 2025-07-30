const Registration = (function() {
    // This function sends a register request to the server
    // * `username`  - The username for the sign-in
    // * `avatar`    - The avatar of the user
    // * `name`      - The name of the user
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const register = function(username, avatar, name, password, onSuccess, onError) {

        const user = {
            username: username,
            avatar: avatar,
            name: name,
            password: password
        };

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then((res) => res.json())
        .then((json) => {
            if (json.status == "success") {
                /* Run the onSuccess() callback */
                console.log("User registered:", username);
                if (onSuccess) onSuccess(json.user);
            }
            else if (onError) onError(json.error);
        })
    };

    return { register };
})();
