import mysql from 'mysql2'
export const db = mysql.createPool({
  host: '82.157.29.198',
  user: 'tmp',
  password: 'Tmp123#@!',
  database: 'git_single',
  port: 3306,
})