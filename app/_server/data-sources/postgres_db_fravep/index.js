import { KnexPgAdapter } from '@kottster/server';
import knex from 'knex';

/**
 * Learn more at https://knexjs.org/guide/#configuration-options
 */
const client = knex({
  client: 'pg',
  connection: 'postgresql://postgres.eeujmtngjpavpvgquwjk:rXMrexP7RVx4GHex@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"',
  searchPath: ['public'],
});

export default new KnexPgAdapter(client);