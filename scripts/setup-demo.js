#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const demoDir = path.join(rootDir, 'demo');

console.log('📦 Setting up predictive-textarea for demo...');


// Build the package
try {
  console.log('🔨 Building the library...');
  execSync('yarn build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('❌ Failed to build the library:', error);
  process.exit(1);
}

// Create a tarball
try {
  console.log('📦 Creating tarball...');
  execSync('yarn pack', { stdio: 'inherit', cwd: rootDir });
  
  // Get the tarball name from the output
  const files = fs.readdirSync(rootDir);
  const tarball = files.find(file => file.startsWith('predictive-textarea-') && file.endsWith('.tgz'));
  
  if (!tarball) {
    throw new Error('Tarball not found after packing');
  }

  // Move the tarball to the demo directory
  const tarballPath = path.join(rootDir, tarball);
  const demoTarballPath = path.join(demoDir, tarball);
  fs.copyFileSync(tarballPath, demoTarballPath);
  
  // Install the tarball in the demo
  console.log('📥 Installing tarball in demo...');
  execSync(`yarn add file:./${tarball}`, { stdio: 'inherit', cwd: demoDir });
  
  // Clean up
  fs.unlinkSync(tarballPath);
  fs.unlinkSync(demoTarballPath);
  
  console.log('✅ Setup complete! The demo now uses the local library build.');
} catch (error) {
  console.error('❌ Failed to create or install tarball:', error);
  console.error(error);
  process.exit(1);
} 
