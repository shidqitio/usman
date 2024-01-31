@sippp - 2024

==============================================

LIBRARY

==============================================

- @types/luxon : version 3.3.4,
- luxon: 3.4.4,
- axios: version 1.5.1,
- body-parse:  version 1.20.2,
- bwip-js: version 4.1.1,
- compression":  version 1.7.4,
- cors: version 2.8.5,
- crypto-js: version 4.1.1,
- dotenv: version 16.3.1,
- express: version 4.18.2,
- express-rate-limit: version 7.1.1,
- helmet: version7.0.0,
- og4js: version 6.9.1,
- moment-timezone: version 0.5.43,
- multer: version 1.4.5-lts.1,
- mysql2: version 3.6.1,
- puppeteer: version 21.3.7,
- sequelize: version 6.33.0,
- socket.io: version 4.7.2,
- tsconfig-paths: version 4.2.0,
- zod: version 3.22.4

===============================================

STRUKTURE

===============================================

my-app/
├── logs/
├── public/
├── src/
│   ├── certificate/
│   ├── controllers/
│   │   ├── api/
│   │   ├── web/
│   │   └── mobile/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schema/
│   └── services/
│       ├── api/
│       ├── hrd/
│       ├── web/
│       ├── pevita/
│       ├── siakun/
│       ├── usman/
│       ├── panutan/
│       ├── ebudgeting/
│   └── utils/
└── package.json


# My App

This is the README file for the "my-app" project.

## Project Structure

The project structure is organized as follows:

* **logs/** : This directory is intended for storing log files related to the application.
* **public/** : This directory is meant for public assets such as images, stylesheets, and client-side JavaScript files.
* **src/** : The source code of the application is stored in this directory.
* **certificate/** : Contains certificates or related files.
* **controllers/** : This directory is further divided into subdirectories based on the type of controllers.
  *  **api/** : Controllers responsible for handling API-related logic.
  *  **web/** : Controllers specific to web-related functionality.
  *  **mobile/** : Controllers for handling mobile-specific logic.
* **middleware/** : Middleware components that can be used in the application.
* **models/** : Database models or other data models are stored in this directory.
* **routes/** : Defines the routes of the application.
* **schema/** : Contains database schemas or other schema-related files.
* **services/** : The business logic of the application is organized into service modules. Subdirectories represent different modules or components of the application.
  *  **api/** : Services related to API functionality.
  *  **hrd/** : Services specific to the Human Resources Department.
  *  **web/** : Services for web-related functionality.
  *  **pevita/** : Services related to the "pevita" module.
  *  **siakun/** : Services specific to the "siakun" module.
  *  **usman/** : Services for the "usman" module.
  *  **panutan/** : Services related to the "panutan" module.
  *  **ebudgeting/** : Services for the "ebudgeting" module.
* **utils/** : Utility functions or helper modules are stored here.
* **package.json** : The package.json file contains metadata about the project and its dependencies.

## Getting Started

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd my-app`
3. Create file `.env`
4. Install dependencies: `npm install / yarn install`
5. Start the application: `npm start / yarn start`



## Acknowledgments

Happy coding by [Renwidjaya](https://github.com/Renwidjaya)!

---
