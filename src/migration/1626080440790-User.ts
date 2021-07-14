import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1626080440790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp without time zone',
            isNullable: true,
          },
        ],
        indices: [{ columnNames: ['username'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true, true, true);
  }
}
