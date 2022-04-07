"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireProfiles = void 0;
const common_1 = require("@nestjs/common");
const RequireProfiles = (...profiles) => common_1.SetMetadata('required-profiles', profiles);
exports.RequireProfiles = RequireProfiles;
//# sourceMappingURL=require-profiles.decorator.js.map