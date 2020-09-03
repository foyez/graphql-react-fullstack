"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.all1599110812355 = void 0;
class all1599110812355 {
    constructor() {
        this.name = 'all1599110812355';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('DROP TABLE user');
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
            yield queryRunner.query(`DROP TYPE "user_gender_enum"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        });
    }
}
exports.all1599110812355 = all1599110812355;
//# sourceMappingURL=1599110812355-all.js.map