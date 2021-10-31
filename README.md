# Backend for Infinite Heroes game for Play2Earn mechanics based on Node.js
Whole project contains four github repositories:
1. Backend part: https://github.com/dase1243/binance-backend
2. Frontend part: https://github.com/dase1243/binance-frontend
3. Unity game repository: https://github.com/Gamblock/hack-project
4. Unity game wrapper to represent the game at the UI: https://github.com/dase1243/binance-unity-webgl-wrapper

This repository contains backend code.

### Main parts of the backend:
- JWT authorization
- Mongo database with mongoose middleware to store User and Model, so Unity Game could do CRUD operations
- Firebase Storage, as Heroku doesn't support static files storage
- Heroku deployment
- Moralis is used as Web3Js

### While Project is written using microservice architecture. Besides, JWT authorization is used as SSO mechanism for the user login/signup.

## Prerequisites

- [NodeJS](https://nodejs.org) from 10 to 13
- Firebase Storage API keys
- Moralis API keys

## Set up and run demo

### Clone

Clone the repository from GitHub.

```
$ git clone https://github.com/dase1243/binance-backend
```

### Main Entities:

1. User - represents main entity in the game. He can generate tokens, print tokens, sell tokens. All necessary endpoints support wide features.
2. Model - represents model which is generated in the game and used for storing in game parameters about heroes, tokens and battles

### Main concepts.

1. Authorization is implemented following RFC 7519. JWT specifies a compact and self-contained method for communicating information as a JSON object between two parties. Because it is signed, this information can be checked and trusted. JWTs can be signed using a secret (using the HMAC algorithm) or an RSA or ECDSA public/private key combination. In a moment, we’ll see some examples of how to use them.

2. MongoDB is written using mongoose with implementation of JOIN patter between User and Model

3. When Unity WebGL side wants to store the data at the server is sends secured unity_password in the body of the requests

4. Heroku doesn't support static files, but we wanted to provide fully deployed application, that's why we used Heroku. However, absence of static files storage required us to implement third-party storage. For that purpose we used Firebase Storage API

### Install Dependencies and Run the Server

```
$ npm install
$ npm run start
```


## License

This library is released under the [3-clause MIT License](LICENSE.md).

## Support

Our developer support team is here to help you. Find out more information on our [Help Center](https://help.virgilsecurity.com/).

You can find us on [Twitter](https://twitter.com/VirgilSecurity) or send us email support@VirgilSecurity.com.

Also, get extra help from our support team on [Slack](https://virgilsecurity.com/join-community).

