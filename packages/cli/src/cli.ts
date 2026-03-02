#!/usr/bin/env node

/**
 * RHUDS Pro CLI entry point
 */

import { Command } from 'commander';
import { version } from './index.js';

const program = new Command();

program
  .name('rhuds')
  .description('RHUDS Pro CLI - Scaffolding and development tools')
  .version(version);

program
  .command('init')
  .description('Initialize a new RHUDS Pro project')
  .action(() => {
    console.log('RHUDS Pro project initialization - Coming soon!');
  });

program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate a new component, theme, or other artifact')
  .action((type: string, name: string) => {
    console.log(`Generating ${type}: ${name} - Coming soon!`);
  });

program.parse();
