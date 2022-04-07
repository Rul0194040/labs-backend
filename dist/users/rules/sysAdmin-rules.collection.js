"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysAdminRules = void 0;
const rules_interface_1 = require("../../common/interfaces/rules.interface");
exports.SysAdminRules = [
    {
        name: 'Ver Usuario',
        description: 'Ver datos del mismo usuario',
        value: 'view:user',
    },
    {
        name: 'Modificar Usuario',
        description: 'Modificar sus propios datos',
        value: 'update:user',
    },
    {
        name: 'Ver Usuarios',
        description: 'Ver listado de usuarios',
        value: 'view:users',
    },
    {
        name: 'Crear Usuarios',
        description: 'Crear usuarios',
        value: 'create:users',
    },
    {
        name: 'Modificar Usuarios',
        description: 'Modificación de usuarios',
        value: 'update:users',
    },
    {
        name: 'Eliminar usuarios',
        description: 'Eliminación de usuarios',
        value: 'delete:users',
    },
    {
        name: 'Iniciar el grabado de roles',
        description: 'Inicia el estatus de grabado de roles en un usuario seleccionado',
        value: 'cambiar:grabado:rules',
    },
];
//# sourceMappingURL=sysAdmin-rules.collection.js.map