import { SysAdminRules } from './rules/sysAdmin-rules.collection';
import { createUserDTO } from './dto/createUser.dto';
import { AlmacenGeneralRules } from './rules/almacenGeneral-rules.collection';
import { SucursalRules } from './rules/sucursal.rules.collection';
import { TesoreroSucursalesGeneralesRules } from './rules/tesoreroSucursalesGenerales.rules.collection';
import { TesoreroSucursalesForaneasRules } from './rules/tesoreroSucursalesForaneas.rules.collection';
import { ComprasRules } from './rules/compras.rules.collection';
import { DirectivosRules } from './rules/directivos.rules.collection';
import { GerenteSucursalesRules } from './rules/gerenteSucursales-rules.collection';
import { VentaGeneralRules } from './rules/ventaGeneral-rules.collection';

const domain = 'xst.mx';
/**
 * usuario unico a crear en el sistema, se crea en app service con password
 * default de .env
 */
export const SuperUsersToCreate: createUserDTO[] = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super@' + domain,
  },
];

export const AdminUsersToCreate: createUserDTO[] = [
  {
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@' + domain,
    rules: SysAdminRules.map((r) => r.value),
  },
];

export const AlmacenGeneralToCreate: createUserDTO[] = [
  {
    firstName: 'Maribel',
    lastName: 'Almacen General',
    email: 'almacengeneral@' + domain,
    rules: AlmacenGeneralRules.map((r) => r.value),
  },
];
export const SucursalToCreate: createUserDTO[] = [
  {
    firstName: 'Sucursal',
    lastName: 'Encargado de sucursal',
    email: 'sucursal@' + domain,
    rules: SucursalRules.map((r) => r.value),
  },
];
export const TesoreroSucCentralesToCreate: createUserDTO[] = [
  {
    firstName: 'Jaime',
    lastName: 'Cevallos',
    email: 'tesorerogeneral@' + domain,
    rules: TesoreroSucursalesGeneralesRules.map((r) => r.value),
  },
];
export const TesoreroSucForaneasToCreate: createUserDTO[] = [
  {
    firstName: 'Maricela',
    lastName: 'Suc Foraneas',
    email: 'tesoreroforaneo@' + domain,
    rules: TesoreroSucursalesForaneasRules.map((r) => r.value),
  },
];
export const ComprasToCreate: createUserDTO[] = [
  {
    firstName: 'Lic Lopez',
    lastName: 'Encargada de Compras',
    email: 'compras@' + domain,
    rules: ComprasRules.map((r) => r.value),
  },
];
export const DirectivosToCreate: createUserDTO[] = [
  {
    firstName: 'Directivos',
    lastName: 'Suc Generales',
    email: 'directivos@' + domain,
    rules: DirectivosRules.map((r) => r.value),
  },
];
export const GerenteSucursalesToCreate: createUserDTO[] = [
  {
    firstName: 'Gerente',
    lastName: 'De sucursales',
    email: 'gerentesucursales@' + domain,
    rules: GerenteSucursalesRules.map((r) => r.value),
  },
];

export const VentaGeneralToCreate: createUserDTO[] = [
  {
    firstName: 'Alondra',
    lastName: 'Aragon',
    email: 'ventas@' + domain,
    rules: VentaGeneralRules.map((r) => r.value),
  },
];
