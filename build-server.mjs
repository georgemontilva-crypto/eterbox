// Build script using esbuild API instead of CLI
// This avoids permission issues with esbuild binaries

import * as esbuild from 'esbuild';

console.log('Building server with esbuild API...');

try {
  await esbuild.build({
    entryPoints: ['server/_core/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist',
    packages: 'external',
    sourcemap: false,
    minify: false,
    target: 'node18',
  });
  
  console.log('✓ Server build completed successfully!');
} catch (error) {
  console.error('Server build failed:', error);
  process.exit(1);
}
