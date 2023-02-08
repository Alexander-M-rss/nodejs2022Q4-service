# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker Engine or Docker Desktop - [Download & Install Docker](https://www.docker.com/).

## Installation

```bash
git clone --branch=docker-db-orm https://github.com/Alexander-M-rss/nodejs2022Q4-service.git
cd nodejs2022Q4-service
npm install
```

## Enviroment configuration

Create `.env` file from `.env.example`

## Running application

```bash
npm start:docker
```
:warning: Please use with `sudo` if you are a Unix-like user.

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing <http://localhost:4000/doc/>.
For more information about OpenAPI/Swagger please visit <https://swagger.io/>.

## Scanning application for security vulnerabilities

Scan application image

```bash
npm run scan:app
```
:warning: Please use with `sudo` if you are a Unix-like user.

Scan database image

```bash
npm run scan:db
```
:warning: Please use with `sudo` if you are a Unix-like user.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: <https://code.visualstudio.com/docs/editor/debugging>
