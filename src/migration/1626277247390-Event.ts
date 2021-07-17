import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Event1626277247390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'event',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'start_time',
            type: 'timestamp',
          },
          {
            name: 'end_time',
            type: 'timestamp',
          },
          {
            name: 'gcs_bucket',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [{ columnNames: ['name'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true, true, true);
  }
}
