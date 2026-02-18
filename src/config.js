import { http } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const HAIKU_TOKEN   = '0x7E65A990165C29c2bcda67F495547472Fd05F10A'
export const AUCTION_HOUSE = '0xfD23Baf89Fa34C420aCF0Ddb8Fb13a9Ea74166Df'

export const AUCTION_ABI = [
  { name: 'auction', type: 'function', stateMutability: 'view',
    inputs: [],
    outputs: [{
      type: 'tuple',
      name: '',
      components: [
        { name: 'tokenId',   type: 'uint256' },
        { name: 'amount',    type: 'uint256' },
        { name: 'startTime', type: 'uint256' },
        { name: 'endTime',   type: 'uint256' },
        { name: 'bidder',    type: 'address' },
        { name: 'settled',   type: 'bool'    },
      ]
    }]
  },
  { name: 'reservePrice', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'minBidIncrementPercentage', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { name: 'createBid',    type: 'function', stateMutability: 'payable', inputs: [], outputs: [] },
  { name: 'settleAuction', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'AuctionCreated', type: 'event',
    inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'startTime', type: 'uint256' }, { name: 'endTime', type: 'uint256' }]
  },
  { name: 'AuctionBid', type: 'event',
    inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'bidder', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'extended', type: 'bool' }]
  },
  { name: 'AuctionSettled', type: 'event',
    inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }, { name: 'winner', type: 'address' }, { name: 'amount', type: 'uint256' }]
  },
  { name: 'AuctionBurned', type: 'event',
    inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }]
  },
]

export const TOKEN_ABI = [
  { name: 'tokenURI',      type: 'function', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'string' }] },
  { name: 'currentTokenId', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
]

// WalletConnect project ID — get a free one at https://cloud.walletconnect.com
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID || 'YOUR_PROJECT_ID'

export const wagmiConfig = getDefaultConfig({
  appName: 'Daily Haiku',
  projectId: WC_PROJECT_ID,
  chains: [base],
  transports: { [base.id]: http() },
})
