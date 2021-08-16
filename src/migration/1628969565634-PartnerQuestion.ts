import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PartnerQuestion1628969565634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'partnerQuestion',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'partnerId',
            type: 'int',
          },
          {
            name: 'questionId',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['questionId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'question',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['partnerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'partner',
            onDelete: 'CASCADE',
          },
        ],
        indices: [{ columnNames: ['questionId', 'partnerId'], isUnique: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('partnerQuestion', true, true, true);
  }
}
