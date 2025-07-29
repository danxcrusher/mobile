"use client"

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { useState, useEffect } from 'react'

export interface Transaction {
  id: number
  type: "sent" | "received"
  amount: string
  description: string
  time: string
  status: "completed" | "pending" | "failed"
  timestamp: number
}

export function useSuiWallet() {
  const account = useCurrentAccount()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get account balance using Sui dApp Kit
  const { data: balanceData, isLoading: balanceLoading } = useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address || '',
    },
    {
      enabled: !!account?.address,
    }
  )

  // Get owned objects (for transaction history)
  const { data: ownedObjects, isLoading: objectsLoading } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      options: {
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!account?.address,
    }
  )

  // Update balance when data changes
  useEffect(() => {
    if (balanceData) {
      const totalBalance = balanceData.data.reduce((acc: number, coin: any) => {
        return acc + Number(coin.balance)
      }, 0)
      setBalance(totalBalance / 1000000000) // Convert from MIST to SUI
    }
  }, [balanceData])

  // Send transaction function
  const sendTransaction = async (recipient: string, amount: number, note?: string) => {
    if (!account) {
      throw new Error('No wallet connected')
    }

    // This would integrate with Sui transaction API
    // For now, we'll simulate the transaction
    const newTransaction: Transaction = {
      id: Date.now(),
      type: "sent",
      amount: `-${amount} SUI`,
      description: note || `Sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      time: formatTimeAgo(Date.now()),
      status: "completed",
      timestamp: Date.now(),
    }

    setTransactions(prev => [newTransaction, ...prev])
    setBalance(prev => prev - amount - 0.001) // Subtract amount and network fee

    return newTransaction
  }

  // Receive transaction function (simulated)
  const receiveTransaction = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type: "received",
      amount: `+${amount} SUI`,
      description,
      time: formatTimeAgo(Date.now()),
      status: "completed",
      timestamp: Date.now(),
    }

    setTransactions(prev => [newTransaction, ...prev])
    setBalance(prev => prev + amount)

    return newTransaction
  }

  // Format time ago helper
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return {
    // Wallet state
    isConnected: !!account,
    currentAccount: account,
    walletAddress: account?.address || '',
    
    // Balance and transactions
    balance,
    transactions,
    balanceLoading,
    objectsLoading,
    
    // Loading states
    isLoading,
    
    // Functions
    sendTransaction,
    receiveTransaction,
    
    // Raw data
    balanceData,
    ownedObjects,
  }
} 