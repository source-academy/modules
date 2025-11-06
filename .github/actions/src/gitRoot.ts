import { getExecOutput } from '@actions/exec';

// Not using the repotools version since this uses @action/exec instead of
// calling execFile from child_process
export async function getGitRoot() {
  const { stdout } = await getExecOutput('git rev-parse --show-toplevel');
  return stdout.trim();
}

/**
 * Path to the root of the git repository
 */
export const gitRoot = await getGitRoot();