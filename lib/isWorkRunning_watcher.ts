import { parentPort } from 'worker_threads';
import { isUserWorkingOnProject } from './isWorkRunning.ts';


parentPort && parentPort.on('message', (data) => {
  const { folder, lastCheckAt } = data;
  
  const isActive = isUserWorkingOnProject(folder, lastCheckAt);
  
  parentPort && parentPort.postMessage({ active: isActive });
});
