import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Photo1628231165715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'photo',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'eventId',
            type: 'int',
          },
        ],
        indices: [{ columnNames: ['filename'], isUnique: true }],
        foreignKeys: [
          {
            columnNames: ['eventId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'event',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('photo', true, true, true);
  }
}
