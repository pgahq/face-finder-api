import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddGcsBucketUniqueConstraintEvent1629146757414
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'event',
      new TableIndex({
        name: 'IDX_EVENT_GCSBUCKET',
        columnNames: ['gcsBucket'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('event', 'IDX_EVENT_GCSBUCKET');
  }
}
