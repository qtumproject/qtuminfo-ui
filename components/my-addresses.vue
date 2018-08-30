<template>
  <div v-show="addresses.length">
    <button class="button is-qtum" @click="show = !show">
      <Icon icon="address-book" regular />
    </button>
    <table v-show="show">
      <tbody>
        <tr v-for="{address, balance} in list">
          <td class="address">
            <AddressLink :address="address" @click="show = false" />
          </td>
          <td class="monospace has-text-right">{{ balance | qtum(8) }}</td>
          <td>
            <Icon icon="trash" @click="remove(address)" />
          </td>
        </tr>
      </tbody>
      <tfoot v-if="addresses.length > 1">
        <tr>
          <td>
            <AddressLink :address="list.map(item => item.address).join(',')"
              :clipboard="false" @click="show = false">
              {{ $t('my_addresses.summary') }}
            </AddressLink>
          </td>
          <td class="monospace has-text-right">{{ totalBalance | qtum(8) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
  import BN from 'bn.js'
  import Address from '@/models/address'

  export default {
    data() {
      return {
        list: [],
        show: false
      }
    },
    computed: {
      addresses() {
        return this.$store.state.address.myAddresses
      },
      totalBalance() {
        let sum = new BN()
        for (let {balance} of this.list) {
          sum.iadd(new BN(balance))
        }
        return sum.toString()
      }
    },
    methods: {
      remove(address) {
        this.$store.commit('address/my-addresses/remove', address)
      },
      clickOutside(event) {
        if (this.$el !== event.target && !this.$el.contains(event.target)) {
          this.show = false
        }
      }
    },
    watch: {
      addresses() {
        let oldList = this.list
        this.list = this.addresses.map(address => ({address, balance: 0}))
        for (let item of this.list) {
          let oldItem = oldList.find(oldItem => oldItem.address === item.address)
          if (oldItem) {
            item.balance = oldItem.balance
          } else {
            Address.getBalance(item.address).then(
              balance => item.balance = balance,
              console.error.bind(console)
            )
          }
        }
      }
    },
    mounted() {
      let addresses = (localStorage.getItem('my-addresses') || '').split(',').filter(Boolean)
      this.$store.commit('address/my-addresses/add', addresses)
      document.body.addEventListener('click', this.clickOutside)
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.clickOutside)
    }
  }
</script>

<style scoped>
  table {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    right: 0;
    width: max-content;
    max-width: 90vw;
    border: 1px solid #666;
    background-color: white;
  }
  td {
    padding-left: 2px;
    padding-right: 2px;
  }
  .fas-trash {
    cursor: pointer;
  }
</style>
