"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaGeneralToCreate = exports.GerenteSucursalesToCreate = exports.DirectivosToCreate = exports.ComprasToCreate = exports.TesoreroSucForaneasToCreate = exports.TesoreroSucCentralesToCreate = exports.SucursalToCreate = exports.AlmacenGeneralToCreate = exports.AdminUsersToCreate = exports.SuperUsersToCreate = void 0;
const sysAdmin_rules_collection_1 = require("./rules/sysAdmin-rules.collection");
const almacenGeneral_rules_collection_1 = require("./rules/almacenGeneral-rules.collection");
const sucursal_rules_collection_1 = require("./rules/sucursal.rules.collection");
const tesoreroSucursalesGenerales_rules_collection_1 = require("./rules/tesoreroSucursalesGenerales.rules.collection");
const tesoreroSucursalesForaneas_rules_collection_1 = require("./rules/tesoreroSucursalesForaneas.rules.collection");
const compras_rules_collection_1 = require("./rules/compras.rules.collection");
const directivos_rules_collection_1 = require("./rules/directivos.rules.collection");
const gerenteSucursales_rules_collection_1 = require("./rules/gerenteSucursales-rules.collection");
const ventaGeneral_rules_collection_1 = require("./rules/ventaGeneral-rules.collection");
const domain = 'xst.mx';
exports.SuperUsersToCreate = [
    {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super@' + domain,
    },
];
exports.AdminUsersToCreate = [
    {
        firstName: 'Admin',
        lastName: 'Principal',
        email: 'admin@' + domain,
        rules: sysAdmin_rules_collection_1.SysAdminRules.map((r) => r.value),
    },
];
exports.AlmacenGeneralToCreate = [
    {
        firstName: 'Maribel',
        lastName: 'Almacen General',
        email: 'almacengeneral@' + domain,
        rules: almacenGeneral_rules_collection_1.AlmacenGeneralRules.map((r) => r.value),
    },
];
exports.SucursalToCreate = [
    {
        firstName: 'Sucursal',
        lastName: 'Encargado de sucursal',
        email: 'sucursal@' + domain,
        rules: sucursal_rules_collection_1.SucursalRules.map((r) => r.value),
    },
];
exports.TesoreroSucCentralesToCreate = [
    {
        firstName: 'Jaime',
        lastName: 'Cevallos',
        email: 'tesorerogeneral@' + domain,
        rules: tesoreroSucursalesGenerales_rules_collection_1.TesoreroSucursalesGeneralesRules.map((r) => r.value),
    },
];
exports.TesoreroSucForaneasToCreate = [
    {
        firstName: 'Maricela',
        lastName: 'Suc Foraneas',
        email: 'tesoreroforaneo@' + domain,
        rules: tesoreroSucursalesForaneas_rules_collection_1.TesoreroSucursalesForaneasRules.map((r) => r.value),
    },
];
exports.ComprasToCreate = [
    {
        firstName: 'Lic Lopez',
        lastName: 'Encargada de Compras',
        email: 'compras@' + domain,
        rules: compras_rules_collection_1.ComprasRules.map((r) => r.value),
    },
];
exports.DirectivosToCreate = [
    {
        firstName: 'Directivos',
        lastName: 'Suc Generales',
        email: 'directivos@' + domain,
        rules: directivos_rules_collection_1.DirectivosRules.map((r) => r.value),
    },
];
exports.GerenteSucursalesToCreate = [
    {
        firstName: 'Gerente',
        lastName: 'De sucursales',
        email: 'gerentesucursales@' + domain,
        rules: gerenteSucursales_rules_collection_1.GerenteSucursalesRules.map((r) => r.value),
    },
];
exports.VentaGeneralToCreate = [
    {
        firstName: 'Alondra',
        lastName: 'Aragon',
        email: 'ventas@' + domain,
        rules: ventaGeneral_rules_collection_1.VentaGeneralRules.map((r) => r.value),
    },
];
//# sourceMappingURL=users.collection.js.map