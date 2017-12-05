<template>
  <section class="container">
    <div class="card transaction-summary">
      <div class="card-header">
        <div class="card-header-icon">
          <span class="fa fa-fw fa-info"></span>
        </div>
        <h3 class="card-header-title">{{ $t('transaction.summary') }}</h3>
      </div>
      <div class="card-body">
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Transaction Hash</div>
          <div class="column">{{ id }}</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Included in Block</div>
          <div class="column">
            <nuxt-link :to="'/block/' + blockHeight">
              {{ blockHeight }} ({{ block.hash }})
            </nuxt-link>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Transaction Size</div>
          <div class="column">{{ size }} bytes</div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">Timestamp</div>
          <div class="column">
            {{ $moment(time * 1000).fromNow() }}
            ( {{ $moment(time * 1000).toString() }} )
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter has-text-right">confirmations</div>
          <div class="column">{{ confirmations }}</div>
        </div>
        <div class="columns" v-if="fees > 0">
          <div class="column is-one-quarter has-text-right">Transaction Fee</div>
          <div class="column">{{ fees | qtum }} QTUM</div>
        </div>

        <div class="columns is-multiline transaction-item">
          <div class="column is-full">
            <span :class="[
              'fa', 'fa-fw',
              collapsed ? 'fa-plus-square-o' : 'fa-minus-square-o',
              'toggle-collapse'
            ]" @click="collapsed = !collapsed"></span>
            Transaction Details
          </div>
          <div class="column is-clearfix collapse">
            <template v-if="vin[0].address">
              <div v-for="input in (collapsed ? mergeInputs(vin) : vin)" class="is-clearfix">
                <nuxt-link class="pull-left" :to="'/address/' + input.address">
                  {{ input.address }}
                </nuxt-link>
                <span class="pull-right amount">
                  {{ input.value | qtum(8) }} QTUM
                </span>
              </div>
            </template>
            <template v-else>Newly Generated Coins</template>
          </div>
          <span class="column fa fa-arrow-right arrow collapse"></span>
          <div class="column is-half collapse">
            <template v-if="collapsed">
              <div v-for="output in mergeOutputs(vout)" class="is-clearfix">
                <nuxt-link :to="'/address/' + output.scriptPubKey.addresses[0]"
                  v-if="output.scriptPubKey.addresses" class="pull-left">
                  {{ output.scriptPubKey.addresses[0] }}
                </nuxt-link>
                <span v-else class="pull-left">Unparsed Address</span>
                <span class="pull-right amount" v-if="output.value">
                  {{ output.value | qtum(8) }} QTUM
                </span>
              </div>
            </template>
            <template v-else>
              <div v-for="output in vout" class="is-clearfix">
                <nuxt-link :to="'/address/' + output.scriptPubKey.addresses[0]"
                  v-if="output.scriptPubKey.addresses" class="pull-left">
                  {{ output.scriptPubKey.addresses[0] }}
                </nuxt-link>
                <span v-else class="pull-left">Unparsed Address</span>
                <span class="pull-right amount" v-if="output.value">
                  {{ output.value | qtum(8) }} QTUM
                </span>
                <div class="is-clearfix"></div>
                <div class="output-script is-clearfix">
                  <div>
                    <span class="key">Type</span>
                    <span class="value">{{ output.scriptPubKey.type }}</span>
                  </div>
                  <div>
                    <span class="key">Script</span>
                    <code class="value">{{ output.scriptPubKey.asm }}</code>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'

  export default {
    head() {
      return {title: `Transaction ${this.id} -- QtumScan`}
    },
    data() {
      return {
        blockHeight: 0,
        block: {},
        time: 0,
        size: 0,
        isCoinbase: false,
        fees: 0,
        confirmations: 0,
        vin: [],
        vout: [],
        collapsed: true
      }
    },
    async asyncData({params, error}) {
      try {
        let transaction = await Transaction.get(params.id)
        let blockHash = await Block.getHash(transaction.blockHeight)
        let block = await Block.get(blockHash)
        return {
          blockHeight: transaction.blockHeight,
          time: transaction.time,
          size: transaction.size,
          isCoinbase: transaction.isCoinbase,
          fees: transaction.fees,
          confirmations: transaction.confirmations,
          vin: transaction.vin,
          vout: transaction.vout,
          block
        }
      } catch (err) {
        error({statusCode: 404, message: `Transaction ${params.id} not found`})
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      }
    },
    methods: {
      mergeInputs: Transaction.mergeInputs,
      mergeOutputs: Transaction.mergeOutputs
    }
  }
</script>

<style lang="less" scoped>
  .card {
    margin-top: 1em;
    margin-bottom: 1em;
    &:first-child {
      margin-top: 0.5em;
    }
  }

  .transaction-summary {
    .columns:first-child {
      margin-top: 0.25em;
    }
    .columns:last-child {
      margin-bottom: 0.25em;
    }
    .column {
      padding-top: 0.25em;
      padding-bottom: 0.25em;
    }
    .column:first-child {
      font-weight: bold;
    }
  }

  .transaction-item {
    padding-left: 1.5em;
    padding-right: 1.5em;

    .toggle-collapse {
      cursor: pointer;
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.2);
      }
    }

    .column:first-child {
      font-weight: normal;
    }
    &:first-child {
      margin-top: 0;
      &::before {
        display: none;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .collapse-top {
      padding-top: 0;
    }
    .collapse-bottom {
      padding-bottom: 0;
    }
    .arrow {
      flex: 0;
      line-height: 1.5em;
    }
    .amount {
      font-family: Monospace;
    }

    .output-script {
      font-size: 0.8em;
      word-break: break-all;
      .key {
        display: inline-block;
        margin-left: 1em;
        margin-right: 1em;
        font-weight: bold;
      }
    }
  }
</style>
