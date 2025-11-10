import { createApp, createIdentityProvider } from '@kottster/server';
import schema from '../../kottster-app.json';

/* 
 * For security, consider moving the secret data to environment variables.
 * See https://kottster.app/docs/deploying#before-you-deploy
 */
// Read secrets and configuration from environment variables where possible.
// This makes deployments safer (set env vars in Vercel/Render/Fly etc.)
const SECRET_KEY = process.env.KOTTSTER_SECRET_KEY || 'q1tw6h65AM03Lb1tnoH5tRqQcN4YHX4D';
const KOTTSTER_API_TOKEN = process.env.KOTTSTER_API_TOKEN || 'rw66nKewtZPD58JBwPORea4ubY3eIuup';
const IDP_FILE = process.env.KOTTSTER_IDP_FILE || 'app.db';
const IDP_JWT_SALT = process.env.KOTTSTER_IDP_JWT_SALT || 'YAJ3rzbrZ6QnYkMs';
const ROOT_USERNAME = process.env.KOTTSTER_ROOT_USERNAME || 'admin';
const ROOT_PASSWORD = process.env.KOTTSTER_ROOT_PASSWORD || 'admin';

export const app = createApp({
  schema,
  secretKey: SECRET_KEY,
  kottsterApiToken: KOTTSTER_API_TOKEN,

  /*
   * The identity provider configuration.
   * See https://kottster.app/docs/app-configuration/identity-provider
   */
  identityProvider: createIdentityProvider('sqlite', {
    fileName: IDP_FILE,

    passwordHashAlgorithm: 'bcrypt',
    jwtSecretSalt: IDP_JWT_SALT,
    
    /* The root admin user credentials */
    rootUsername: ROOT_USERNAME,
    rootPassword: ROOT_PASSWORD,
  }),
});