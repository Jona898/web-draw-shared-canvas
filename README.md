# Web Draw Shared Canvas

This Project is a Drawing app, where Client Browsers can draw on a canvas.

Multiple Clients can be synchronized with a Backend, which shares the changes to all connected devices.

## Setup

### Shared

1. Change into folder [./shared](./shared)

2. Run `npm install` to install dependencies

3. dev: For development run `npm run build-watch` (For recompiling on changes in this Project).

   prod: And for Production run `npm run build`.

### Backend

1. Setup shared

2. Change into folder [./backend](./backend)

3. Run `npm install` to install dependencies

4. dev: For development run `npm run start:dev`.

   prod: And for Production run `npm run start`.

### Frontend

1. Setup shared

2. Change into folder [./frontend](./frontend)

3. Run `npm install` to install dependencies

4. dev: For development run `npm run serve`.

   prod: And for Production run `npm run build` and copy the dist folder to a hosting Server.
