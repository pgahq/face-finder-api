import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Consumer1626791969041 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'consumer',
              columns: [
                {
                  name: 'id',
                  type: 'serial',
                  isPrimary: true,
                },
                {
                  name: 'email',
                  type: 'varchar',
                },
                {
                    name: 'selfie_uuid',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                  name: 'created_at',
                  type: 'timestamp',
                  isNullable: true,
                },
                {
                  name: 'updated_at',
                  type: 'timestamp',
                  isNullable: true,
                },
              ],
              indices: [{ columnNames: ['email'], isUnique: true }],
            }),
            true,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('consumer', true, true, true);
    }

}
