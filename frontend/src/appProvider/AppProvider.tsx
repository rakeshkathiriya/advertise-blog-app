import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { RoutesHolder } from '../routes/RoutesHolder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
});

const isIOS = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
};

const isInStandaloneMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
};

const isMobile = () => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
};

export const AppProvider = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (isInStandaloneMode()) {
      console.log('✅ App already installed');
      return;
    }

    // Detect iOS
    const iosDetected = isIOS();
    setIsIosDevice(iosDetected);

    let promptEventFired = false;

    const handleBeforeInstall = (e: Event) => {
      console.log('✅ beforeinstallprompt event fired!');
      e.preventDefault();
      promptEventFired = true;
      setDeferredPrompt(e);

      // Show prompt after user interaction
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    const handleAppInstalled = () => {
      console.log('✅ App installed successfully!');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS or if beforeinstallprompt doesn't fire after some time
    const fallbackTimer = setTimeout(() => {
      if (!promptEventFired && !isInStandaloneMode()) {
        console.log('⚠️ beforeinstallprompt not fired, showing fallback for mobile:', isMobile());
        if (isMobile() || iosDetected) {
          setShowPrompt(true);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    console.log('Install clicked. Has deferredPrompt:', !!deferredPrompt, 'Is iOS:', isIosDevice);

    // For iOS devices - show instructions
    if (isIosDevice) {
      // Don't close the modal, just show the instructions in a better way
      return; // Instructions are shown in the modal for iOS
    }

    // For Android/Desktop Chrome with native prompt
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        console.log('Showing native install prompt...');
        await (deferredPrompt as any).prompt();
        const { outcome } = await (deferredPrompt as any).userChoice;
        console.log('User choice:', outcome);

        if (outcome === 'accepted') {
          console.log('✅ User accepted the install');
        } else {
          console.log('❌ User dismissed the install');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('Error during install:', error);
        alert("Installation failed. Please try using your browser's menu to install.");
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    // Fallback for browsers without native prompt
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';

    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      instructions = 'Chrome:\n1. Tap the menu (⋮) in the top right\n2. Select "Install app" or "Add to Home screen"';
    } else if (userAgent.includes('firefox')) {
      instructions = 'Firefox:\n1. Tap the menu (☰)\n2. Select "Install"';
    } else if (userAgent.includes('samsung')) {
      instructions = 'Samsung Internet:\n1. Tap the menu\n2. Select "Add page to" → "Home screen"';
    } else {
      instructions = 'Please look for "Install" or "Add to Home screen" option in your browser menu.';
    }

    alert(`To install this app:\n\n${instructions}`);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RoutesHolder />

      {/* Install Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center p-0 sm:items-center sm:p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl"
              style={{
                padding: '2rem 1.5rem',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="mb-5 flex justify-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg sm:h-20 sm:w-20"
                  style={{
                    background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
                  }}
                >
                  <Download className="h-8 w-8 text-white sm:h-10 sm:w-10" />
                </div>
              </div>

              <h2
                className="mb-2 text-center font-bold"
                style={{
                  fontSize: '1.5rem',
                  color: '#0f766e',
                  letterSpacing: '-0.3px',
                }}
              >
                Install Advertise App
              </h2>

              <p
                className="mb-6 px-2 text-center"
                style={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                }}
              >
                {isIosDevice
                  ? 'Add to your home screen for quick access'
                  : 'Install for faster access and best experience'}
              </p>

              {/* iOS Instructions */}
              {isIosDevice ? (
                <div className="mb-6 space-y-3 rounded-xl bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <span className="text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Tap the <strong>Share button</strong>
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-gray-500">(at the bottom or top of Safari)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <span className="text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Scroll and tap <strong>"Add to Home Screen"</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <span className="text-lg">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Tap <strong>"Add"</strong> to confirm
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Android/Desktop Install Button
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all active:scale-95"
                  style={{
                    backgroundColor: '#0f766e',
                    color: 'white',
                    fontSize: '1rem',
                    opacity: isInstalling ? 0.7 : 1,
                    cursor: isInstalling ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isInstalling ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                      />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Install Now
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleClose}
                className="w-full rounded-xl py-3 font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '0.95rem',
                }}
              >
                {isIosDevice ? 'Maybe Later' : 'Not Now'}
              </button>

              <p
                className="mt-5 text-center"
                style={{
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                }}
              >
                Free • Fast • No Ads
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={1000} hideProgressBar theme="colored" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
