export default {
  mainnet: {
    pubkey: 0x3a,
    pubkeyhash: 0x3a,
    scripthash: 0x32,
    witness_v0_keyhash: 'bc',
    witness_v0_scripthash: 'bc'
  },
  testnet: {
    pubkey: 0x78,
    pubkeyhash: 0x78,
    scripthash: 0x6e,
    witness_v0_keyhash: 'tb',
    witness_v0_scripthash: 'tb'
  }
}[process.env.network || 'mainnet']
