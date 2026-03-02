import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Home from './pages/Home'
import About from './pages/About'
import Haiku from './pages/Haiku'
import './App.css'

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

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <div className="nav-left">
            <Link to="/" className="nav-title">Daily Haiku Bot</Link>
            <div className="nav-links">
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/haiku" className="nav-link">$HAIKU</Link>
            </div>
          </div>
          <CustomConnectButton />
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/haiku" element={<Haiku />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
