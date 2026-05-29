import { useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { toast } from 'sonner';

export default function AutoUpdater() {
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check if we are running inside Tauri. If not (e.g. running on Vercel), do nothing.
    if (!('__TAURI_INTERNALS__' in window) && !('__TAURI__' in window)) {
      return;
    }

    async function checkForUpdates() {
      try {
        setChecking(true);
        const update = await check();
        
        if (update) {
          console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`);
          
          let downloaded = 0;
          let contentLength = 0;
          
          const toastId = toast.loading(`Downloading update ${update.version}...`);

          await update.downloadAndInstall((event) => {
            switch (event.event) {
              case 'Started':
                contentLength = event.data.contentLength || 0;
                console.log(`started downloading ${event.data.contentLength} bytes`);
                break;
              case 'Progress':
                downloaded += event.data.chunkLength;
                if (contentLength > 0) {
                  const percent = Math.round((downloaded / contentLength) * 100);
                  toast.loading(`Downloading update: ${percent}%`, { id: toastId });
                }
                break;
              case 'Finished':
                console.log('download finished');
                toast.success('Update installed! Relaunching...', { id: toastId });
                break;
            }
          });

          console.log('update installed');
          await relaunch();
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      } finally {
        setChecking(false);
      }
    }

    // Delay the update check slightly so it doesn't block initial render
    const timeoutId = setTimeout(() => {
      checkForUpdates();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
