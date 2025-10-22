import { test, expect } from 'bun:test';
import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';

test('Worker détecte pas d\'activité', async () => {
  const worker = new Worker('./lib/isWorkRunning_watcher.ts');
  const testFolder = path.resolve('.');
  
  worker.postMessage({ folder: testFolder, lastCheckAt: Date.now() });
  
  const result = await new Promise((resolve) => {
    worker.once('message', resolve);
  });
  
  expect(result.active).toBe(false);
  worker.terminate();
});

test('Worker détecte activité récente', async () => {
  const worker = new Worker('./lib/isWorkRunning_watcher.ts');
  const testFolder = path.resolve('.');
  const testFile = path.join(testFolder, 'test-temp.txt');
  
  fs.writeFileSync(testFile, 'test');
  
  worker.postMessage({ folder: testFolder, lastCheckAt: Date.now() - 1000 });
  
  const result = await new Promise((resolve) => {
    worker.once('message', resolve);
  });
  
  expect(result.active).toBe(true);
  fs.unlinkSync(testFile);
  worker.terminate();
});