import { SetMetadata } from '@nestjs/common';
/**
 * @ignore
 */
export const RequireRule = (rule: string) => SetMetadata('require-rule', rule);
