<template>
  <div class="container">
    <section class="columns is-multiline is-desktop">
      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <Icon icon="cubes" fixed-width></Icon>
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.block', 2) }}
            </h3>
          </div>
          <div class="card-body">
            <div v-for="block in recentBlocks" class="qtum-block is-size-7" :key="block.hash">
              <div class="level">
                <div class="level-left">
                  <nuxt-link :to="'/block/' + block.height" class="level-item qtum-block-box has-text-centered">
                    {{ $tc('blockchain.block', 1) }} #{{ block.height }}
                    <br>
                    <FromNow :timestamp="block.timestamp"></FromNow>
                  </nuxt-link>
                  <div class="level-item">
                    <div>
                      <i18n path="block.brief.address">
                        <AddressLink :address="block.minedBy"></AddressLink>
                      </i18n>
                      <br>
                      {{ $t('block.brief.transaction', [block.txLength, block.duration]) }}
                      <br>
                      {{ $t('block.brief.reward', [$printAmount(block.reward)]) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <Icon icon="list-alt" fixed-width></Icon>
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.transaction', 2) }}
            </h3>
          </div>
          <div class="card-body">
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="is-size-7 transaction">
              <div class="level">
                <nuxt-link :to="'/tx/' + transaction.id" class="level-left">
                  {{ transaction.id }}
                </nuxt-link>
                <span class="level-right">{{ transaction.valueOut | qtum }} QTUM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Block from "@/models/block"

  export default {
    head() {
      return {title: 'qtum.info'}
    },
    data() {
      return {
        recentBlocks: [],
        recentTransactions: []
      }
    },
    async asyncData() {
      let recentBlocks = await Block.getRecentBlocks()
      return {recentBlocks}
    },
    mounted() {
      this.$websocket.send({type: 'subscribe', data: 'block'})
      this.$websocket.send({type: 'subscribe', data: 'transaction'})
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'blockchain/block') {
          this.recentBlocks.unshift(mutation.payload)
          this.recentBlocks.pop()
        } else if (mutation.type === 'blockchain/transaction') {
          this.recentTransactions.unshift(mutation.payload)
          if (this.recentTransactions.length > 30) {
            this.recentTransactions.pop()
          }
        }
      })
    },
    beforeDestroy() {
      this.$websocket.send({type: 'unsubscribe', data: 'block'})
      this.$websocket.send({type: 'unsubscribe', data: 'transaction'})
    }
  }
</script>

<style lang="less" scoped>
  .columns.is-desktop {
    margin: 0;
  }

  .card-body {
    height: 30em;
    overflow: auto;
  }

  .qtum-block {
    padding: 1em;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
  }

  .qtum-block-box {
    display: inline-block;
    min-width: 11em;
    padding: 1em;
    background-color: #eee;
    color: inherit;
    &:hover {
      outline: 1px solid #3273dc;
    }
  }

  .transaction {
    padding: 0.5em 1em;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
    font-family: monospace;
  }
</style>
