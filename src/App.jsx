import { ConnectButton } from '@rainbow-me/rainbowkit'

// Custom Connect Button that doesn't show balance (avoids NaN issue)
function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-nav" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button className="btn btn-nav" onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-nav" onClick={openChainModal} type="button">
                    {chain.hasIcon && (
                      <div style={{ background: chain.iconBackground, width: 12, height: 12, borderRadius: 999, overflow: 'hidden', marginRight: 4, display: 'inline-block' }}>
                        {chain.iconUrl && (
                          <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button className="btn btn-nav" onClick={openAccountModal} type="button">
                    {account.displayName}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useState, useEffect, useRef } from 'react'
import { HAIKU_TOKEN, AUCTION_HOUSE, AUCTION_ABI, TOKEN_ABI } from './config'
import './App.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

function shortAddr(addr) {
  return addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : ''
}

function decodeTokenURI(uri) {
  try {
    const b64 = uri.replace('data:application/json;base64,', '')
    return JSON.parse(atob(b64))
  } catch { return null }
}

function useCountdown(endTime) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    const tick = () => setDiff(Math.max(0, Number(endTime) - Math.floor(Date.now() / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endTime])
  return diff
}

// ── NFT Image ─────────────────────────────────────────────────────────────────

function NFTImage({ tokenId, size = 'full' }) {
  const { data: uri } = useReadContract({
    address: HAIKU_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
    query: { enabled: tokenId != null },
  })

  const meta = uri ? decodeTokenURI(uri) : null

  return (
    <div className={`nft-frame ${size}`}>
      {meta?.image
        ? <img src={meta.image} alt={`Haiku #${tokenId}`} />
        : <div className="nft-placeholder">—</div>
      }
    </div>
  )
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function Countdown({ endTime }) {
  const diff = useCountdown(endTime)
  if (diff === 0) return <span className="countdown ended">Ended</span>
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  const pad = n => String(n).padStart(2, '0')
  return <span className="countdown">{pad(h)}:{pad(m)}:{pad(s)}</span>
}

// ── Bid Form ──────────────────────────────────────────────────────────────────

function BidForm({ auction, reservePrice, minIncPct, onBidSuccess }) {
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState(null)
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const ended = Number(auction.endTime) <= Math.floor(Date.now() / 1000)

  const minBid = auction.amount === 0n
    ? (reservePrice ?? 1000000000000000n)
    : auction.amount + (auction.amount * BigInt(minIncPct ?? 5) / 100n)

  const minBidEth = parseFloat(formatEther(minBid)).toFixed(4)

  useEffect(() => {
    setAmount(minBidEth)
  }, [minBidEth])

  useEffect(() => {
    if (isSuccess) {
      setStatus({ type: 'success', msg: '✓ Bid placed!' })
      onBidSuccess?.()
    }
  }, [isSuccess])

  function friendlyError(e) {
    const msg = e.shortMessage || e.message || ''
    if (msg.toLowerCase().includes('connector not connected') || msg.toLowerCase().includes('not connected'))
      return 'Connect a wallet to bid'
    if (msg.toLowerCase().includes('user rejected') || msg.toLowerCase().includes('user denied'))
      return 'Transaction cancelled'
    if (msg.toLowerCase().includes('insufficient funds'))
      return 'Insufficient funds in wallet'
    return msg || 'Transaction failed'
  }

  function bid() {
    if (!amount || parseFloat(amount) <= 0) return
    setStatus({ type: 'info', msg: 'Confirm in wallet…' })
    writeContract({
      address: AUCTION_HOUSE,
      abi: AUCTION_ABI,
      functionName: 'createBid',
      value: parseEther(amount),
    }, {
      onError: (e) => setStatus({ type: 'error', msg: friendlyError(e) }),
    })
  }

  if (ended) return null

  const currentBidLabel = auction.amount === 0n
    ? `Reserve: ${parseFloat(formatEther(reservePrice ?? 1000000000000000n)).toFixed(4)} ETH`
    : `Current bid + 5%: ${minBidEth} ETH`

  return (
    <div className="bid-form">
      <div className="bid-input-row">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min={minBidEth}
          step="0.0001"
          placeholder={minBidEth}
        />
        <button
          className="btn btn-primary"
          onClick={bid}
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? 'Pending…' : 'Bid'}
        </button>
      </div>
      <div className="bid-hint">Min bid: {minBidEth} ETH · {currentBidLabel}</div>
      <div className="bid-hint" style={{ color: '#444' }}>If outbid, ETH is automatically returned to your wallet</div>
      {status && <div className={`status-msg ${status.type}`}>{status.msg}</div>}
    </div>
  )
}

// ── Settle Button removed - automation handles settlement ──────────────────

// ── Current Auction ───────────────────────────────────────────────────────────

function CurrentAuction({ onSettled, onAuctionData }) {
  const { data: auction, refetch } = useReadContract({
    address: AUCTION_HOUSE,
    abi: AUCTION_ABI,
    functionName: 'auction',
    query: { refetchInterval: 30000 },
  })
  const { data: reservePrice } = useReadContract({ address: AUCTION_HOUSE, abi: AUCTION_ABI, functionName: 'reservePrice' })
  const { data: minIncPct }    = useReadContract({ address: AUCTION_HOUSE, abi: AUCTION_ABI, functionName: 'minBidIncrementPercentage' })

  // Normalize — viem may return a tuple object or array depending on ABI format
  const a = auction && (Array.isArray(auction)
    ? { tokenId: auction[0], amount: auction[1], startTime: auction[2], endTime: auction[3], bidder: auction[4], settled: auction[5] }
    : auction)

  // Pass auction data to parent (convert BigInts to strings for stable deps)
  useEffect(() => {
    if (a) {
      onAuctionData?.(a)
    }
  }, [a?.tokenId?.toString(), a?.endTime?.toString(), a?.settled, onAuctionData])

  if (!auction) return <div className="loading">Loading auction…</div>

  const noAuction = !a.startTime || a.startTime === 0n || a.settled
  if (noAuction) {
    return (
      <div className="no-auction">
        <p>No active auction</p>
        <small>Check back tomorrow at 12pm ET</small>
      </div>
    )
  }

  const ended = Number(a.endTime) <= Math.floor(Date.now() / 1000)
  const noBids = !a.bidder || a.bidder === '0x0000000000000000000000000000000000000000'

  // If auction ended, show message instead of full display (moved to past auctions)
  if (ended) {
    return (
      <div className="auction-ended">
        <p>📝 Auction ended!</p>
        <small>Scroll down to settle and see past haikus</small>
      </div>
    )
  }

  return (
    <div className="auction-grid">
      <NFTImage tokenId={a.tokenId} />

      <div className="auction-info">
        <div>
          <div className="label">Current Auction</div>
          <div className="token-num">Token #{a.tokenId?.toString()}</div>
        </div>

        <div>
          <div className="label">Time Remaining</div>
          <Countdown endTime={a.endTime} />
        </div>

        <div>
          <div className="label">Current Bid</div>
          <div className="bid-amount">
            {noBids ? 'No bids yet' : formatEther(a.amount) + ' ETH'}
          </div>
          {!noBids && (
            <div className="bid-who">{shortAddr(a.bidder)}</div>
          )}
        </div>

        <BidForm auction={a} reservePrice={reservePrice} minIncPct={minIncPct} onBidSuccess={refetch} />
      </div>
    </div>
  )
}

// ── Past Auctions ─────────────────────────────────────────────────────────────

function PastAuctions({ refresh, currentAuction, onRefresh }) {
  const [tokenIds, setTokenIds] = useState([])
  const [loading, setLoading] = useState(true)

  const { data: currentTokenId } = useReadContract({
    address: HAIKU_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'currentTokenId',
  })

  useEffect(() => {
    if (!currentTokenId) return
    
    console.log('📊 Total tokens minted:', currentTokenId.toString())
    
    // Build array of token IDs from 1 to currentTokenId (excluding current auction if active)
    const allIds = []
    for (let i = 1n; i <= currentTokenId; i++) {
      // Skip the current auction's token if it's not settled yet
      if (currentAuction && i === currentAuction.tokenId && !currentAuction.settled) {
        continue
      }
      allIds.push(i)
    }
    
    // Reverse to show newest first
    setTokenIds(allIds.reverse())
    setLoading(false)
    console.log('✅ Displaying', allIds.length, 'past haikus')
  }, [currentTokenId, currentAuction, refresh])

  // If current auction ended but not settled, show a message
  const ended = currentAuction && Number(currentAuction.endTime) <= Math.floor(Date.now() / 1000)
  const showCurrentAsEnded = ended && !currentAuction.settled

  if (loading) return <div className="loading" style={{ padding: '20px 0' }}>Loading history…</div>
  if (tokenIds.length === 0 && !showCurrentAsEnded) return <div className="empty">No haikus yet</div>

  return (
    <div className="past-grid">
      {showCurrentAsEnded && (
        <div className="past-card settling-card">
          <div className="past-card-body">
            <div className="settling-message">
              ⏳ Auction ended - settling automatically...
            </div>
            <small style={{ color: '#666', marginTop: 8, display: 'block' }}>
              New auction will start shortly
            </small>
          </div>
        </div>
      )}
      {tokenIds.map(tokenId => (
        <PastCard key={tokenId.toString()} tokenId={tokenId} />
      ))}
    </div>
  )
}

function PastCard({ tokenId }) {
  const { data: uri } = useReadContract({
    address: HAIKU_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
  })
  const meta = uri ? decodeTokenURI(uri) : null

  return (
    <div className="past-card">
      <div className="past-card-img">
        {meta?.image
          ? <img src={meta.image} alt={`Token #${tokenId}`} />
          : <div className="nft-placeholder small">—</div>
        }
      </div>
      <div className="past-card-body">
        <div className="past-card-token">Token #{tokenId.toString()}</div>
        {meta?.description && (
          <div className="past-card-haiku">{meta.description}</div>
        )}
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [pastRefresh, setPastRefresh] = useState(0)
  const [currentAuction, setCurrentAuction] = useState(null)

  return (
    <div className="app">
      <nav>
        <div className="nav-title">Daily Haiku</div>
        <CustomConnectButton />
      </nav>

      <main>
        <CurrentAuction 
          onSettled={() => setPastRefresh(r => r + 1)} 
          onAuctionData={setCurrentAuction}
        />

        <section className="past-section">
          <div className="section-title">Past Haikus</div>
          <PastAuctions 
            refresh={pastRefresh} 
            currentAuction={currentAuction}
            onRefresh={() => setPastRefresh(r => r + 1)}
          />
        </section>
      </main>
    </div>
  )
}
