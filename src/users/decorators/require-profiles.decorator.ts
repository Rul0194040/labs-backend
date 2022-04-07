import { SetMetadata } from '@nestjs/common';
/**
 * Establece el o los perfiles requeridos a nivel controller
 * en forma de metadatos, que son evaluados por el guard ProfileRulesGuard
 */
export const RequireProfiles = (...profiles: string[]) =>
  SetMetadata('required-profiles', profiles);
