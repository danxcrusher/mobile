"use client"

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Wallet, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface SuiWalletConnectProps {
  acceptedTerms: boolean
  onTermsChange: (accepted: boolean) => void
  isConnecting: boolean
}

const features = [
  {
    title: "Secure & Fast",
    description: "Built on the Sui blockchain for lightning-fast transactions",
    icon: <Wallet className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Testnet Ready",
    description: "Connect to Sui testnet for development and testing",
    icon: <Check className="w-6 h-6 text-green-600" />,
  },
  {
    title: "Real-time Balance",
    description: "View your SUI balance and transaction history in real-time",
    icon: <Wallet className="w-6 h-6 text-purple-600" />,
  },
]

export function SuiWalletConnect({ 
  acceptedTerms, 
  onTermsChange, 
  isConnecting 
}: SuiWalletConnectProps) {
  const account = useCurrentAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SUI Wallet</h1>
          <p className="text-gray-600 text-lg">Your gateway to the SUI ecosystem</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What you can do */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border-0 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">What you can do:</h3>
            <div className="space-y-3">
              {[
                "Send and receive SUI tokens on testnet",
                "Convert SUI to Nigerian Naira",
                "Buy and redeem water packages",
                "Track all your transactions",
                "Access your wallet with QR codes",
                "Secure and fast blockchain transactions",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet Status */}
        {account && (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-green-800 mb-2">Wallet Connected</h3>
                <p className="text-sm text-green-700 font-mono">
                  {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terms and Connect */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => onTermsChange(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              I agree to the <button className="text-blue-600 hover:underline">Terms of Service</button> and{" "}
              <button className="text-blue-600 hover:underline">Privacy Policy</button>
            </label>
          </div>

          <ConnectButton
            connectText={
              isConnecting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting Wallet...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </div>
              )
            }
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!acceptedTerms || isConnecting}
          />

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Connect your Sui wallet to access the testnet and start using the app.
          </p>
        </div>
      </div>
    </div>
  )
} 