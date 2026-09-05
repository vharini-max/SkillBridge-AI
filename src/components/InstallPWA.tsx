import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface InstallPWAProps {
  variant?: 'header' | 'sidebar' | 'dashboard' | 'banner';
  className?: string;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ variant = 'header', className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'send' | 'android' | 'ios'>('send');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic URL detection
  const getDirectUrl = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.origin || window.location.href;
    }
    return 'https://ais-dev-xxsjtprqlqtrxxo27frsmz-244550274831.asia-east1.run.app';
  };

  useEffect(() => {
    // Detect iframe container
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    // Check if running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
    if (isIOSDevice) {
      setActiveTab('ios');
    }

    // Capture beforeinstallprompt event for Android / Chrome / Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Capture appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccessfully(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Draw QR code onto canvas whenever modal is opened
  useEffect(() => {
    if (showModal && canvasRef.current) {
      const url = getDirectUrl();
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#1e3a8a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) {
            console.error('QR code generation error:', error);
          }
        }
      );
    }
  }, [showModal, activeTab]);

  const handleOpenDirectTab = () => {
    const url = getDirectUrl();
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const url = getDirectUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        // Fallback for older browsers
        copyFallback(url);
      });
    } else {
      copyFallback(url);
    }
  };

  const copyFallback = (text: string) => {
    try {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleShareViaWhatsApp = () => {
    const url = getDirectUrl();
    const message = `🚀 Open & Install SkillBridge on your phone for campus placement prep:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareViaEmail = () => {
    const url = getDirectUrl();
    const subject = 'SkillBridge - College Placement App Link';
    const body = `Hi,\n\nHere is the direct link to open and install SkillBridge on your mobile phone:\n\n${url}\n\nOpen this link in Chrome or Safari and select "Add to Home Screen" to install it as an app!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleNativeShare = async () => {
    const url = getDirectUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SkillBridge - College Placement App',
          text: 'Practice placement aptitude and audit your ATS resume on SkillBridge!',
          url: url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleInstallClick = async () => {
    // If inside iframe or on iOS, show the modal guide with send link / QR code options
    if (isInIframe || isIOS) {
      setShowModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstalledSuccessfully(true);
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isStandalone) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-label-md text-xs font-bold border border-emerald-500/20">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span>App Installed on Phone</span>
        </div>
      );
    }
    return null;
  }

  const appUrl = getDirectUrl();

  return (
    <>
      {/* HEADER VARIANT */}
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`px-3 py-1.5 bg-gradient-to-r from-primary to-blue-700 hover:from-primary-fixed-dim hover:to-blue-800 text-on-primary font-bold rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs hover:shadow-md active:scale-95 ${className}`}
          title="Download & Install SkillBridge app on your mobile phone"
        >
          <span className="material-symbols-outlined text-base animate-pulse">download_for_offline</span>
          <span className="hidden sm:inline font-semibold">Download App to Phone</span>
          <span className="sm:hidden font-semibold">Install App</span>
        </button>
      )}

      {/* SIDEBAR VARIANT */}
      {variant === 'sidebar' && (
        <button
          onClick={handleInstallClick}
          className={`w-full py-2.5 px-3.5 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/30 hover:border-primary text-primary dark:text-blue-400 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-xs ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-base">install_mobile</span>
            </div>
            <div className="text-left">
              <span className="block font-bold leading-tight">Download App to Phone</span>
              <span className="text-[10px] text-on-surface-variant font-medium">Install for Android & iOS</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </button>
      )}

      {/* DASHBOARD CARD VARIANT */}
      {variant === 'dashboard' && (
        <div className={`p-4 bg-gradient-to-br from-primary/10 via-blue-50/50 to-emerald-50/50 dark:from-primary/20 dark:via-surface-container-high dark:to-emerald-950/20 border border-primary/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${className}`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 text-on-primary flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl">install_mobile</span>
            </div>
            <div>
              <h3 className="font-title-md text-sm sm:text-base font-bold text-on-surface flex items-center gap-2">
                Install SkillBridge App on Mobile
                <span className="px-2 py-0.5 bg-primary/15 text-primary text-[10px] font-bold rounded-full">PWA Ready</span>
              </h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                Access your placement prep, daily aptitude tests, and ATS resume audits offline directly from your home screen.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">download_for_offline</span>
              <span>Download App to Phone</span>
            </button>
          </div>
        </div>
      )}

      {/* BANNER VARIANT */}
      {variant === 'banner' && (
        <div className="flex items-center justify-between gap-3 p-3 bg-surface-container-high border border-primary/30 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">phone_android</span>
            <span className="text-xs font-bold text-on-surface">Install on Mobile Phone</span>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download App to Phone
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-outline-variant rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">install_mobile</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base leading-tight">Download SkillBridge App</h3>
                  <p className="text-[11px] text-on-surface-variant">Install on Android & iPhone (PWA)</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {installedSuccessfully ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h4 className="font-bold text-on-surface text-lg">App Installed Successfully!</h4>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                  SkillBridge is now added to your phone's home screen. Launch it anytime like a native mobile app!
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-2 px-6 py-2 bg-primary text-on-primary font-bold rounded-xl text-xs hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* TABS */}
                <div className="flex p-1 bg-surface-container rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTab('send')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'send'
                        ? 'bg-surface text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">send_to_mobile</span>
                    <span>Send Link / Scan</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('android')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'android'
                        ? 'bg-surface text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">android</span>
                    <span>Android</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ios')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'ios'
                        ? 'bg-surface text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">phone_iphone</span>
                    <span>iPhone</span>
                  </button>
                </div>

                {/* TAB 1: SEND LINK & SCAN QR */}
                {activeTab === 'send' && (
                  <div className="space-y-3">
                    
                    {/* Copy Link Input Bar */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant">Direct App Link:</label>
                      <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant rounded-xl p-1.5">
                        <input
                          type="text"
                          readOnly
                          value={appUrl}
                          className="flex-1 bg-transparent text-xs font-mono text-on-surface px-2 outline-none select-all truncate"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-primary-fixed-dim transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {copiedLink ? 'check' : 'content_copy'}
                          </span>
                          <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Send Buttons Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        onClick={handleShareViaWhatsApp}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>WhatsApp Link</span>
                      </button>

                      <button
                        onClick={handleShareViaEmail}
                        className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-base">mail</span>
                        <span>Email Link</span>
                      </button>

                      <button
                        onClick={handleNativeShare}
                        className="col-span-2 sm:col-span-1 p-2.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">share</span>
                        <span>Share Sheet</span>
                      </button>
                    </div>

                    {/* Scan QR Code Block */}
                    <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-4">
                      <div className="bg-white p-1.5 rounded-xl border border-outline-variant shadow-xs shrink-0 flex items-center justify-center">
                        <canvas ref={canvasRef} className="w-28 h-28" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-base">qr_code_scanner</span>
                          Scan with Phone Camera
                        </h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Point your mobile camera at this QR code to instantly open SkillBridge in Chrome or Safari.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ANDROID INSTRUCTIONS */}
                {activeTab === 'android' && (
                  <div className="space-y-3 p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <span className="material-symbols-outlined text-lg">android</span>
                      <span>Android (Google Chrome) 3-Step Setup:</span>
                    </div>
                    <ol className="space-y-2.5 text-xs text-on-surface">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Open the direct link in <strong>Google Chrome</strong> on your phone.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Tap the <strong>Chrome Menu (3 vertical dots ⋮)</strong> in the top right corner.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Tap <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>) and confirm. SkillBridge will appear in your app drawer!</span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* TAB 3: IPHONE INSTRUCTIONS */}
                {activeTab === 'ios' && (
                  <div className="space-y-3 p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <span className="material-symbols-outlined text-lg">phone_iphone</span>
                      <span>iPhone / iPad (Safari) 3-Step Setup:</span>
                    </div>
                    <ol className="space-y-2.5 text-xs text-on-surface">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Open the link in <strong>Safari</strong> on your iPhone.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 bg-surface-container-highest rounded font-bold text-[10px] text-primary">ios_share</span> at the bottom of the screen.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <span className="inline-block px-1.5 py-0.5 bg-surface-container-highest rounded font-bold text-[10px] text-primary">add_box</span>, then tap <strong>Add</strong>!</span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* MODAL FOOTER */}
                <div className="flex gap-2 pt-2 border-t border-outline-variant">
                  <button
                    onClick={handleOpenDirectTab}
                    className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs hover:bg-primary-fixed-dim transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span>Open in Direct Tab</span>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-surface-container border border-outline-variant text-on-surface font-bold rounded-xl text-xs hover:bg-surface-container-highest transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
