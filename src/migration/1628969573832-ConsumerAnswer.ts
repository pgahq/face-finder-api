import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ConsumerAnswer1628969573832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consumerAnswer',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'consumerId',
            type: 'int',
          },
          {
            name: 'questionId',
            type: 'int',
          },
          {
            name: 'answer',
            type: 'text',
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
        foreignKeys: [
          {
            columnNames: ['consumerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'consumer',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['questionId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'question',
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          { columnNames: ['questionId', 'consumerId'], isUnique: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consumerAnswer', true, true, true);
  }
}
