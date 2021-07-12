import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserDetails1626103350431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'id',
        type: 'serial',
        isPrimary: true,
      }),
      new TableColumn({
        name: 'username',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'password',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'id');
    await queryRunner.dropColumn('users', 'username');
    await queryRunner.dropColumn('users', 'password');
    await queryRunner.dropColumn('users', 'created_at');
    await queryRunner.dropColumn('users', 'updated_at');
  }
}
