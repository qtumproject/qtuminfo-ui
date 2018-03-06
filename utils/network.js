export default {
  mainnet: {
    pubkeyhash: 0x3a,
    scripthash: 0x32,
    bech32: 'bc'
  },
  testnet: {
    pubkeyhash: 0x78,
    scripthash: 0x6e,
    bech32: 'tb'
  }
}[process.env.network || 'mainnet']
