# Incident Management System

This tool helps bridge the gap of the integration between OpsGenie & Status Page

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm:** You must have Node.js and npm (Node Package Manager) installed on your computer. You can download them from [https://nodejs.org/](https://nodejs.org/).

## Set Environment Variables
- For both, Base.env & src/server/Base.env, you will need to fill in the environment variables as you see fit. 
## Use Environment Variables
- Once your environment variables are set, you will then need to edit the name of both `Base.env` files. And remove the `Base` prefix. Both files should be named: `.env` now.
## Source Environmental Variables
### At your base directory, run:
```bash
source .env
```
### Go to your server:
```bash
cd src/server/
```
### Source `.env` file:
```bash
source .env
```

## Installation

```bash
npm install
```

## Start App

```bash
npm start
```

# For Server
## Go To Server
```bash
cd src/server/
```
## Start Server
```bash
node api.js
```
