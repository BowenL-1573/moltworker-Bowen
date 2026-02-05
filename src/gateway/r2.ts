import type { Sandbox } from '@cloudflare/sandbox';
import type { MoltbotEnv } from '../types';
import { R2_MOUNT_PATH, R2_BUCKET_NAME, R2_CONNECT_MOUNT_PATH, R2_CONNECT_BUCKET_NAME } from '../config';

/**
 * Check if R2 is already mounted by looking at the mount table
 */
async function isR2Mounted(sandbox: Sandbox, mountPath: string): Promise<boolean> {
  try {
    const proc = await sandbox.startProcess(`mount | grep "s3fs on ${mountPath}"`);
    // Wait for the command to complete
    let attempts = 0;
    while (proc.status === 'running' && attempts < 10) {
      await new Promise(r => setTimeout(r, 200));
      attempts++;
    }
    const logs = await proc.getLogs();
    // If stdout has content, the mount exists
    const mounted = !!(logs.stdout && logs.stdout.includes('s3fs'));
    console.log(`isR2Mounted check for ${mountPath}:`, mounted, 'stdout:', logs.stdout?.slice(0, 100));
    return mounted;
  } catch (err) {
    console.log(`isR2Mounted error for ${mountPath}:`, err);
    return false;
  }
}

/**
 * Mount R2 bucket for persistent storage
 * 
 * @param sandbox - The sandbox instance
 * @param env - Worker environment bindings
 * @returns true if mounted successfully, false otherwise
 */
export async function mountR2Storage(sandbox: Sandbox, env: MoltbotEnv): Promise<boolean> {
  // Skip if R2 credentials are not configured
  if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.CF_ACCOUNT_ID) {
    console.log('R2 storage not configured (missing R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or CF_ACCOUNT_ID)');
    return false;
  }

  const credentials = {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  };
  const endpoint = `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  let dataSuccess = false;
  let connectSuccess = false;

  // Mount data bucket
  if (await isR2Mounted(sandbox, R2_MOUNT_PATH)) {
    console.log('R2 data bucket already mounted at', R2_MOUNT_PATH);
    dataSuccess = true;
  } else {
    try {
      console.log('Mounting R2 data bucket at', R2_MOUNT_PATH);
      await sandbox.mountBucket(R2_BUCKET_NAME, R2_MOUNT_PATH, { endpoint, credentials });
      console.log('R2 data bucket mounted successfully');
      dataSuccess = true;
    } catch (err) {
      console.error('Failed to mount R2 data bucket:', err);
      if (await isR2Mounted(sandbox, R2_MOUNT_PATH)) {
        console.log('R2 data bucket is mounted despite error');
        dataSuccess = true;
      }
    }
  }

  // Mount connect bucket
  if (await isR2Mounted(sandbox, R2_CONNECT_MOUNT_PATH)) {
    console.log('R2 connect bucket already mounted at', R2_CONNECT_MOUNT_PATH);
    connectSuccess = true;
  } else {
    try {
      console.log('Mounting R2 connect bucket at', R2_CONNECT_MOUNT_PATH);
      await sandbox.mountBucket(R2_CONNECT_BUCKET_NAME, R2_CONNECT_MOUNT_PATH, { endpoint, credentials });
      console.log('R2 connect bucket mounted successfully');
      connectSuccess = true;
    } catch (err) {
      console.error('Failed to mount R2 connect bucket:', err);
      if (await isR2Mounted(sandbox, R2_CONNECT_MOUNT_PATH)) {
        console.log('R2 connect bucket is mounted despite error');
        connectSuccess = true;
      }
    }
  }

  return dataSuccess || connectSuccess;
}
