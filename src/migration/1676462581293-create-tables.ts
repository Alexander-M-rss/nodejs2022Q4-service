import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTables1676462581293 implements MigrationInterface {
  name = 'createTables1676462581293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artistId" uuid, "albumId" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favsArtist" ("artistId" uuid NOT NULL, CONSTRAINT "UQ_dfe84daab129fead66a97e3ff9d" UNIQUE ("artistId"), CONSTRAINT "PK_dfe84daab129fead66a97e3ff9d" PRIMARY KEY ("artistId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favsAlbum" ("albumId" uuid NOT NULL, CONSTRAINT "UQ_68ef4ecf457a2e3ea9b272ed39c" UNIQUE ("albumId"), CONSTRAINT "PK_68ef4ecf457a2e3ea9b272ed39c" PRIMARY KEY ("albumId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favsTrack" ("trackId" uuid NOT NULL, CONSTRAINT "UQ_2a38ab1688692b24419e21f7e46" UNIQUE ("trackId"), CONSTRAINT "PK_2a38ab1688692b24419e21f7e46" PRIMARY KEY ("trackId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favsArtist" ADD CONSTRAINT "FK_dfe84daab129fead66a97e3ff9d" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favsAlbum" ADD CONSTRAINT "FK_68ef4ecf457a2e3ea9b272ed39c" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favsTrack" ADD CONSTRAINT "FK_2a38ab1688692b24419e21f7e46" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favsTrack" DROP CONSTRAINT "FK_2a38ab1688692b24419e21f7e46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favsAlbum" DROP CONSTRAINT "FK_68ef4ecf457a2e3ea9b272ed39c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favsArtist" DROP CONSTRAINT "FK_dfe84daab129fead66a97e3ff9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "favsTrack"`);
    await queryRunner.query(`DROP TABLE "favsAlbum"`);
    await queryRunner.query(`DROP TABLE "favsArtist"`);
    await queryRunner.query(`DROP TABLE "track"`);
  }
}
