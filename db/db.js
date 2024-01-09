import mysql from 'mysql2'
export const db = mysql.createPool({
  host: '',
  user: 'tmp',
  password: '',
  database: 'git_single',
  port: 3306,
})