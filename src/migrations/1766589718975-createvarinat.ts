import { MigrationInterface, QueryRunner } from "typeorm";

export class Createvarinat1766589718975 implements MigrationInterface {
    name = 'Createvarinat1766589718975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "variants" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "icon" character varying, "position" integer NOT NULL, "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "attribute_id" integer, CONSTRAINT "UQ_4cfa6585ab67cbbe4af72ccffd4" UNIQUE ("name"), CONSTRAINT "PK_672d13d1a6de0197f20c6babb5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "variants" ADD CONSTRAINT "FK_4543b5d38995821b07de110563c" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variants" DROP CONSTRAINT "FK_4543b5d38995821b07de110563c"`);
        await queryRunner.query(`DROP TABLE "variants"`);
    }

}
