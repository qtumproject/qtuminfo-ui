<template>
  <div class="container">
    <div class="columns is-multiline is-mobile">
      <section class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <span class="fa fa-cubes"></span>
            </div>
            <h3 class="card-header-title">
              {{ $t('blockchain.block', 2) }}
            </h3>
          </div>
          <div class="card-body">
            <div v-for="block in recentBlocks" class="qtum-block">
              <div class="level">
                <div class="level-left">
                  <div class="level-item qtum-block-box">
                    {{ $tc('blockchain.block', 1) }} {{ block.height }}
                    <br>
                    {{ $moment(block.time * 1000).fromNow() }}
                  </div>
                  <div class="level-item">
                    <div>
                      <i18n path="block.brief.address">
                        <a href="#">{{ block.minedBy }}</a>
                      </i18n>
                      <br>
                      <a href="#">{{ $t('block.brief.transaction', [block.txLength]) }}</a>
                      <template v-if="block.duration"> {{ $t('block.brief.duration', [block.duration]) }}</template>
                      <br>
                      {{ $t('block.brief.reward', [$printSatoshis(block.reward)]) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="column is-half">
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
      </section>
    </div>
  </div>
</template>

<script>
  import Block from "@/models/block"

  export default {
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
  .navbar-brand {
    font-size: 1.5rem;
  }
  .navbar-item {
    text-transform: uppercase;
  }

  .card-body {
    max-height: 30em;
    overflow: auto;
  }

  .qtum-block {
    padding: 1em;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
    font-size: 0.8em;
  }

  .qtum-block-box {
    min-width: 11em;
    padding: 1em;
    background-color: #eee;
    text-align: center;
  }
</style>
