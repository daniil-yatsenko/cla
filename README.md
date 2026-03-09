# Not DIY project temlplate

Steps:

- git clone the project
- update port in package.json and /src/utils/routerWebflow.js
- create https certificates (needed so Vite localhost would work in Safari) https://chatgpt.com/share/67c97014-a5dc-8009-8e05-f8afe1d09137
  - `brew install mkcert` (only once per device)
  - `mkcert -install` (only once per device)
  - `mkdir certs`
  - `mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost`
- install GSAP `npm install gsap`
- (optional) install Barba and other libraries
- run `npm update`

commands:

- `npm run dev`
- `npm run build`

the project suports multiple build files, e. g. to to have separate scripts in `<head>` and `<body>`. To toggle between which file will be built by "npm run build", go to vite config, and toggle between configs' objects.

to update the prod file, manually copy it from src/dist, and paste to prod. Good practice is to keep the versioning. Once the file is updated, remember to also purge the cache in the CDN ([jsdelivr link](https://www.jsdelivr.com/github)).

the code from routerWebflow.js allows to route the script based on the prod / staging, and on if the localhost:3000 is up.

