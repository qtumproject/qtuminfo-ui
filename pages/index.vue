<template>
  <div class="container">
    <section class="columns is-multiline is-desktop">
      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <span class="fa fa-cubes"></span>
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.block', 2) }}
            </h3>
          </div>
          <div class="card-body">
            <div v-for="block in recentBlocks" class="qtum-block is-size-7">
              <div class="level">
                <div class="level-left">
                  <nuxt-link :to="'/block/' + block.height" class="level-item qtum-block-box has-text-centered">
                    {{ $tc('blockchain.block', 1) }} #{{ block.height }}
                    <br>
                    {{ $moment(block.time * 1000).fromNow() }}
                  </nuxt-link>
                  <div class="level-item">
                    <div>
                      <i18n path="block.brief.address">
                        <nuxt-link :to="'/address/' + block.minedBy">{{ block.minedBy }}</nuxt-link>
                      </i18n>
                      <br>
                      {{ $t('block.brief.transaction', [block.txLength]) }}
                      {{ $t('block.brief.duration', [block.duration]) }}
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
              <span class="fa fa-list-alt"></span>
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.transaction', 2) }}
            </h3>
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
      return {title: 'QtumScan'}
    },
    data() {
      return {
        recentBlocks: []
      }
    },
    async asyncData() {
      let recentBlocks = await Block.getRecentBlocks()
      return {recentBlocks}
    }
  }
</script>

<style lang="less" scoped>
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
    min-width: 11em;
    padding: 1em;
    background-color: #eee;
    color: inherit;
    &:hover {
      outline: 1px solid #3273dc;
    }
  }
</style>
