import { http } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// V9/V7 contracts (deployed 2026-03-15) - ownerOf fix + UI improvements
export const HAIKU_TOKEN = '0x333f17f7B73Ad78f49cD09d65a9d4912D0125b08'
export const AUCTION_HOUSE = '0x99a6F2c46BeF675a1e50039076BCC8d7E16C2b30'
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD'
export const OPENSEA_URL = 'https://opensea.io/assets/base/0x333f17f7B73Ad78f49cD09d65a9d4912D0125b08'

export const AUCTION_ABI = [
  {
    name: 'auction',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{
      type: 'tuple',
      name: '',
      components: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
        { name: 'startTime', type: 'uint256' },
        { name: 'endTime', type: 'uint256' },
        { name: 'bidder', type: 'address' },
        { name: 'settled', type: 'bool' },
      ]
    }]
  },
  {
    name: 'reservePrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'minBidIncrementPercentage',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }]
  },
  {
    name: 'createBid',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: []
  },
  {
    name: 'settleAuction',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    name: 'AuctionCreated',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' }
    ]
  },
  {
    name: 'AuctionBid',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'bidder', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'extended', type: 'bool' }
    ]
  },
  {
    name: 'AuctionSettled',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ]
  },
  {
    name: 'AuctionOrphaned',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true }
    ]
  },
  {
    name: 'RefundFailed',
    type: 'event',
    inputs: [
      { name: 'bidder', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' }
    ]
  },
  {
    name: 'pendingReturns',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'bidder', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'withdrawRefund',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    name: 'auctionRecipient',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }]
  },
]

export const TOKEN_ABI = [
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }]
  },
  {
    name: 'currentTokenId',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    name: 'isOrphaned',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }]
  },
]

// WalletConnect project ID — get a free one at https://cloud.walletconnect.com
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID || 'YOUR_PROJECT_ID'

export const wagmiConfig = getDefaultConfig({
  appName: 'Daily Haiku Bot',
  projectId: WC_PROJECT_ID,
  chains: [base],
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: { wait: 50 },
      retryCount: 3,
      timeout: 30_000,
    })
  },
})
