import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserDetails1626103350431 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN id SERIAL primary key NOT NULL`);
        await queryRunner.query(`ALTER TABLE users ADD COLUMN username varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE users ADD COLUMN password varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE users ADD COLUMN created_at timestamp without time zone NOT NULL`);
        await queryRunner.query(`ALTER TABLE users ADD COLUMN updated_at timestamp without time zone NOT NULL`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
