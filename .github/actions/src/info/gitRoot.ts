import { getExecOutput } from '@actions/exec';

export default async function getGitRoot() {
  const { stdout } = await getExecOutput('git rev-parse --show-toplevel');
  return stdout.trim();
}
