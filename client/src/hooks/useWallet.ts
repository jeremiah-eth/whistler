import { useState, useEffect } from 'react';
import { mnemonicToAccount } from 'viem/accounts';

export function useWallet() {
    const [address, setAddress] = useState<string | null>(null);
    const [mnemonic, setMnemonic] = useState<string | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const savedWallet = localStorage.getItem('whistler_wallet');
        if (savedWallet) {
            try {
                const { address, mnemonic } = JSON.parse(savedWallet);
                setAddress(address);
                setMnemonic(mnemonic);
            } catch (e) {
                console.error('Failed to load wallet', e);
            }
        } else {
            setIsNewUser(true);
        }
    }, []);

    const saveWallet = (address: string, mnemonic: string) => {
        localStorage.setItem('whistler_wallet', JSON.stringify({ address, mnemonic }));
        setAddress(address);
        setMnemonic(mnemonic);
        setIsNewUser(false);
    };

    const getAccount = () => {
        if (!mnemonic) return null;
        return mnemonicToAccount(mnemonic);
    };

    return {
        address,
        mnemonic,
        isNewUser,
        saveWallet,
        getAccount,
        setIsNewUser
    };
}
