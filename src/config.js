require('dotenv').config()

const config = module.exports

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
}

config.knex = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    migrations: {
      tableName: 'knexMigrations',
      directory: `${__dirname}/database/migrations`
    }
  },
  production: {
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

config.staticPaths = {
  input: `${__dirname}/../static/input/`,
  output: `${__dirname}/../static/output/`
}

config.aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'us-east-1',
  bucket: process.env.AWS_BUCKET_NAME || ''
}

config.bucketBase = `${__dirname}/../.bucket/`

config.env = {
  PRD: process.env.NODE_ENV === 'production'
}
