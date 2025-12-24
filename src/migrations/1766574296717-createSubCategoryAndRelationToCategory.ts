import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubCategoryAndRelationToCategory1766574296717 implements MigrationInterface {
    name = 'CreateSubCategoryAndRelationToCategory1766574296717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sub_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "fname" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "icon" character varying, "color" character varying, "position" integer NOT NULL, "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "metaTitle" character varying, "metaDescription" character varying, "metaKey" character varying, "metaContent" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "category_id" integer, CONSTRAINT "UQ_8c775c80f1ab54eb9a211ef0b2d" UNIQUE ("name"), CONSTRAINT "UQ_a277a8005786ec7e33249860cf7" UNIQUE ("fname"), CONSTRAINT "UQ_a8e238bdcdc2df32eac3c8edc9e" UNIQUE ("slug"), CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_7a424f07f46010d3441442f7764" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_7a424f07f46010d3441442f7764"`);
        await queryRunner.query(`DROP TABLE "sub_categories"`);
    }

}
