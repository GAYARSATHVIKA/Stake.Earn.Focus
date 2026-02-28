import { ethers } from 'ethers';
import { useWeb3Store } from '../store/useStore';
import toast from 'react-hot-toast';

const MONAD_TESTNET_PARAMS = {
  chainId: '0x279f', // Example chainId for Monad Testnet (replace with actual)
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
};

export const useWeb3 = () => {
  const { setWallet, setConnecting, disconnect } = useWeb3Store();

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed');
      return;
    }

    try {
      setConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);

      setWallet(
        accounts[0],
        ethers.formatEther(balance),
        Number(network.chainId)
      );

      // Check if on Monad Testnet
      if (network.chainId !== BigInt(MONAD_TESTNET_PARAMS.chainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MONAD_TESTNET_PARAMS.chainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [MONAD_TESTNET_PARAMS],
            });
          }
        }
      }

      toast.success('Wallet connected!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to connect wallet');
      setConnecting(false);
    }
  };

  return { connectWallet, disconnect };
};
