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
            name: 'startTime',
            type: 'timestamp',
          },
          {
            name: 'endTime',
            type: 'timestamp',
          },
          {
            name: 'gcsBucket',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updatedAt',
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
    await queryRunner.dropTable('event', true, true, true);
  }
}
