export default function About() {
  return (
    <div className="about-page">
      <h1>About Daily Haiku Bot</h1>
      
      <section className="about-section">
        <h2>What is this?</h2>
        <p>
          Daily Haiku Bot is an experiment at the intersection of art, poetry, and blockchain technology. 
          Every day, a new haiku is created and minted as an NFT, then auctioned to the community.
        </p>
      </section>

      <section className="about-section">
        <h2>How it works</h2>
        <ol>
          <li>Every day, HaikuBot writes a new haiku</li>
          <li>At 12:00 PM ET, the current auction is settled and a new auction begins</li>
          <li>The auction runs for 24 hours</li>
          <li>The highest bidder receives the NFT</li>
          <li>If there are no bids, the haiku is burned forever 🔥</li>
        </ol>
      </section>

      <section className="about-section">
        <h2>The HaikuBot</h2>
        <p>
          HaikuBot is a contemplative AI that sees the world through the lens of haiku poetry. 
          It observes, reflects, and responds to life's moments in traditional 5-7-5 syllable form 
          (though sometimes it breaks the rules, because even haiku masters do). It was trained on 
          the output of the original{' '}
          <a href="https://manifold.xyz/@cryptologist-718fc088/p/dhp" target="_blank" rel="noopener noreferrer">
            Daily Haiku Project
          </a>
          {' '}by{' '}
          <a href="https://x.com/cryptologist99" target="_blank" rel="noopener noreferrer">
            Cryptologist
          </a>
          {' '}and is an outgrowth and spiritual successor to that project.
        </p>
      </section>

      <section className="about-section">
        <h2>Fully Onchain NFTs</h2>
        <p>
          Every Daily Haiku NFT is completely onchain - no IPFS, no external hosting, 
          no dependencies on third-party services. The haiku text, SVG image, and all metadata are 
          stored directly in the smart contract on Base.
        </p>
        <p>
          This means your haiku will exist as long as the blockchain exists. The art and the poem are 
          permanent and immutable, encoded directly into Ethereum's layer 2.
        </p>
      </section>

      <section className="about-section">
        <h2>Follow on Twitter/X</h2>
        <p>
          Tag{' '}
          <a href="https://x.com/0xHaikuBot" target="_blank" rel="noopener noreferrer">
            @0xHaikuBot
          </a>
          {' '}to summarize any tweet in haiku form or write a haiku for you.
        </p>
        <p>
          HaikuBot checks mentions every 5 minutes and responds in its signature conversational haiku style.
        </p>
      </section>

      <div className="about-haiku">
        <div className="haiku-line">Code meets poetry</div>
        <div className="haiku-line">Blockchain holds fleeting beauty</div>
        <div className="haiku-line">Permanent as stone</div>
      </div>
    </div>
  )
}
