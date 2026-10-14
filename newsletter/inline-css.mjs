#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { watch } from 'chokidar';

const require = createRequire(import.meta.url);
const juicePackagePath = require.resolve('juice/package.json');
const juiceCommand = path.join(path.dirname(juicePackagePath), 'bin/juice');
const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const [htmlArgument, cssArgument, outputArgument, ...extraArguments] = args.filter(argument => argument !== '--watch');

function showUsage() {
  console.error('Usage: npm run build -- <input.html> <input.css> [output.html]');
  console.error('       npm run watch -- <input.html> <input.css> [output.html]');
}

if (!htmlArgument || !cssArgument || extraArguments.length > 0) {
  showUsage();
  process.exitCode = 1;
} else {
  const htmlPath = path.resolve(htmlArgument);
  const cssPath = path.resolve(cssArgument);
  const outputPath = outputArgument
    ? path.resolve(outputArgument)
    : path.join(path.dirname(htmlPath), `${path.basename(htmlPath, path.extname(htmlPath))}.inlined.html`);

  if (new Set([htmlPath, cssPath]).has(outputPath)) {
    console.error('Error: output must be a different file from the HTML and CSS sources.');
    process.exitCode = 1;
  } else if (!existsSync(htmlPath) || !existsSync(cssPath)) {
    console.error('Error: the input HTML and CSS files must both exist.');
    process.exitCode = 1;
  } else {
    function build() {
      mkdirSync(path.dirname(outputPath), { recursive: true });
      const result = spawnSync(process.execPath, [juiceCommand, '--css', cssPath, htmlPath, outputPath], {
        stdio: 'inherit'
      });

      if (result.error) {
        throw result.error;
      }
      if (result.status !== 0) {
        throw new Error(`Juice exited with status ${result.status ?? 'unknown'}.`);
      }
    }

    try {
      build();

      if (watchMode) {
        console.log(`Watching ${htmlPath} and ${cssPath}`);
        const watcher = watch([htmlPath, cssPath], {
          awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 }
        });
        let rebuildTimer;

        watcher.on('change', () => {
          clearTimeout(rebuildTimer);
          rebuildTimer = setTimeout(() => {
            try {
              build();
            } catch (error) {
              console.error(`Error: ${error.message}`);
            }
          }, 100);
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    }
  }
}