import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class User1626080440790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "user",
      columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true
          },
          {
            name: "username",
            type: "varchar",
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: true
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
          }
      ]
  }), true);

  await queryRunner.createIndex('user', new TableIndex({
    name: "IDX_USER_NAME",
    columnNames: ["username"]
  }));

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("user", "IDX_USER_NAME");
    await queryRunner.dropTable("user");
  }
}
