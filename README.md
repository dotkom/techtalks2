# Techtalks 2

## Steps to run locally

### Backend

```
cd backend
npm i
npm run dev
```

### Frontend

```
cd frontend
npm i
npm start
```


Another way to run for development is to run docker compose. This will run both frontend and backend and mount the directories.
It will also create a database

## Deployment

The backend is deployed with the Serverless framework as a lambda function. To deploy a new version just run ```serverless deploy```.

The frontend may be deployed in multiple ways.

You also need to setup a MySQL database to be able to use the application. A script called ***setup.sql*** is provided in project root containing the necessary tables.

### Environment variables

#### Frontend
```REACT_APP_BACKEND_URL="https://localhost:8080"```. This is the default value

#### Database
```
TECHTALKS_DB_HOST="database.online.ntnu.no"
TECHTALKS_DB_USER="admin"
TECHTALKS_DB_PASSWORD="thisisapassword"
TECHTALKS_DB_NAME="techtalks"
```

#### Email information
```
TECHTALKS_MAIL_USER="ekskom@online.ntnu.no"
GMAIL_OAUTH_PRIVATE_KEY="key"
GMAIL_OAUTH_CLIENT_ID="id"
```

#### JWT
```
TECHTALKS_JWT_KEY="Thisisnotaverygoodkey"
```

#### Admin Login
```
TECHTALKS_ADMIN_NAME="admin"
TECHTALKS_ADMIN_PASSWORD="password1234"
```
