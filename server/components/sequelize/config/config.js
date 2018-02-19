/**
 * Module config.js
 * Configure Sequelize
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 *
 * @see     https://github.com/sequelize/cli/blob/master/docs/README.md
 * @see     http://docs.sequelizejs.com/manual/tutorial/migrations.html#the-cli
 *
 */

module.exports = {

  'development': {
    dialect: process.env.SQL_DIALECT,
    storage: process.env.SQLITE3_STORAGE_PATH,
    host: process.env.DEV_DB_HOST,
    database: process.env.DEV_DB_NAME,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    migrationStorage: 'sequelize',
    migrationStorageTableName: process.env.DEV_MIGRATION_TABLE,
    seederStorage: 'sequelize',
    seederStorageTableName: process.env.DEV_SEEDER_TABLE,
  },

  'test': {
    dialect: process.env.SQL_DIALECT,
    storage: process.env.SQLITE3_STORAGE_PATH,
    host: process.env.TEST_DB_HOST,
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    migrationStorage: 'sequelize',
    migrationStorageTableName: process.env.TEST_MIGRATION_TABLE,
    seederStorage: 'sequelize',
    seederStorageTableName: process.env.TEST_SEEDER_TABLE,
  },

  'production': {
    dialect: process.env.SQL_DIALECT,
    storage: process.env.SQLITE3_STORAGE_PATH,
    host: process.env.PROD_DB_HOST,
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    migrationStorage: 'sequelize',
    migrationStorageTableName: process.env.PROD_MIGRATION_TABLE,
    seederStorage: 'sequelize',
    seederStorageTableName: process.env.PROD_SEEDER_TABLE,
  }
}
