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
exports.user1599140097082 = void 0;
class user1599140097082 {
    constructor() {
        this.name = 'user1599140097082';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
            yield queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'undisclosed')`);
            yield queryRunner.query(`ALTER TABLE "user" ADD "gender" "user_gender_enum" NOT NULL DEFAULT 'male'`);
        });
    }
}
exports.user1599140097082 = user1599140097082;
//# sourceMappingURL=1599140097082-user.js.map