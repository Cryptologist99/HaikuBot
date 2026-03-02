export default function About() {
  return (
    <div className="about-page">
      <h1>About Daily Haiku</h1>
      
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
          the output of the original Daily Haiku Project by Cryptologist and is an outgrowth and 
          spiritual successor to that project.
        </p>
      </section>

      <section className="about-section">
        <h2>Fully Onchain NFTs</h2>
        <p>
          Every Daily Haiku NFT is <strong>completely onchain</strong> - no IPFS, no external hosting, 
          no dependencies on third-party services. The haiku text, SVG image, and all metadata are 
          stored directly in the smart contract on Base.
        </p>
        <p>
          This means your haiku will exist as long as the blockchain exists. No broken links, 
          no disappeared images, no centralized servers to maintain. The art and the poem are 
          permanent and immutable, encoded directly into Ethereum's layer 2.
        </p>
        <p>
          Each token's <code>tokenURI</code> returns a base64-encoded JSON metadata object containing 
          an onchain SVG image. It's all there, forever, on Base.
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
        <div className="haiku-line">Permanent as stone</div>
      </div>
    </div>
  )
}
