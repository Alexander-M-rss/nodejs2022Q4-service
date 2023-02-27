# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker Engine or Docker Desktop - [Download & Install Docker](https://www.docker.com/).

## Installation

```bash
git clone --branch=logging-auth https://github.com/Alexander-M-rss/nodejs2022Q4-service.git
cd nodejs2022Q4-service
npm install
```

## Enviroment configuration

Create `.env` file from `.env.example`

You can configure logs level and maximum log files size treshold in KB. When the size of the current file exceeds this threshold, a new file will be created. `Attention:` New files are created every time the application starts. `LOG_MAX_SIZE_TRESHOLD_KB` default value is 10.

| LOG_LEVEL | collected log                              |
|-----------|--------------------------------------------|
| 0         | `none`                                     |
| 1         | `error`                                    |
| 2         | `error`, `log`                             |
| 3         | `error`, `log`, `warn`                     |
| 4         | `error`, `log`, `warn`, `debug`            |
| 5         | `error`, `log`, `warn`, `debug`, `verbose` |

Default `LOG_LEVEL` value is 2.
If these settings are not present in the `.env` file or have invalid values, the default values will be used.

You can find logs in `logs` folder in root of project.

## Running application

```bash
npm run start:docker
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

```bash*.mdformat

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press `F5` to debug.

For more information, visit: <https://code.visualstudio.com/docs/editor/debugging>
