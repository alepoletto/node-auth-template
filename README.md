# node-auth-template

this is a template for node apps using jwt for auth. I uses passport as authentication middleware (local and jwt strategies for now), MongoDB with Mongoose for persistence and bcryptjs to hash and salt the passwords.

## Instalation

clone this repo renaming it for wherever you want ex:

```shell
git clone https://github.com/alepoletto/node-auth-template.git authServer
```

enter into the folder and install the dependencies

```shell
npm install
```

inside the config folder, create a json file named config.json with the follow content
```javascript
{
  "test": {
    "PORT": 3000 //wherever port that you want,
    "MONGODB_URI": "mongodb://localhost:27017/SomeAppTest" //your mongodb address ,
    "JWT_SECRET": "some_secret_code_here" // your secret code for jwt, can be wherever you want
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/SomeApp",
    "JWT_SECRET": "abnt1234sdlloo12368" // random code
  }
}
```

do it for any enviroment that you want it and you are good to go!!
