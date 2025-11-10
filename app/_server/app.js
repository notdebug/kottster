import { createApp, createIdentityProvider } from '@kottster/server';
import schema from '../../kottster-app.json';

/* 
 * For security, consider moving the secret data to environment variables.
 * See https://kottster.app/docs/deploying#before-you-deploy
 */
export const app = createApp({
  schema,
  secretKey: 'q1tw6h65AM03Lb1tnoH5tRqQcN4YHX4D',
  kottsterApiToken: 'rw66nKewtZPD58JBwPORea4ubY3eIuup',

  /*
   * The identity provider configuration.
   * See https://kottster.app/docs/app-configuration/identity-provider
   */
  identityProvider: createIdentityProvider('sqlite', {
    fileName: 'app.db',

    passwordHashAlgorithm: 'bcrypt',
    jwtSecretSalt: 'YAJ3rzbrZ6QnYkMs',
    
    /* The root admin user credentials */
    rootUsername: 'admin',
    rootPassword: 'admin',
  }),
});