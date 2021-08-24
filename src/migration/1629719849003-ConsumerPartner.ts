import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ConsumerPartner1629719849003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consumerPartner',
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
            name: 'partnerId',
            type: 'int',
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
            columnNames: ['partnerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'partner',
            onDelete: 'CASCADE',
          },
        ],
        indices: [{ columnNames: ['partnerId', 'consumerId'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consumerPartner', true, true, true);
  }
}
