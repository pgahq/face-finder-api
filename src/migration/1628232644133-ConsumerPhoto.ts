import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ConsumerPhoto1628232644133 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consumerPhoto',
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
            name: 'photoId',
            type: 'int',
          },
          {
            name: 'similarity',
            type: 'float',
          },
          {
            name: 'boxXMax',
            type: 'float',
          },
          {
            name: 'boxXMin',
            type: 'float',
          },
          {
            name: 'boxYMax',
            type: 'float',
          },
          {
            name: 'boxYMin',
            type: 'float',
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
            columnNames: ['photoId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'photo',
            onDelete: 'CASCADE',
          },
        ],
        indices: [{ columnNames: ['consumerId', 'photoId'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consumerPhoto', true, true, true);
  }
}
