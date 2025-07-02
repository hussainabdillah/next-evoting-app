'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'

interface WalletContextProps {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  address: string | null
  connectWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    const _provider = new ethers.BrowserProvider(window.ethereum)
    const _signer = await _provider.getSigner()
    const _address = await _signer.getAddress()

    setProvider(_provider)
    setSigner(_signer)
    setAddress(_address)
  }

  useEffect(() => {
    // Auto connect wallet if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet()
        }
      })
    }
  }, [])

  return (
    <WalletContext.Provider value={{ provider, signer, address, connectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used inside WalletProvider')
  }
  return context
}
