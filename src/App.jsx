import { ConnectButton } from '@rainbow-me/rainbowkit'
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

function BidForm({ auction, reservePrice, minIncPct }) {
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
    if (isSuccess) setStatus({ type: 'success', msg: '✓ Bid placed!' })
  }, [isSuccess])

  function bid() {
    if (!amount || parseFloat(amount) <= 0) return
    setStatus({ type: 'info', msg: 'Confirm in wallet…' })
    writeContract({
      address: AUCTION_HOUSE,
      abi: AUCTION_ABI,
      functionName: 'createBid',
      value: parseEther(amount),
    }, {
      onError: (e) => setStatus({ type: 'error', msg: e.shortMessage || e.message }),
    })
  }

  if (ended) return null

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
      <div className="bid-hint">Min bid: {minBidEth} ETH</div>
      {status && <div className={`status-msg ${status.type}`}>{status.msg}</div>}
    </div>
  )
}

// ── Settle Button ─────────────────────────────────────────────────────────────

function SettleButton({ onSettled }) {
  const [status, setStatus] = useState(null)
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) { setStatus({ type: 'success', msg: '✓ Settled!' }); onSettled?.() }
  }, [isSuccess])

  function settle() {
    setStatus({ type: 'info', msg: 'Confirm in wallet…' })
    writeContract({
      address: AUCTION_HOUSE,
      abi: AUCTION_ABI,
      functionName: 'settleAuction',
    }, {
      onError: (e) => setStatus({ type: 'error', msg: e.shortMessage || e.message }),
    })
  }

  return (
    <div>
      <button className="btn btn-settle" onClick={settle} disabled={isPending || isConfirming}>
        {isPending || isConfirming ? 'Settling…' : 'Settle Auction'}
      </button>
      {status && <div className={`status-msg ${status.type}`} style={{ marginTop: 8 }}>{status.msg}</div>}
    </div>
  )
}

// ── Current Auction ───────────────────────────────────────────────────────────

function CurrentAuction({ onSettled }) {
  const { data: auction, refetch } = useReadContract({
    address: AUCTION_HOUSE,
    abi: AUCTION_ABI,
    functionName: 'auction',
    query: { refetchInterval: 30000 },
  })
  const { data: reservePrice } = useReadContract({ address: AUCTION_HOUSE, abi: AUCTION_ABI, functionName: 'reservePrice' })
  const { data: minIncPct }    = useReadContract({ address: AUCTION_HOUSE, abi: AUCTION_ABI, functionName: 'minBidIncrementPercentage' })

  if (!auction) return <div className="loading">Loading auction…</div>

  const noAuction = auction.startTime === 0n || auction.settled
  if (noAuction) {
    return (
      <div className="no-auction">
        <p>No active auction</p>
        <small>Check back tomorrow at 12pm ET</small>
      </div>
    )
  }

  const ended = Number(auction.endTime) <= Math.floor(Date.now() / 1000)
  const noBids = auction.bidder === '0x0000000000000000000000000000000000000000'

  return (
    <div className="auction-grid">
      <NFTImage tokenId={auction.tokenId} />

      <div className="auction-info">
        <div>
          <div className="label">Current Auction</div>
          <div className="token-num">Token #{auction.tokenId.toString()}</div>
        </div>

        <div>
          <div className="label">Time Remaining</div>
          <Countdown endTime={auction.endTime} />
        </div>

        <div>
          <div className="label">Current Bid</div>
          <div className="bid-amount">
            {noBids ? 'No bids yet' : formatEther(auction.amount) + ' ETH'}
          </div>
          {!noBids && (
            <div className="bid-who">{shortAddr(auction.bidder)}</div>
          )}
        </div>

        <BidForm auction={auction} reservePrice={reservePrice} minIncPct={minIncPct} />

        {ended && <SettleButton onSettled={() => { refetch(); onSettled?.() }} />}
      </div>
    </div>
  )
}

// ── Past Auctions ─────────────────────────────────────────────────────────────

function PastAuctions({ refresh }) {
  const client = usePublicClient()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [settled, burned] = await Promise.all([
          client.getLogs({ address: AUCTION_HOUSE, event: AUCTION_ABI.find(x => x.name === 'AuctionSettled'), fromBlock: 0n }),
          client.getLogs({ address: AUCTION_HOUSE, event: AUCTION_ABI.find(x => x.name === 'AuctionBurned'),  fromBlock: 0n }),
        ])
        const all = [...settled, ...burned].sort((a, b) => Number(b.blockNumber - a.blockNumber))
        setEvents(all)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [refresh])

  if (loading) return <div className="loading" style={{ padding: '20px 0' }}>Loading history…</div>
  if (events.length === 0) return <div className="empty">No settled auctions yet</div>

  return (
    <div className="past-grid">
      {events.slice(0, 24).map(ev => {
        const tokenId = ev.args.tokenId
        const isBurned = !ev.args.winner
        const price = isBurned ? null : ev.args.amount
        return (
          <PastCard key={tokenId.toString()} tokenId={tokenId} isBurned={isBurned} price={price} />
        )
      })}
    </div>
  )
}

function PastCard({ tokenId, isBurned, price }) {
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
        <div className="past-card-price">
          {isBurned ? 'Burned' : parseFloat(formatEther(price)).toFixed(4) + ' ETH'}
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [pastRefresh, setPastRefresh] = useState(0)

  return (
    <div className="app">
      <nav>
        <div className="nav-title">Daily Haiku</div>
        <ConnectButton />
      </nav>

      <main>
        <CurrentAuction onSettled={() => setPastRefresh(r => r + 1)} />

        <section className="past-section">
          <div className="section-title">Past Haikus</div>
          <PastAuctions refresh={pastRefresh} />
        </section>
      </main>
    </div>
  )
}
