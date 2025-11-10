import fs from 'fs';
import path from 'path';

// Catch-all serverless handler that tries to adapt @kottster/server exports
export default async function handler(req, res) {
  try {
    // dynamic import so Vercel bundles @kottster/server only for the function
    const mod = await import('@kottster/server');
    const { createApp, createIdentityProvider } = mod;

    // Load schema from project root
    const root = process.cwd();
    const schemaPath = path.join(root, 'kottster-app.json');
    const schemaRaw = await fs.promises.readFile(schemaPath, 'utf8');
    const schema = JSON.parse(schemaRaw);

    // read env vars (same defaults as in app/_server/app.js)
    const SECRET_KEY = process.env.KOTTSTER_SECRET_KEY || 'q1tw6h65AM03Lb1tnoH5tRqQcN4YHX4D';
    const KOTTSTER_API_TOKEN = process.env.KOTTSTER_API_TOKEN || 'rw66nKewtZPD58JBwPORea4ubY3eIuup';
    const IDP_FILE = process.env.KOTTSTER_IDP_FILE || 'app.db';
    const IDP_JWT_SALT = process.env.KOTTSTER_IDP_JWT_SALT || 'YAJ3rzbrZ6QnYkMs';
    const ROOT_USERNAME = process.env.KOTTSTER_ROOT_USERNAME || 'admin';
    const ROOT_PASSWORD = process.env.KOTTSTER_ROOT_PASSWORD || 'admin';

    // Create app instance (may be sync or async)
    const appCandidate = createApp({
      schema,
      secretKey: SECRET_KEY,
      kottsterApiToken: KOTTSTER_API_TOKEN,
      identityProvider: createIdentityProvider('sqlite', {
        fileName: IDP_FILE,
        passwordHashAlgorithm: 'bcrypt',
        jwtSecretSalt: IDP_JWT_SALT,
        rootUsername: ROOT_USERNAME,
        rootPassword: ROOT_PASSWORD,
      }),
    });

    const appObj = (appCandidate && typeof appCandidate.then === 'function') ? await appCandidate : appCandidate;

    // Try common shapes exported by frameworks/libs
    // 1) app itself is an express-style function
    if (typeof appObj === 'function') {
      return appObj(req, res);
    }

    // 2) named handler
    if (appObj && typeof appObj.handler === 'function') {
      return appObj.handler(req, res);
    }

    // 3) underlying express app stored at .app or .expressApp
    if (appObj && typeof appObj.app === 'function') {
      return appObj.app(req, res);
    }
    if (appObj && typeof appObj.expressApp === 'function') {
      return appObj.expressApp(req, res);
    }

    // 4) getter method
    if (appObj && typeof appObj.getHandler === 'function') {
      const h = appObj.getHandler();
      if (typeof h === 'function') return h(req, res);
    }

    // If none matched, return a helpful diagnostic error
    res.statusCode = 501;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({
      error: 'Could not adapt @kottster/server app to a serverless handler',
      attempted: ['function','handler','app','expressApp','getHandler']
    }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: err.message, stack: err.stack }));
  }
}
