#!/bin/bash

cd /home/administrador/labs/labs-back-testing
git checkout testing
git reset --hard HEAD #reset al repo al ultimo commit que tengamos local
git clean -df #borrar todos los archivos nuevos que no esten en .gitignore
git pull #actualizar el repo
npm i #en caso de nuevas dependencias
npm run build #build a prod.
cp ../orm.config-testing.json orm.config.json
npm run mig:run #en caso de haber nuevas migraciones
pm2 restart labs_testing #reiniciar cluster de apps