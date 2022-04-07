"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("./../constants");
function InjectStripe() {
    return common_1.Inject(constants_1.stripeToken);
}
exports.InjectStripe = InjectStripe;
//# sourceMappingURL=InjectStripe.js.map