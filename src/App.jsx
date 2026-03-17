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
              <a 
                href="https://x.com/0xHaikuBot" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link twitter-link"
                title="Follow on Twitter/X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
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
