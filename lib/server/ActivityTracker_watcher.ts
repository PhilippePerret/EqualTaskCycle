// lib/ActivityTracker_worker.ts
import { isUserWorkingOnProject } from './activityTracker';

self.addEventListener('message', (event: MessageEvent) => {
  const { folder, lastCheckAt } = event.data;
  const isActive = isUserWorkingOnProject(folder, lastCheckAt);
  console.log('Worker - isActive:', isActive);
  self.postMessage({ active: isActive });
});