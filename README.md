# Techtalks 2
For å kjøre dette prosjektet:
* Backend:
  * cd api
  * npm install 
  * npm start

* Frontend:
  * cd client
  * npm install
  * npm start

Script for å opprette databasen ligger i rotmappen (setup.sql)
Husk å sette opp environment variables lokalt - se .env.example 

## Deployment

For ease of use download the Elastic Beanstalk CLI. 

If this is the first time deploying this application create a new eb application with the command ```eb init --platform node.js-12```
Then you have to create an environemnt with ```eb create```

If you already have an application and environment just run ```eb deploy```. 