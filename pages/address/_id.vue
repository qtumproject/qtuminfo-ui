<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="address-card-o" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('address.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('address.address') }}</div>
          <div class="column info-value">
            <div v-for="address in id.split(',')">
              <AddressLink :address="address" plain />
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.balance') }}</div>
          <div class="column info-value monospace">
            {{ balance | qtum }} QTUM
            <span v-if="unconfirmedBalance !== '0' && stakingBalance !== '0'">
              ({{ unconfirmedBalance | qtum }} QTUM {{ $t('address.unconfirmed') }},
              {{ stakingBalance | qtum }} QTUM {{ $t('address.staking') }})
            </span>
            <span v-else-if="unconfirmedBalance !== '0'">
              ({{ unconfirmedBalance | qtum }} QTUM {{ $t('address.unconfirmed') }})
            </span>
            <span v-else-if="stakingBalance !== '0'">
              ({{ stakingBalance | qtum }} QTUM {{ $t('address.staking') }})
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_received') }}</div>
          <div class="column info-value monospace">{{ totalReceived | qtum }} QTUM</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_sent') }}</div>
          <div class="column info-value monospace">{{ totalSent | qtum }} QTUM</div>
        </div>
        <div class="columns" v-if="tokenBalances.length">
          <div class="column info-title">{{ $t('address.token_balances') }}</div>
          <div class="column info-value">
            <div v-for="token in tokenBalances" class="monospace">
              {{ token.balance | qrc20(token.decimals) }}
              <AddressLink :address="token.address">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.transaction_count') }}</div>
          <div class="column info-value">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div class="tabs is-centered">
      <ul>
        <li :class="{'is-active': $route.matched.some(route => route.name === 'address-id')}">
          <nuxt-link :to="{name: 'address-id', params: {id}}">
            {{ $t('address.transaction_list') }}
          </nuxt-link>
        </li>
        <li :class="{'is-active': $route.matched.some(route => route.name === 'address-id-balance')}">
          <nuxt-link :to="{name: 'address-id-balance', params: {id}}">
            {{ $t('address.balance_changes') }}
          </nuxt-link>
        </li>
        <li :class="{'is-active': $route.matched.some(route => route.name === 'address-id-token-balance')}">
          <nuxt-link :to="{name: 'address-id-token-balance', params: {id}}">
            {{ $t('address.token_balance_changes') }}
          </nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child :id="id" />
  </section>
</template>

<script>
  import Vue from 'vue'
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/qtuminfo-api'
  import {toHexAddress} from '@/utils/address'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.address') + ' ' + this.id
      }
    },
    data() {
      return {
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        unconfirmedBalance: '0',
        stakingBalance: '0',
        tokenBalances: [],
        totalCount: 0
      }
    },
    async asyncData({params, query, redirect, error}) {
      try {
        let address = await Address.get(params.id)
        return {
          balance: address.balance,
          totalReceived: address.totalReceived,
          totalSent: address.totalSent,
          unconfirmedBalance: address.unconfirmedBalance,
          stakingBalance: address.stakingBalance,
          tokenBalances: address.tokenBalances,
          totalCount: address.totalCount
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Address ${param.id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          throw err
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      }
    }
  }
</script>
