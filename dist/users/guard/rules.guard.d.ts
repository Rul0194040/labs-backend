import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';
export declare class RulesGuard implements CanActivate {
    private readonly reflector;
    private readonly userService;
    constructor(reflector: Reflector, userService: UsersService);
    private logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
