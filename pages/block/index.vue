<template>
  <section class="container" ref="list">
    <form action="/block" method="GET" @submit.prevent="submit">
      <div class="control">
        <input type="date" class="input" name="date" v-model="date">
        <button type="submit" class="button is-qtum">{{ $t('action.go') }}</button>
      </div>
    </form>
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th>{{ $t('block.list.height') }}</th>
          <th>{{ $t('block.list.time') }}</th>
          <th class="is-hidden-touch">{{ $t('block.list.reward') }}</th>
          <th class="is-hidden-touch">{{ $t('block.list.mined_by') }}</th>
          <th class="is-hidden-touch">{{ $t('block.list.size') }}</th>
          <th>{{ $t('block.list.transactions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{height, timestamp, size, reward, minedBy, txLength} of list">
          <td>
            <BlockLink :block="height" :clipboard="false" />
          </td>
          <td>{{ timestamp | timestamp() }}</td>
          <td class="is-hidden-touch monospace">{{ reward | qtum(8) }} QTUM</td>
          <td class="is-hidden-touch">
            <AddressLink :address="minedBy" />
          </td>
          <td class="is-hidden-touch monospace">{{ size.toLocaleString() }}</td>
          <td>{{ txLength }}</td>
        </tr>
      </tbody>
    </table>
    <form action="/block" method="GET" @submit.prevent="submit">
      <div class="control">
        <input type="date" class="input" name="date" v-model="date">
        <button type="submit" class="button is-qtum">{{ $t('action.go') }}</button>
      </div>
    </form>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import {RequestError} from '@/services/qtuminfo-api'
  import {scrollIntoView} from '@/utils/dom'

  function formatTimestamp(date) {
    let yyyy = date.getFullYear().toString()
    let mm = (date.getMonth() + 1).toString().padStart(2, '0')
    let dd = date.getDate().toString().padStart(2, '0')
    return yyyy + '-' + mm + '-' + dd
  }

  function formatUTCTimestamp(date) {
    let yyyy = date.getUTCFullYear().toString()
    let mm = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    let dd = date.getUTCDate().toString().padStart(2, '0')
    return yyyy + '-' + mm + '-' + dd
  }

  export default {
    head() {
      return {
        title: this.$t('block.list.block_list')
      }
    },
    data() {
      return {
        list: [],
        date: ''
      }
    },
    async asyncData({req, query, redirect, error}) {
      let date = query.date && new Date(query.date)
      if (date && (
        date.toString() === 'Invalid Date'
        || date.getTime() < Date.parse('2017/09/06')
        || date.getTime() >= Date.now() + 1000 * 60 * 60 * 24
      )) {
        redirect('/block')
      }
      try {
        let list = await Block.getBlocksByDate(date, {ip: req && req.ip})
        return {list, date: formatTimestamp(date ? new Date(date) : new Date())}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    methods: {
      submit() {
        let date = new Date(this.date)
        if (date.toString() === 'Invalid Date') {
          return
        } else if (date.getTime() < Date.parse('2017-09-06')) {
          return
        } else if (date.getTime() >= Date.now() + 1000 * 60 * 60 * 24) {
          return
        }
        this.$router.push({name: 'block', query: {date: formatTimestamp(date)}})
      }
    },
    mounted() {
      this.$websocket.subscribe('block')
      this.$websocket.on('block', block => {
        block.txLength = block.tx.length
        let todayTimestamp = Date.parse(this.date + 'T00:00:00') / 1000
        if (block.timestamp >= todayTimestamp && block.timestamp < todayTimestamp + 60 * 60 * 24) {
          this.list.unshift(block)
        }
      })
    },
    beforeDestroy() {
      this.$websocket.unsubscribe('block')
    },
    async beforeRouteUpdate(to, from, next) {
      let date = to.query.date && new Date(to.query.date)
      if (date && (
        date.toString() === 'Invalid Date'
        || date.getTime() < Date.parse('2017-09-06')
        || date.getTime() >= Date.now() + 1000 * 60 * 60 * 24
      )) {
        this.$router.push({name: 'block'})
        return
      }
      this.list = await Block.getBlocksByDate(date)
      this.date = formatTimestamp(date)
      next()
      scrollIntoView(this.$refs.list)
    }
  }
</script>

<style lang="less" scoped>
  .table {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  form {
    display: flex;
    .control {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      > button {
        margin-left: 0.5em;
      }
      > input {
        width: 11em;
      }
    }
  }
</style>
