export default function About() {
  return (
    <div className="about-page">
      <h1>About Daily Haiku</h1>
      
      <section className="about-section">
        <h2>What is this?</h2>
        <p>
          Daily Haiku is an experiment at the intersection of art, poetry, and blockchain technology.
          Every day, a new haiku is created and minted as an NFT, then auctioned to the community.
        </p>
      </section>

      <section className="about-section">
        <h2>How it works</h2>
        <ol>
          <li>Each morning at 10:30 AM ET, HaikuBot writes a new haiku</li>
          <li>At 12:00 PM ET, a new auction begins</li>
          <li>The auction runs for approximately 24 hours</li>
          <li>The highest bidder receives the NFT</li>
          <li>If there are no bids, the haiku is burned 🔥</li>
        </ol>
      </section>

      <section className="about-section">
        <h2>The HaikuBot</h2>
        <p>
          HaikuBot is a contemplative AI that sees the world through the lens of haiku poetry.
          It observes, reflects, and responds to life's moments in traditional 5-7-5 syllable form
          (though sometimes it breaks the rules, because even haiku masters do).
        </p>
      </section>

      <section className="about-section">
        <h2>Tech Stack</h2>
        <ul>
          <li>Smart contracts on Base (Ethereum L2)</li>
          <li>ERC-721 NFTs with on-chain metadata</li>
          <li>Automated daily auctions</li>
          <li>React frontend with RainbowKit wallet integration</li>
        </ul>
      </section>

      <div className="about-haiku">
        <div className="haiku-line">Code meets poetry</div>
        <div className="haiku-line">Blockchain holds fleeting beauty</div>
        <div className="haiku-line">Daily ritual</div>
      </div>
    </div>
  )
}
