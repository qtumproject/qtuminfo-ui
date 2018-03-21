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
            <div v-for="address in addresses">
              <AddressLink :address="address" :key="address" plain />
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.balance') }}</div>
          <div class="column info-value monospace">
            {{ balance | qtum }} QTUM
            <span v-if="unconfirmed !== '0' && staking !== '0'">
              ({{ unconfirmed | qtum }} QTUM {{ $t('address.unconfirmed') }},
              {{ staking | qtum }} QTUM {{ $t('address.staking') }})
            </span>
            <span v-else-if="unconfirmed !== '0'">
              ({{ unconfirmed | qtum }} QTUM {{ $t('address.unconfirmed') }})
            </span>
            <span v-else-if="staking !== '0'">
              ({{ staking | qtum }} QTUM {{ $t('address.staking') }})
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
        <div class="columns" v-if="balance !== '0'">
          <div class="column info-title">{{ $t('misc.ranking') }}</div>
          <div class="column info-value">{{ ranking }}</div>
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
  import {extendAddress} from '@/utils/address'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.address') + ' ' + this.id
      }
    },
    middleware: 'check-address',
    data() {
      return {
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        unconfirmed: '0',
        staking: '0',
        tokenBalances: [],
        ranking: 0,
        totalCount: 0
      }
    },
    async asyncData({req, params, query, redirect, error}) {
      try {
        let address = await Address.get(params.id, {ip: req && req.ip})
        return {
          balance: address.balance,
          totalReceived: address.totalReceived,
          totalSent: address.totalSent,
          unconfirmed: address.unconfirmed,
          staking: address.staking,
          tokenBalances: address.tokenBalances,
          ranking: address.ranking,
          totalCount: address.totalCount
        }
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      addresses() {
        let result = []
        for (let address of this.id.split(',')) {
          if (!result.includes(address)) {
            result.push(address)
          }
        }
        return result
      },
      existingTokenBalances() {
        return this.tokenBalances.filter(token => token.balance !== '0')
      }
    }
  }
</script>
