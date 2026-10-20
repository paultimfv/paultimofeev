// Logo files live in public/logos. Names not listed here (people, generic notebooks) show without a logo.
const files: Record<string, string> = {
  x402: "x402.svg", ore: "ore.png", "collector crypt": "collector-crypt.png", laso: "laso.png",
  maple: "maple.png", syrup: "maple.png", robinhood: "robinhood.png", "photo finish": "photo-finish.png",
  pump: "pump.png", jupiter: "jupiter.png", solana: "solana.png", claude: "anthropic.png",
  circle: "circle.jpg", "coinbase developer platform": "coinbase.png", coinbase: "coinbase.png", zama: "zama.png",
  plasma: "plasma.png", jito: "jito.png", eigenlayer: "eigenlayer.png", "particle network": "particle.png",
  cloudflare: "cloudflare.png", visa: "visa.png", altitude: "altitude.png", anza: "anza.png",
  "pantera capital": "pantera.png", "li.fi": "lifi.png", hyperlane: "hyperlane.png", shoal: "shoal.jpg",
  ostium: "ostium.png", base: "base.png", ethereum: "ethereum.png",
};

// First listed key found in the name wins, so "Maple Finance x Robinhood" gets Maple.
export const logoFor = (name: string) => {
  const n = name.toLowerCase();
  const key = Object.keys(files).find((k) => n.includes(k));
  return key ? `/logos/${files[key]}` : undefined;
};
