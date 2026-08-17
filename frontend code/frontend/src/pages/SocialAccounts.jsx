import React, { useState, useEffect } from 'react';
import { 
  IoLogoFacebook, 
  IoLogoInstagram, 
  IoLogoLinkedin, 
  IoLogoTwitter, 
  IoAddOutline, 
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoLockClosedOutline
} from 'react-icons/io5';

import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useNotification } from '../hooks/useNotification';
import socialAccountService from '../services/socialAccountService';

const PLATFORMS_CONFIG = {
  facebook: { name: 'Facebook Page', icon: IoLogoFacebook, color: 'text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/20 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/20', themeColor: '#1877F2' },
  instagram: { name: 'Instagram Profile', icon: IoLogoInstagram, color: 'text-[#E4405F] bg-[#E4405F]/10 border-[#E4405F]/20 hover:border-[#E4405F]/50 hover:bg-[#E4405F]/20', themeColor: '#E4405F' },
  linkedin: { name: 'LinkedIn Company', icon: IoLogoLinkedin, color: 'text-[#0A66C2] bg-[#0A66C2]/10 border-[#0A66C2]/20 hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/20', themeColor: '#0A66C2' },
  twitter: { name: 'Twitter/X Account', icon: IoLogoTwitter, color: 'text-slate-800 dark:text-slate-200 bg-slate-500/10 border-slate-500/20 hover:border-slate-500/50 hover:bg-slate-500/20', themeColor: '#1E293B' }
};

const SocialAccounts = () => {
  const { success, error: notifyError } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  
  const [activePlatform, setActivePlatform] = useState('facebook');
  const [accountHandle, setAccountHandle] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await socialAccountService.getAccounts();
      setAccounts(data);
    } catch (err) {
      notifyError("Failed to fetch connected accounts.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConnect = (platform) => {
    setActivePlatform(platform);
    setAccountHandle('');
    setIsConnectModalOpen(true);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!accountHandle.trim()) {
      notifyError("Please enter a valid account handle or name.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate account ID and access tokens
      const mockId = `${activePlatform.substring(0, 3)}_${Math.floor(Math.random() * 900000 + 100000)}`;
      const payload = {
        platform: activePlatform,
        account_name: accountHandle.startsWith('@') ? accountHandle : `@${accountHandle}`,
        account_id: mockId,
        access_token: `mock_tok_${Math.random().toString(36).substring(7)}`,
        refresh_token: `mock_ref_${Math.random().toString(36).substring(7)}`,
        status: 'Connected'
      };

      await socialAccountService.connectAccount(payload);
      success(`${PLATFORMS_CONFIG[activePlatform].name} linked successfully!`);
      setIsConnectModalOpen(false);
      loadAccounts();
    } catch (err) {
      notifyError("Failed to connect social account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDisconnect = (account) => {
    setSelectedAccount(account);
    setIsDisconnectModalOpen(true);
  };

  const handleDisconnect = async () => {
    if (!selectedAccount) return;
    setIsSubmitting(true);
    try {
      await socialAccountService.disconnectAccount(selectedAccount.id);
      success("Account disconnected successfully.");
      setIsDisconnectModalOpen(false);
      loadAccounts();
    } catch (err) {
      notifyError("Failed to disconnect social account.");
    } finally {
      setIsSubmitting(false);
      setSelectedAccount(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      <PageHeader 
        title="Social Channels & Accounts"
        description="Link, synchronize, and oversee connected profiles across networks for unified posting."
      />

      {/* Connection Info Alert Box */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold">
        <IoInformationCircleOutline className="text-lg flex-shrink-0" />
        <div className="leading-relaxed">
          <span className="font-extrabold block mb-0.5">Mock OAuth Connections Enabled</span>
          Because this is a demonstration environment, connection triggers a simulated authorization screen. No real password inputs are required. Documented real OAuth APIs remain configured for enterprise deployment.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connected accounts display */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card title="Connected Channels" subtitle="Manage your active publishing profiles">
            {accounts.length > 0 ? (
              <div className="flex flex-col gap-4 mt-2">
                {accounts.map((account) => {
                  const cfg = PLATFORMS_CONFIG[account.platform.toLowerCase()] || PLATFORMS_CONFIG.facebook;
                  const Icon = cfg.icon;
                  return (
                    <div 
                      key={account.id}
                      className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-100 dark:border-dark-700/30 bg-white dark:bg-dark-800/20 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${cfg.color}`}>
                          <Icon />
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{cfg.name}</h4>
                          <div className="flex items-center gap-2.5 mt-1">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{account.account_name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-dark-600" />
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">ID: {account.account_id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-emerald-500 px-3 py-1 rounded-full bg-emerald-500/10">
                          {account.status || 'Connected'}
                        </span>
                        <button
                          onClick={() => handleOpenDisconnect(account)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                          title="Disconnect Account"
                        >
                          <IoTrashOutline className="text-base" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-dark-900 flex items-center justify-center text-slate-400 text-2xl mb-4">
                  <IoInformationCircleOutline />
                </div>
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400">No social channels linked</h5>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-sm leading-relaxed">
                  Connect your business profiles from the panel to start scheduling updates and monitoring analytics datasets.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Link Profile Action Panel */}
        <div className="flex flex-col gap-6">
          <Card title="Add Social Channel" subtitle="Integrate profile pages to publish posts">
            <div className="grid grid-cols-2 gap-3.5 mt-2">
              {Object.keys(PLATFORMS_CONFIG).map((platform) => {
                const cfg = PLATFORMS_CONFIG[platform];
                const Icon = cfg.icon;
                const isLinked = accounts.some(acc => acc.platform.toLowerCase() === platform);
                
                return (
                  <button
                    key={platform}
                    onClick={() => handleOpenConnect(platform)}
                    className={`flex flex-col items-center gap-3.5 p-5.5 rounded-2xl border text-center transition-all ${cfg.color} relative`}
                  >
                    <Icon className="text-2xl" />
                    <span className="text-[10px] font-bold tracking-tight">{cfg.name.split(' ')[0]}</span>
                    
                    {isLinked && (
                      <span className="absolute top-2.5 right-2.5 text-emerald-500 text-sm">
                        <IoCheckmarkCircleOutline />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

      {/* simulated OAuth connection Modal */}
      {isConnectModalOpen && (
        <Modal 
          isOpen={isConnectModalOpen} 
          onClose={() => setIsConnectModalOpen(false)}
          title={`Link ${PLATFORMS_CONFIG[activePlatform].name}`}
        >
          <form onSubmit={handleConnect} className="flex flex-col gap-5 select-none">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-900 flex items-start gap-3">
              <IoLockClosedOutline className="text-xl text-primary-500 flex-shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                Authorization request: SocialPilot requires permission to pull metrics and post schedules to your public <span className="font-extrabold">{PLATFORMS_CONFIG[activePlatform].name}</span> stream.
              </div>
            </div>

            <Input 
              id="handle"
              label="Account Handle or Name"
              placeholder={activePlatform === 'instagram' || activePlatform === 'twitter' ? 'e.g. socialpilot_dev' : 'e.g. SocialPilot Dev Page'}
              value={accountHandle}
              onChange={(e) => setAccountHandle(e.target.value)}
              required
              autoFocus
            />

            <div className="flex justify-end gap-3.5 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsConnectModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm"
                isLoading={isSubmitting}
              >
                Authorize & Link
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Disconnection confirmation modal */}
      {isDisconnectModalOpen && (
        <Modal
          isOpen={isDisconnectModalOpen}
          onClose={() => setIsDisconnectModalOpen(false)}
          title="Disconnect Social Account"
        >
          <div className="flex flex-col gap-5 select-none">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Are you sure you want to disconnect <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedAccount?.account_name}</span> from the SocialPilot workflow? This will prevent scheduled updates from publishing.
            </p>

            <div className="flex justify-end gap-3.5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDisconnectModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleDisconnect}
                isLoading={isSubmitting}
              >
                Confirm Disconnect
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default SocialAccounts;
