"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireUser = void 0;
const common_1 = require("@nestjs/common");
const RequireUser = () => common_1.SetMetadata('requireUser', true);
exports.RequireUser = RequireUser;
//# sourceMappingURL=require-user.decorator.js.map