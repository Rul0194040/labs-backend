"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../constants");
const util_1 = require("./../util");
function createStripeProvider(options) {
    return {
        provide: constants_1.stripeToken,
        useValue: util_1.getStripeClient(options),
    };
}
exports.createStripeProvider = createStripeProvider;
//# sourceMappingURL=createStripeProvider.js.map