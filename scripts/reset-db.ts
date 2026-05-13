import process from 'node:process'
import postgres from 'postgres'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL || ''
const sql = postgres(connectionString, { prepare: false })

async function reset() {
  console.log('Dropping public schema...')
  await sql.unsafe(`DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;`)
  console.log('Dropping drizzle schema...')
  await sql.unsafe(`DROP SCHEMA IF EXISTS drizzle CASCADE;`)
  console.log('Done. Database is clean.')
  await sql.end()
}

reset().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
