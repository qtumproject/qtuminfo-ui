<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="code" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('contract.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('contract.address') }}</div>
          <div class="column info-value">
            <AddressLink :address="id" plain />
          </div>
        </div>
        <template v-if="owner">
          <div class="columns">
            <div class="column info-title">{{ $t('contract.owner') }}</div>
            <div class="column info-value">
              <AddressLink :address="owner" />
            </div>
          </div>
          <div class="columns">
            <div class="column info-title">{{ $t('contract.create_transaction') }}</div>
            <div class="column info-value">
              <TransactionLink :transaction="txid" />
            </div>
          </div>
        </template>
        <template v-if="qrc20">
          <div class="columns" v-if="qrc20.name">
            <div class="column info-title">{{ $t('contract.token.name') }}</div>
            <div class="column info-value">{{ qrc20.name }}</div>
          </div>
          <div class="columns">
            <div class="column info-title">{{ $t('contract.token.total_supply') }}</div>
            <div class="column info-value monospace">
              {{ qrc20.totalSupply | qrc20(qrc20.decimals, true) }}
              {{ qrc20.symbol || $t('contract.token.tokens') }}
            </div>
          </div>
        </template>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.balance') }}</div>
          <div class="column info-value monospace">{{ balance | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.total_received') }}</div>
          <div class="column info-value monospace">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.total_sent') }}</div>
          <div class="column info-value monospace">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns" v-if="existingTokenBalances.length">
          <div class="column info-title">{{ $t('address.token_balances') }}</div>
          <div class="column info-value">
            <div v-for="token in existingTokenBalances" class="monospace">
              {{ token.balance | qrc20(token.decimals) }}
              <AddressLink :address="token.address">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('contract.transaction_count') }}</div>
          <div class="column info-value">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div v-if="totalCount" class="tabs is-centered">
      <ul>
        <li :class="{'is-active': $route.matched.some(route => route.name === 'contract-id')}">
          <nuxt-link :to="{name: 'contract-id', params: {id}}">
            {{ $t('contract.transaction_list') }}
          </nuxt-link>
        </li>
        <li
          v-if="type === 'qrc20'"
          :class="{'is-active': $route.matched.some(route => route.name === 'contract-id-rich-list')}">
          <nuxt-link :to="{name: 'contract-id-rich-list', params: {id}}">
            {{ $t('misc.rich_list_title') }}
          </nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child :qrc20="qrc20" />
  </section>
</template>

<script>
  import Contract from '@/models/contract'
  import {RequestError} from '@/services/qtuminfo-api'

  export default {
    head() {
      return {
        title: this.$t('blockchain.contract') + ' ' + this.id
      }
    },
    data() {
      return {
        txid: '',
        owner: '',
        type: '',
        qrc20: null,
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        tokenBalances: [],
        totalCount: 0
      }
    },
    async asyncData({req, params, query, redirect, error}) {
      try {
        let contract = await Contract.get(params.id)
        return {
          txid: contract.txid,
          owner: contract.owner,
          type: contract.type,
          qrc20: contract.qrc20,
          balance: contract.balance,
          totalReceived: contract.totalReceived,
          totalSent: contract.totalSent,
          tokenBalances: contract.tokenBalances,
          totalCount: contract.totalCount
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Contract ${param.id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      pages() {
        return Math.ceil(this.totalCount / 20)
      },
      existingTokenBalances() {
        return this.tokenBalances.filter(token => token.balance !== '0')
      }
    }
  }
</script>
