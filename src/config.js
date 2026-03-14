import { http } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// V7/V5 contracts (deployed 2026-03-14) - orphaning support + gas fix
export const HAIKU_TOKEN = '0xfD8BC55c118E5b1a7Aa45D4f919B3D92880e2e7B'
export const AUCTION_HOUSE = '0xB7D7669C58e9DFf639AD430056F1F600F995E410'
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD'
export const OPENSEA_URL = 'https://opensea.io/assets/base/0xfD8BC55c118E5b1a7Aa45D4f919B3D92880e2e7B'

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
