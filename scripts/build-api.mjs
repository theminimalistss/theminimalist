import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

const OUT = 'dist-api';
const RUNTIME = ['.htaccess', 'app', 'public', 'storage/.gitignore', '.env.example'];

await rm(OUT, { recursive: true, force: true });
for (const entry of RUNTIME) {
  await cp(`server/${entry}`, `${OUT}/${entry}`, { recursive: true });
}
await mkdir(`${OUT}/storage`, { recursive: true });
await writeFile(
  `${OUT}/UPLOAD.txt`,
  `Upload everything in this folder, including .htaccess, to the PHP subdomain's public_html.
Create .env from .env.example in the folder above public_html, then delete this file.
`,
);
console.info(`${OUT}/ is ready to upload to the PHP host. No secrets are included.`);
