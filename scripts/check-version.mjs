import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const { version } = JSON.parse(await read('package.json'));
const lock = JSON.parse(await read('package-lock.json'));
const changelog = await read('CHANGELOG.md');
const state = await read('.agent/PROJECT_STATE.md');
if (
  !/^\d+\.\d+\.\d+$/u.test(version) ||
  lock.version !== version ||
  lock.packages[''].version !== version ||
  !changelog.includes(`## [${version}]`) ||
  !state.includes(`VERSION: ${version}`)
) {
  console.error(
    'Version mismatch. Update package.json, package-lock.json, CHANGELOG.md, and .agent/PROJECT_STATE.md together.',
  );
  process.exitCode = 1;
} else {
  console.info(`Version ${version} is consistent across code and handoff records.`);
}
