import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EventPartner1628715253905 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'eventPartner',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'eventId',
            type: 'int',
          },
          {
            name: 'partnerId',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['eventId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'event',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['partnerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'partner',
            onDelete: 'CASCADE',
          },
        ],
        indices: [{ columnNames: ['eventId', 'partnerId'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('eventPartner', true, true, true);
  }
}
