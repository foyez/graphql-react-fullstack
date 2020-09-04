"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlers = void 0;
exports.errorHandlers = (err) => {
    let errors;
    if (err.code === '23505') {
        const field = err.detail.match(/\(.*?\)/)[0].replace(/[()]/g, '');
        errors = [
            {
                field,
                message: `${field} already taken`,
            },
        ];
    }
    return { errors };
};
//# sourceMappingURL=errorHandlers.js.map