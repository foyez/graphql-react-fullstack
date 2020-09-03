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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const createServer_1 = require("./createServer");
const Post_1 = require("./entity/Post");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'foyez',
        password: 'testpass',
        database: 'graphql-full-stack',
        logging: true,
        migrations: [path_1.default.join(__dirname, './migration/*')],
        entities: [User_1.User, Post_1.Post],
    });
    const server = yield createServer_1.createServer();
    server.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map