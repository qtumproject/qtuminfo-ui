<template>
  <nav class="pagination is-centered" :class="showFull ? '' : 'is-small'">
    <ul class="pagination-list">
      <template v-if="showFull">
        <li v-if="currentPage > 2">
          <a href="#" class="pagination-link" @click.prevent="$emit('page', 0)">
            1
          </a>
        </li>
        <li v-if="currentPage > 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage > 1">
          <a href="#" class="pagination-link" @click.prevent="$emit('page', currentPage - 2)">
            {{ currentPage - 1 }}
          </a>
        </li>
      </template>
      <template v-else>
        <li v-if="currentPage > 1">
          <a href="#" class="pagination-link" @click.prevent="$emit('page', 0)">
            1
          </a>
        </li>
        <li v-if="currentPage > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
      </template>
      <li v-if="currentPage > 0">
        <a href="#" class="pagination-link" @click.prevent="$emit('page', currentPage - 1)">
          {{ currentPage }}
        </a>
      </li>
      <li>
        <a href="#" class="pagination-link is-current" @click.prevent>
          {{ currentPage + 1 }}
        </a>
      </li>
      <li v-if="currentPage < pages - 1">
        <a href="#" class="pagination-link" @click.prevent="$emit('page', currentPage + 1)">
          {{ currentPage + 2 }}
        </a>
      </li>
      <template v-if="showFull">
        <li v-if="currentPage < pages - 2">
          <a href="#" class="pagination-link" @click.prevent="$emit('page', currentPage + 2)">
            {{ currentPage + 3 }}
          </a>
        </li>
        <li v-if="currentPage < pages - 4">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage < pages - 3">
          <a href="#" class="pagination-link" @click.prevent="$emit('page', pages - 1)">
            {{ pages }}
          </a>
        </li>
      </template>
      <template v-else>
        <li v-if="currentPage < pages - 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage < pages - 2">
          <a href="#" class="pagination-link" @click.prevent="$emit('page', pages - 1)">
            {{ pages }}
          </a>
        </li>
      </template>
      <li>
        <form class="pagination-form" @submit.prevent="submit">
          <label class="label">{{ $t('pagination.go_to') }}</label>
          <div class="control">
            <input type="text" class="input" :class="{'is-small': !showFull}" v-model="inputValue" ref="input">
          </div>
        </form>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        showFull: true,
        inputValue: ''
      }
    },
    props: {
      pages: {type: Number, required: true},
      currentPage: {type: Number, required: true},
    },
    methods: {
      resize() {
        this.showFull = document.documentElement.clientWidth > 768
      },
      submit() {
        let input = this.inputValue.trim()
        if (/^[1-9]\d*$/.test(input)) {
          let page = Number.parseInt(input) - 1
          if (page < this.pages && page !== this.currentPage) {
            this.$emit('page', page)
          }
        }
      }
    },
    watch: {
      currentPage() {
        this.inputValue = ''
        this.$refs.input.blur()
      }
    },
    mounted() {
      this.resize()
      window.addEventListener('resize', this.resize, false)
    },
    beforeDestory() {
      window.removeEventListener('resize', this.resize)
    }
  }
</script>

<style lang="less" scoped>
  .pagination-form {
    margin-left: 2em;
    .label {
      display: inline-block;
      margin-bottom: 0;
      margin-right: 0.5em;
      @media (min-width: 769px) {
        line-height: 2;
      }
    }
    .control {
      display: inline-block;
      width: 3.5em;
      vertical-align: middle;
    }
  }
</style>
