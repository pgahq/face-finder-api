import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserTableName1626113081486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('users', 'user');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user', 'users');
  }
}
