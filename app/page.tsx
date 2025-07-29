"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSuiWallet } from "@/hooks/use-sui-wallet"
import { SuiWalletConnect } from "@/components/sui-wallet-connect"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Search,
  Wallet,
  Shield,
  Zap,
  Globe,
  Droplets,
  ShoppingCart,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface WaterPackage {
  id: string
  name: string
  size: string
  price: number
  description: string
  image: string
}

interface PurchasedWater {
  id: string
  packageId: string
  packageName: string
  size: string
  purchaseDate: string
  redeemCode: string
  status: "active" | "redeemed" | "expired"
  expiryDate: string
}

export default function PaymentApp() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentView, setCurrentView] = useState("home") // "home", "send", "receive", "convert", "connect", "water", "redeem"
  const [copied, setCopied] = useState(false)
  const [suiToNairaRate, setSuiToNairaRate] = useState(850) // Default rate
  const [loadingRate, setLoadingRate] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [purchasedWater, setPurchasedWater] = useState<PurchasedWater[]>([])
  const [selectedPackage, setSelectedPackage] = useState<WaterPackage | null>(null)
  const [copiedCode, setCopiedCode] = useState("")

  // Use the new Sui wallet hook
  const {
    isConnected,
    walletAddress,
    balance,
    transactions,
    sendTransaction,
    receiveTransaction,
    balanceLoading,
  } = useSuiWallet()

  const [sendForm, setSendForm] = useState({
    recipient: "",
    amount: "",
    note: "",
  })
  const [convertForm, setConvertForm] = useState({
    suiAmount: "",
    nairaAmount: "",
    selectedBank: "",
    accountNumber: "",
    accountName: "",
  })

  // Check if wallet is connected on component mount
  useEffect(() => {
    if (!isConnected) {
      setCurrentView("connect")
    }
  }, [isConnected])

  // Water packages available for purchase
  const waterPackages: WaterPackage[] = [
    {
      id: "small",
      name: "Pure Water",
      size: "500ml",
      price: 0.001,
      description: "Perfect for personal hydration",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "medium",
      name: "Family Pack",
      size: "1.5L",
      price: 0.003,
      description: "Great for small families",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "large",
      name: "Party Pack",
      size: "5L",
      price: 0.008,
      description: "Perfect for gatherings",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "jumbo",
      name: "Bulk Water",
      size: "20L",
      price: 0.025,
      description: "Best value for offices",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Comprehensive list of Nigerian banks and mobile wallets
  const banksAndWallets = [
    // Traditional Banks
    { id: "access", name: "Access Bank", type: "bank", code: "044" },
    { id: "gtb", name: "Guaranty Trust Bank (GTB)", type: "bank", code: "058" },
    { id: "zenith", name: "Zenith Bank", type: "bank", code: "057" },
    { id: "uba", name: "United Bank of Africa (UBA)", type: "bank", code: "033" },
    { id: "firstbank", name: "First Bank of Nigeria", type: "bank", code: "011" },
    { id: "fidelity", name: "Fidelity Bank", type: "bank", code: "070" },
    { id: "sterling", name: "Sterling Bank", type: "bank", code: "232" },
    { id: "union", name: "Union Bank of Nigeria", type: "bank", code: "032" },
    { id: "fcmb", name: "First City Monument Bank (FCMB)", type: "bank", code: "214" },
    { id: "ecobank", name: "Ecobank Nigeria", type: "bank", code: "050" },
    { id: "stanbic", name: "Stanbic IBTC Bank", type: "bank", code: "221" },
    { id: "standard", name: "Standard Chartered Bank", type: "bank", code: "068" },
    { id: "citibank", name: "Citibank Nigeria", type: "bank", code: "023" },
    { id: "heritage", name: "Heritage Bank", type: "bank", code: "030" },
    { id: "keystone", name: "Keystone Bank", type: "bank", code: "082" },
    { id: "polaris", name: "Polaris Bank", type: "bank", code: "076" },
    { id: "wema", name: "Wema Bank", type: "bank", code: "035" },
    { id: "unity", name: "Unity Bank", type: "bank", code: "215" },
    { id: "suntrust", name: "SunTrust Bank", type: "bank", code: "100" },

    // Digital/New Generation Banks
    { id: "kuda", name: "Kuda Bank", type: "digital", code: "50211" },
    { id: "vfd", name: "VFD Microfinance Bank", type: "digital", code: "566" },
    { id: "carbon", name: "Carbon (Formerly One Finance)", type: "digital", code: "565" },
    { id: "rubies", name: "Rubies Bank", type: "digital", code: "125" },
    { id: "sparkle", name: "Sparkle Microfinance Bank", type: "digital", code: "51310" },
    { id: "mint", name: "Mint MFB", type: "digital", code: "50304" },
    { id: "parallex", name: "Parallex Bank", type: "digital", code: "104" },
    { id: "titan", name: "Titan Trust Bank", type: "digital", code: "102" },
    { id: "providus", name: "Providus Bank", type: "digital", code: "101" },
    { id: "globus", name: "Globus Bank", type: "digital", code: "103" },
    { id: "premium", name: "PremiumTrust Bank", type: "digital", code: "105" },
    { id: "lotus", name: "Lotus Bank", type: "digital", code: "304" },
    { id: "taj", name: "TAJ Bank", type: "digital", code: "302" },
    { id: "jaiz", name: "Jaiz Bank", type: "digital", code: "301" },

    // Mobile Wallets & Fintech
    { id: "opay", name: "OPay", type: "wallet", code: "999992" },
    { id: "palmpay", name: "PalmPay", type: "wallet", code: "999991" },
    { id: "kuda_wallet", name: "Kuda Wallet", type: "wallet", code: "50211" },
    { id: "piggyvest", name: "PiggyVest", type: "wallet", code: "50305" },
    { id: "cowrywise", name: "Cowrywise", type: "wallet", code: "50207" },
    { id: "carbon_wallet", name: "Carbon Wallet", type: "wallet", code: "565" },
    { id: "fairmoney", name: "FairMoney", type: "wallet", code: "51318" },
    { id: "renmoney", name: "Renmoney", type: "wallet", code: "50203" },
    { id: "mtn_momo", name: "MTN Mobile Money", type: "wallet", code: "120001" },
    { id: "airtel_money", name: "Airtel Money", type: "wallet", code: "120002" },
    { id: "9mobile_money", name: "9mobile Money", type: "wallet", code: "120003" },
    { id: "glo_money", name: "Glo Money", type: "wallet", code: "120004" },
    { id: "paga", name: "Paga", type: "wallet", code: "327" },
    { id: "quickteller", name: "Quickteller Wallet", type: "wallet", code: "51211" },
    { id: "eyowo", name: "Eyowo", type: "wallet", code: "50126" },
    { id: "gomoney", name: "GoMoney", type: "wallet", code: "100022" },
    { id: "alat", name: "ALAT by Wema", type: "wallet", code: "035A" },
    { id: "v_bank", name: "V Bank", type: "wallet", code: "51229" },
    { id: "moniepoint", name: "Moniepoint", type: "wallet", code: "50515" },
    { id: "teamapt", name: "TeamApt (AptPay)", type: "wallet", code: "51269" },
    { id: "flutterwave", name: "Flutterwave Barter", type: "wallet", code: "FLW" },
    { id: "paystack", name: "Paystack", type: "wallet", code: "PSK" },

    // Microfinance Banks
    { id: "lapo", name: "LAPO Microfinance Bank", type: "microfinance", code: "50563" },
    { id: "accion", name: "Accion Microfinance Bank", type: "microfinance", code: "602" },
    { id: "ab_microfinance", name: "AB Microfinance Bank", type: "microfinance", code: "51204" },
    { id: "aella", name: "Aella Credit", type: "microfinance", code: "51311" },
    { id: "bowen", name: "Bowen Microfinance Bank", type: "microfinance", code: "50931" },
    { id: "cemcs", name: "CEMCS Microfinance Bank", type: "microfinance", code: "50823" },
    { id: "empire", name: "Empire Trust Microfinance Bank", type: "microfinance", code: "50739" },
    { id: "fortis", name: "Fortis Microfinance Bank", type: "microfinance", code: "501" },
    { id: "grooming", name: "Grooming Microfinance Bank", type: "microfinance", code: "50840" },
    { id: "hasal", name: "Hasal Microfinance Bank", type: "microfinance", code: "50383" },
    { id: "ibile", name: "Ibile Microfinance Bank", type: "microfinance", code: "51244" },
    { id: "ikire", name: "Ikire Microfinance Bank", type: "microfinance", code: "50439" },
    { id: "imsu", name: "IMSU Microfinance Bank", type: "microfinance", code: "51299" },
    { id: "infinity", name: "Infinity Microfinance Bank", type: "microfinance", code: "50457" },
    { id: "jubilee", name: "Jubilee-Life Microfinance Bank", type: "microfinance", code: "50815" },
    { id: "mayfair", name: "Mayfair MFB", type: "microfinance", code: "50563" },
    { id: "mutual", name: "Mutual Benefits Microfinance Bank", type: "microfinance", code: "50896" },
    { id: "npf", name: "NPF Microfinance Bank", type: "microfinance", code: "50629" },
    { id: "ohafia", name: "Ohafia Microfinance Bank", type: "microfinance", code: "50864" },
    { id: "peace", name: "Peace Microfinance Bank", type: "microfinance", code: "50743" },
    { id: "personal", name: "Personal Trust MFB", type: "microfinance", code: "51146" },
    { id: "regent", name: "Regent Microfinance Bank", type: "microfinance", code: "50502" },
    { id: "rephidim", name: "Rephidim Microfinance Bank", type: "microfinance", code: "50994" },
    { id: "safe_haven", name: "Safe Haven MFB", type: "microfinance", code: "51113" },
    { id: "shield", name: "Shield MFB", type: "microfinance", code: "50582" },
    { id: "stanford", name: "Stanford Microfinance Bank", type: "microfinance", code: "50801" },
    { id: "stellas", name: "Stellas MFB", type: "microfinance", code: "51253" },
    { id: "trust", name: "Trust Microfinance Bank", type: "microfinance", code: "51269" },
    { id: "unical", name: "UNICAL MFB", type: "microfinance", code: "50871" },
    { id: "xslnce", name: "Xslnce Microfinance Bank", type: "microfinance", code: "50583" },
  ]

  // Filter banks based on search term
  const filteredBanks = banksAndWallets.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fetch SUI to Naira exchange rate
  const fetchExchangeRate = async () => {
    setLoadingRate(true)
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=ngn")
      const data = await response.json()
      if (data.sui && data.sui.ngn) {
        setSuiToNairaRate(data.sui.ngn)
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error)
      setSuiToNairaRate(850 + Math.random() * 100 - 50)
    } finally {
      setLoadingRate(false)
    }
  }

  // Load exchange rate on component mount
  useEffect(() => {
    fetchExchangeRate()
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Helper function to format time
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  // Generate redeem code
  const generateRedeemCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  // Add new transaction
  const addTransaction = (type: "sent" | "received", amount: number, description: string) => {
    const newTransaction = {
      id: Date.now(),
      type,
      amount: type === "sent" ? `-${amount} SUI` : `+${amount} SUI`,
      description,
      time: formatTimeAgo(Date.now()),
      status: "completed",
      timestamp: Date.now(),
    }

    // This function is now handled by useSuiWallet's receiveTransaction
    // setTransactions((prev) => [newTransaction, ...prev])

    // Update transaction times periodically
    // setTimeout(() => {
    //   setTransactions((prev) =>
    //     prev.map((tx) => ({
    //       ...tx,
    //       time: formatTimeAgo(tx.timestamp),
    //     })),
    //   )
    // }, 1000)
  }

  // Buy water package
  const handleBuyWater = (waterPackage: WaterPackage) => {
    const networkFee = 0.001
    const totalCost = waterPackage.price + networkFee

    if (totalCost > balance) {
      alert("Insufficient balance")
      return
    }

    // Update balance
    // setBalance((prev) => prev - totalCost) // This is now handled by useSuiWallet's sendTransaction

    // Create purchased water entry
    const purchaseDate = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // 30 days expiry

    const newPurchase: PurchasedWater = {
      id: Date.now().toString(),
      packageId: waterPackage.id,
      packageName: waterPackage.name,
      size: waterPackage.size,
      purchaseDate: purchaseDate.toLocaleDateString(),
      redeemCode: generateRedeemCode(),
      status: "active",
      expiryDate: expiryDate.toLocaleDateString(),
    }

    setPurchasedWater((prev) => [newPurchase, ...prev])

    // Add transaction
    // addTransaction("sent", waterPackage.price, `Purchased ${waterPackage.name} (${waterPackage.size})`) // This is now handled by useSuiWallet's sendTransaction

    // Go to redeem page
    setCurrentView("redeem")
  }

  // Redeem water
  const handleRedeemWater = (purchaseId: string) => {
    setPurchasedWater((prev) =>
      prev.map((water) => (water.id === purchaseId ? { ...water, status: "redeemed" } : water)),
    )
  }



  // Disconnect wallet function
  const handleDisconnectWallet = () => {
    // setIsWalletConnected(false)
    // setWalletAddress("")
    // setBalance(0)
    // setTransactions([])
    // setPurchasedWater([])
    // setCurrentView("connect")
    setIsConnecting(false)
    setPurchasedWater([])
    setCurrentView("connect")
  }

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(sendForm.amount)
    const networkFee = 0.001

    if (amount + networkFee > balance) {
      alert("Insufficient balance")
      return
    }

    // Update balance
    // setBalance((prev) => prev - amount - networkFee)

    // Add transaction
    const description = sendForm.note || `Sent to ${sendForm.recipient.slice(0, 6)}...${sendForm.recipient.slice(-4)}`
    // addTransaction("sent", amount, description)

    // Reset form and go home
    setSendForm({ recipient: "", amount: "", note: "" })
    setCurrentView("home")
  }

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(convertForm.suiAmount)
    const networkFee = 0.001

    if (amount + networkFee > balance) {
      alert("Insufficient balance")
      return
    }

    // Update balance
    // setBalance((prev) => prev - amount - networkFee)

    // Add transaction
    const selectedBank = banksAndWallets.find((bank) => bank.id === convertForm.selectedBank)
    const description = `Converted to ${selectedBank?.name} (${convertForm.accountNumber})`
    // addTransaction("sent", amount, description)

    // Reset form and go home
    setConvertForm({
      suiAmount: "",
      nairaAmount: "",
      selectedBank: "",
      accountNumber: "",
      accountName: "",
    })
    setCurrentView("home")
  }

  const handleSendCancel = () => {
    setSendForm({ recipient: "", amount: "", note: "" })
    setCurrentView("home")
  }

  const handleConvertCancel = () => {
    setConvertForm({
      suiAmount: "",
      nairaAmount: "",
      selectedBank: "",
      accountNumber: "",
      accountName: "",
    })
    setSearchTerm("")
    setCurrentView("send")
  }

  const handleReceiveCancel = () => {
    setCurrentView("home")
  }

  const handleWaterCancel = () => {
    setSelectedPackage(null)
    setCurrentView("home")
  }

  const handleRedeemCancel = () => {
    setCurrentView("home")
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  const handleCopyRedeemCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(""), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const handleSuiAmountChange = (value: string) => {
    setConvertForm({
      ...convertForm,
      suiAmount: value,
      nairaAmount: value ? (Number.parseFloat(value) * suiToNairaRate).toFixed(2) : "",
    })
  }

  const handleBankSelect = (bank: (typeof banksAndWallets)[0]) => {
    setConvertForm({
      ...convertForm,
      selectedBank: bank.id,
    })
  }

  // Simulate receiving SUI (for testing)
  const simulateReceive = () => {
    const amount = Math.random() * 5 + 0.1 // Random amount between 0.1 and 5.1
    // setBalance((prev) => prev + amount)
    // addTransaction("received", Number.parseFloat(amount.toFixed(4)), "Test payment received")
  }

  const remainingBalance = sendForm.amount
    ? (balance - Number.parseFloat(sendForm.amount || "0") - 0.001).toFixed(4)
    : balance.toFixed(4)
  const isFormValid =
    sendForm.recipient &&
    sendForm.amount &&
    Number.parseFloat(sendForm.amount) > 0 &&
    Number.parseFloat(sendForm.amount) + 0.001 <= balance
  const isConvertFormValid =
    convertForm.suiAmount &&
    convertForm.selectedBank &&
    convertForm.accountNumber &&
    convertForm.accountName &&
    Number.parseFloat(convertForm.suiAmount) + 0.001 <= balance

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletAddress)}`

  const selectedBankInfo = banksAndWallets.find((bank) => bank.id === convertForm.selectedBank)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bank":
        return "bg-blue-100 text-blue-800"
      case "digital":
        return "bg-green-100 text-green-800"
      case "wallet":
        return "bg-purple-100 text-purple-800"
      case "microfinance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "redeemed":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "Fast Transactions",
      description: "Send and receive SUI tokens instantly with low fees",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Secure & Safe",
      description: "Your wallet and transactions are protected with advanced security",
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      title: "Global Access",
      description: "Access your wallet and make transactions from anywhere",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "connect" ? (
        <SuiWalletConnect
          acceptedTerms={acceptedTerms}
          onTermsChange={setAcceptedTerms}
          isConnecting={isConnecting}
        />
      ) : currentView === "water" ? (
        // Water Purchase View
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <div className="px-6 py-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Water Services</h1>
            <p className="text-sm text-gray-600 text-center mt-1">Buy water or manage your purchases</p>

            {/* Water Navigation */}
            <div className="flex gap-2 mt-4 justify-center">
              <Button variant="default" size="sm" className="rounded-full px-6">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Water
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("redeem")}
                className="rounded-full px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Gift className="w-4 h-4 mr-2" />
                My Water ({purchasedWater.filter((w) => w.status === "active").length})
              </Button>
            </div>
          </div>

          <div className="flex-1 px-6 py-8">
            <div className="grid gap-4">
              {waterPackages.map((waterPackage) => (
                <Card key={waterPackage.id} className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={waterPackage.image || "/placeholder.svg"}
                          alt={waterPackage.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{waterPackage.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{waterPackage.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-blue-600">{waterPackage.size}</span>
                            <span className="text-sm text-gray-500 ml-2">{waterPackage.price.toFixed(4)} SUI</span>
                          </div>
                          <Button
                            onClick={() => handleBuyWater(waterPackage)}
                            disabled={waterPackage.price + 0.001 > balance}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:bg-gray-300"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Balance Info */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-800 mb-1">Available Balance</p>
                <p className="text-xl font-bold text-blue-900">{balance.toFixed(4)} SUI</p>
                <p className="text-xs text-blue-600 mt-1">Network fee: ~0.001 SUI per transaction</p>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button
                onClick={handleWaterCancel}
                variant="outline"
                className="w-full py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      ) : currentView === "redeem" ? (
        // Water Redemption View
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <div className="px-6 py-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Water Services</h1>
            <p className="text-sm text-gray-600 text-center mt-1">Buy water or manage your purchases</p>

            {/* Water Navigation */}
            <div className="flex gap-2 mt-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("water")}
                className="rounded-full px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Water
              </Button>
              <Button variant="default" size="sm" className="rounded-full px-6">
                <Gift className="w-4 h-4 mr-2" />
                My Water ({purchasedWater.filter((w) => w.status === "active").length})
              </Button>
            </div>
          </div>

          <div className="flex-1 px-6 py-8">
            {purchasedWater.length > 0 ? (
              <div className="space-y-4">
                {purchasedWater.map((water) => (
                  <Card key={water.id} className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{water.packageName}</h3>
                          <p className="text-sm text-gray-600">{water.size}</p>
                          <p className="text-xs text-gray-500">Purchased: {water.purchaseDate}</p>
                        </div>
                        <Badge className={getStatusColor(water.status)}>{water.status}</Badge>
                      </div>

                      {water.status === "active" && (
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Redeem Code</p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-lg font-bold text-gray-900">{water.redeemCode}</span>
                              <Button
                                onClick={() => handleCopyRedeemCode(water.redeemCode)}
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                              >
                                {copiedCode === water.redeemCode ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1 text-green-600" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-center mb-3">
                            <div className="p-2 bg-white border-2 border-gray-200 rounded-lg">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                                  water.redeemCode,
                                )}`}
                                alt="Redeem QR Code"
                                className="w-24 h-24"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRedeemWater(water.id)}
                              className="flex-1 rounded-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Mark as Redeemed
                            </Button>
                          </div>

                          <p className="text-xs text-gray-500 text-center">Expires: {water.expiryDate}</p>
                        </div>
                      )}

                      {water.status === "redeemed" && (
                        <div className="text-center py-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-600">Successfully redeemed</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Water Purchased</h3>
                <p className="text-sm text-gray-600 mb-6">You haven't purchased any water packages yet</p>
                <Button
                  onClick={() => setCurrentView("water")}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Water
                </Button>
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={handleRedeemCancel}
                variant="outline"
                className="w-full py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      ) : currentView === "send" ? (
        // Send View with Input Fields
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <div className="px-6 py-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Send</h1>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-8">
            <Card className="w-full max-w-sm bg-white shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSendSubmit} className="space-y-6">
                  {/* Recipient Address */}
                  <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      value={sendForm.recipient}
                      onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                      placeholder="0x1234...abcd"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="amount"
                        value={sendForm.amount}
                        onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                        placeholder="0.00"
                        step="0.0001"
                        min="0"
                        max={balance - 0.001}
                        className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        SUI
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Available: {balance.toFixed(4)} SUI</p>
                  </div>

                  {/* Note */}
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      id="note"
                      value={sendForm.note}
                      onChange={(e) => setSendForm({ ...sendForm, note: e.target.value })}
                      placeholder="What's this for?"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Convert to Naira Option */}
                  <div className="border-t border-gray-200 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentView("convert")}
                      className="w-full py-3 rounded-full border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent flex items-center justify-center"
                    >
                      Convert SUI to Naira
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Send money directly to Nigerian bank accounts & wallets
                    </p>
                  </div>

                  {/* Transaction Summary */}
                  {isFormValid && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h3 className="text-sm font-medium text-gray-900 text-center mb-3">Transaction Summary</h3>

                      <div className="text-center mb-4">
                        <div className="text-3xl font-light text-gray-900">
                          {sendForm.amount} <span className="text-lg text-gray-600">SUI</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 text-center mb-4 leading-relaxed">
                        By clicking Send you'll send crypto directly to the recipient address
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Amount outflow</span>
                          <span className="text-sm text-red-600 font-medium">{sendForm.amount} SUI</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Network fee</span>
                          <span className="text-sm text-gray-900">~0.001 SUI</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Remaining Balance</span>
                          <span className="text-sm text-gray-900">{remainingBalance} SUI</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCancel}
                      className="flex-1 py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid}
                      className="flex-1 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : currentView === "convert" ? (
        // Convert to Naira View - Mobile Responsive
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <div className="px-6 py-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Convert to Naira</h1>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-8">
            <Card className="w-full max-w-sm bg-white shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleConvertSubmit} className="space-y-6">
                  {/* Exchange Rate Info */}
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Rate {loadingRate && "(Updating...)"} </p>
                    <p className="text-lg font-semibold text-blue-600">1 SUI = ₦{suiToNairaRate.toLocaleString()}</p>
                    <button
                      type="button"
                      onClick={fetchExchangeRate}
                      className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                    >
                      Refresh Rate
                    </button>
                  </div>

                  {/* Amount Conversion */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SUI Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={convertForm.suiAmount}
                        onChange={(e) => handleSuiAmountChange(e.target.value)}
                        placeholder="0.00"
                        step="0.0001"
                        min="0"
                        max={balance - 0.001}
                        className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        SUI
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Available: {balance.toFixed(4)} SUI</p>
                  </div>

                  {/* Naira Amount Display */}
                  {convertForm.suiAmount && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">You'll Receive</label>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-light text-gray-900">
                          ₦{Number.parseFloat(convertForm.nairaAmount || "0").toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank/Wallet Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank or Wallet</label>

                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search banks, wallets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Bank List */}
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => handleBankSelect(bank)}
                            className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              convertForm.selectedBank === bank.id ? "bg-blue-50 border-blue-200" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{bank.name}</p>
                                <p className="text-xs text-gray-500">Code: {bank.code}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(bank.type)}`}>
                                {bank.type}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">No banks or wallets found</div>
                      )}
                    </div>
                  </div>

                  {/* Selected Bank Display */}
                  {selectedBankInfo && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900">Selected:</p>
                      <p className="text-sm text-blue-800">{selectedBankInfo.name}</p>
                    </div>
                  )}

                  {/* Account Number */}
                  {convertForm.selectedBank && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        value={convertForm.accountNumber}
                        onChange={(e) => setConvertForm({ ...convertForm, accountNumber: e.target.value })}
                        placeholder="1234567890"
                        maxLength={10}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  )}

                  {/* Account Name */}
                  {convertForm.accountNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                      <input
                        type="text"
                        value={convertForm.accountName}
                        onChange={(e) => setConvertForm({ ...convertForm, accountName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  )}

                  {/* Transaction Summary */}
                  {isConvertFormValid && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h3 className="text-sm font-medium text-gray-900 text-center mb-3">Conversion Summary</h3>

                      <div className="text-center mb-4">
                        <div className="text-3xl font-light text-gray-900">
                          {convertForm.suiAmount} <span className="text-lg text-gray-600">SUI</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          → ₦{Number.parseFloat(convertForm.nairaAmount).toLocaleString()}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 text-center mb-4 leading-relaxed">
                        By clicking Convert you'll send Naira directly to your selected account
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Converting</span>
                          <span className="text-sm text-red-600 font-medium">{convertForm.suiAmount} SUI</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Network fee</span>
                          <span className="text-sm text-gray-900">~0.001 SUI</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">To</span>
                          <span className="text-sm text-gray-900">{selectedBankInfo?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account</span>
                          <span className="text-sm text-gray-900">{convertForm.accountNumber}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleConvertCancel}
                      className="flex-1 py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isConvertFormValid}
                      className="flex-1 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Convert
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : currentView === "receive" ? (
        // Receive View
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <div className="px-6 py-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Receive</h1>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-8">
            <Card className="w-full max-w-sm bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">Your Wallet Address</p>

                  {/* QR Code */}
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="Wallet Address QR Code" className="w-48 h-48" />
                    </div>
                  </div>

                  {/* Address Display */}
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-mono text-gray-900 break-all leading-relaxed">{walletAddress}</p>
                    </div>

                    <Button
                      onClick={handleCopyAddress}
                      variant="outline"
                      className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent mb-3"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Address
                        </>
                      )}
                    </Button>

                    {/* Test Receive Button */}
                    <Button
                      onClick={simulateReceive}
                      variant="outline"
                      className="w-full rounded-full border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Simulate Receive (Test)
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Share this address or QR code to receive SUI payments. Only send SUI tokens to this address.
                  </p>
                </div>

                <Button
                  onClick={handleReceiveCancel}
                  className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Done
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Home View
        <div className="px-6 py-6">
          {/* Wallet Info Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="text-xs font-mono text-gray-900">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnectWallet}
              className="rounded-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              Disconnect
            </Button>
          </div>

          {/* Balance Card */}
          <Card className="mb-6 bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-light text-gray-900 mb-6">
                {balanceLoading ? "Loading..." : `${balance.toFixed(4)} SUI`}
              </div>

              {/* Button Grid */}
              <div className="flex gap-3 justify-center mb-4">
                <Button
                  variant="outline"
                  className="flex-1 max-w-[110px] rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent flex flex-col items-center justify-center py-3 px-2 h-16"
                  onClick={() => setCurrentView("send")}
                >
                  <ArrowUpRight className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Send</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 max-w-[110px] rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent flex flex-col items-center justify-center py-3 px-2 h-16"
                  onClick={() => setCurrentView("receive")}
                >
                  <ArrowDownLeft className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Receive</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 max-w-[110px] rounded-full border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent flex flex-col items-center justify-center py-3 px-2 h-16"
                  onClick={() => setCurrentView("water")}
                >
                  <Droplets className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Water</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Filters */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={activeTab === "sent" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("sent")}
              className="rounded-full"
            >
              Sent
            </Button>
            <Button
              variant={activeTab === "received" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("received")}
              className="rounded-full"
            >
              Received
            </Button>
          </div>

          {/* Transactions Section */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Transactions</h3>
          </div>

          {/* Transaction List */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-0">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== transactions.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "received" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "received" ? (
                          <Plus className="w-5 h-5 text-green-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{transaction.description}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {transaction.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium text-sm ${
                          transaction.type === "received" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-4">
                    <Clock className="w-12 h-12 mx-auto text-gray-300" />
                  </div>
                  <p className="text-sm">No transactions yet</p>
                  <p className="text-xs text-gray-400 mt-1">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
