import {MigrationInterface, QueryRunner} from "typeorm";

export class user1599140097082 implements MigrationInterface {
    name = 'user1599140097082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'undisclosed')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" "user_gender_enum" NOT NULL DEFAULT 'male'`);
    }

}
