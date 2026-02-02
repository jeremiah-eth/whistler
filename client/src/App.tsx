import { Web3Provider } from './components/Web3Provider';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { AlertsPanel } from './components/AlertsPanel';
import { AIChat } from './components/AIChat';
import { WalletModal } from './components/WalletModal';
import { useWallet } from './hooks/useWallet';
import { Toaster } from 'sonner';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
  const { isNewUser, setIsNewUser, saveWallet, address } = useWallet();

  return (
    <Web3Provider>
      <Toaster theme="dark" richColors />
      <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
        <WalletModal
          isOpen={isNewUser}
          onClose={() => setIsNewUser(false)}
          onGenerated={saveWallet}
        />
        <AlertsPanel />
        <AIChat />
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-black italic">W</div>
              <span className="text-xl font-bold tracking-tight">Whistler</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <a href="#" className="hover:text-accent transition-colors">Home</a>
              <a href="#live-feed" className="hover:text-accent transition-colors">Live Feed</a>
              <a href="#" className="hover:text-accent transition-colors">Alerts</a>
              <a href="#" className="hover:text-accent transition-colors">Positions</a>
            </nav>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Whistler Wallet</span>
                <span className="text-xs font-mono text-accent">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Initialized'}
                </span>
              </div>
              <ConnectButton chainStatus="icon" showBalance={false} />
            </div>
          </div>
        </header>

        <main className="pt-16">
          <Hero />
          <Dashboard />
        </main>

        <footer className="border-t border-white/5 py-12 bg-black/20">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Whistler. All rights reserved. Built for Base Chain.</p>
          </div>
        </footer>
        <div className="container mx-auto px-4 py-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Autonomous OpenClaw agent monitoring Base & posting alerts to X
          </p>
        </div>
      </div>
    </Web3Provider>
  );
}

export default App;
