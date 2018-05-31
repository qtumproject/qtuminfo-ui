export default {
  mainnet: {
    pubkey: 0x3a,
    pubkeyhash: 0x3a,
    scripthash: 0x32,
    witness_v0_keyhash: 'qc',
    witness_v0_scripthash: 'qc'
  },
  testnet: {
    pubkey: 0x78,
    pubkeyhash: 0x78,
    scripthash: 0x6e,
    witness_v0_keyhash: 'tq',
    witness_v0_scripthash: 'tq'
  }
}[process.env.network || 'mainnet']
