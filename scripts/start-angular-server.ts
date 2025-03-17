import { spawn, ChildProcess } from 'child_process';

const angularServer: ChildProcess = spawn('npm', ['start'], {
  stdio: 'pipe',
  shell: true
});

// Wait for the server to be ready
const waitForServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Angular server failed to start within 30 seconds'));
    }, 30000);

    angularServer.stdout?.on('data', (data) => {
      if (data.toString().includes('Compiled successfully')) {
        clearTimeout(timeout);
        resolve();
      }
    });

    angularServer.stderr?.on('data', (data) => {
      console.error('Angular server error:', data.toString());
    });

    angularServer.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
};

// Handle server process
process.on('SIGTERM', () => {
  angularServer.kill();
  process.exit(0);
});

export { angularServer, waitForServer }; 