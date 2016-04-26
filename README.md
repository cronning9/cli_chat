# cli_chat
A simple chat interface that runs on the *nix terminal, written in Node.js and using MongoDB to store users.
Mostly a toy app for me to build my chops with. Going to port this one to browser eventually.

###Dependencies
* Express -- for the server
* Body-parser -- to handle some http requests
* Morgan -- for logging
* Mongoose -- to handle database queries
* Bcrypt -- to encrypt passwords
* Request -- to make requests from the client

Written with `'use strict'` to allow for cool ES6 syntax.

On the off chance that anybody looks at this and finds a bug and/or wants to change something, feel free to
create a new Issue or make a PR.

#### Note About ".idea"
This is a bunch of formatting folders that Webstorm automatically
creates, and for some reason i can't get it to stay excluded from the 
repo. If you pull from here, feel free to delete that nonsense.