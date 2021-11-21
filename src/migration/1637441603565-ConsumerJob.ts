import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ConsumerJob1637441603565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consumerJob',
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
            name: 'jobId',
            type: 'int',
          },
          {
            name: 'status',
            type: 'boolean',
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
        ],
        indices: [{ columnNames: ['jobId', 'consumerId'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consumerJob', true, true, true);
  }
}
