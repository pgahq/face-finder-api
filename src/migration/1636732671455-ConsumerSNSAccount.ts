import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ConsumerSNSAccount1636732671455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consumerSNSAccount',
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
            name: 'sns',
            type: 'varchar',
          },
          {
            name: 'profileUrl',
            type: 'varchar',
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
        indices: [{ columnNames: ['sns', 'consumerId'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consumerSNSAccount', true, true, true);
  }
}
