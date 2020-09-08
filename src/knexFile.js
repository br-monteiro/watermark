require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      port: '3306',
      user: process.env.DB_USER,
      password: process.env.DB_DATABASE,
      database: process.env.DB_PASSWORD
    },
    migrations: {
      tableName: 'knexMigrations',
      directory: `${__dirname}/database/migrations`
    }
  }
}
