# Backend of Vote Aplication (NodeJS)

## Description:

This is a backend aplication destined to manage users, probes and option to vote of the application, maintaining a linkage with MongoDb to execute CRUD tasks as well as a webSocket communication to keep a real time updating on the votation activities and last but not less important a conecction with the google services to establish an authentication by Oauth2. 

## Tecnologies employed:

  - nodeJS
  - express
  - mongoose
  - ws
  - nodemailer
  - jsonwebtoken
  - google-auth-library
  - env-var
  - dotenv
  - uuid
  - bcryptjs
  - cors
  - express-rate-limit

## Steps for using:
1. Execute the command ```docker compose up -d``` to initialize a container with the mongoDb running
2. Copy the .env.template file into a .env archive setting the values of the environmental variables
3. Execute the command ```npm install``` to install the used dependecies 
4. Use the command ```npm run dev``` to start the project in a local environment


