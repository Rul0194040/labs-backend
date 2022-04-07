#!/bin/bash

cd /home/administrador/labs/labs-back-prod
git checkout master
git pull
npm i
npm run build
cp ../orm.config-prod.json orm.config.json
npm run mig:run
pm2 restart labs_prod