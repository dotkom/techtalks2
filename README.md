# Techtalks 2

## Thoughts about project structure

The root project folder contains a very basic express app setup. The entrypoint of the app is contained in ***app.js***, all the express handlers are places in the directory called ***routes***. The frontend, which is in the direcotory named frontend, is served by the express app. 

The way this is done is by building the static files of frontend and putting them in a directory called ***public*** in project root. 

```
cd frontend
npm install
npm build
cd ..

mkdir public
cp -r frontend/* public
```

There should be several ways to build the project. Manually with npm, we're halfway there with the example above. Another way to build the project is by using the Dockefile. There is nothing special about it.

## Deployment

For ease of use download the Elastic Beanstalk CLI. 

The files inside the ***.ebextensions*** folder sets up the Elastic Beanstalk environment. 

If this is the first time deploying this application create a new eb application with the command ```eb init --platform node.js-12```
Then you have to create an environemnt with ```eb create```

If you already have an application and environment just run ```eb deploy```. 

The environment variables have to be set in the AWS Console. You can find them under ***Configuration*** then ***Software*** and ***Environment properties***.

You also need to setup a MySQL database to be able to use the application. A script called ***setup.sql*** is provided in project root containing the necessary tables. 