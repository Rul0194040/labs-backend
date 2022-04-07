export enum ProfileTypes {
  SUPER = 'super',
  SYSADMIN = 'sysadmin', //Adminsitrador General
  ALMACEN_GENERAL = 'almacen_general', //administra la sucursal matriz
  SUCURSAL = 'sucursal', //administrador de sucursal
  CAJA_SUCURSAL = 'caja_sucursal', //cajero de sucursal, hay varios turnos
  TESORERO_SUCURSALES_CENTRALES = 'tesorero_sucursales_centrales',
  TESORERO_SUCURSALES_FORANEAS = 'tesorero_sucursales_foraneas',
  COMPRAS = 'compras',
  VENTAS = 'ventas', //encargada general de dar de alta clientes, pacientes, facturar
  DIRECTIVOS = 'directivos',
  GERENTE_SUCURSALES = 'gerente_sucursales',
  EMPLEADO = 'empleado', //otro tipo de empleado que no tiene acceso a nada mas que el checador
}

export enum PerfilTipoEmpleado {
  GENERAL = 'general',
  CAPTADOR = 'captador',
  MAQUILADOR = 'maquilador',
  VENDEDOR = 'vendedor',
}
