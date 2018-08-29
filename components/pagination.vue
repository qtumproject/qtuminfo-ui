<template>
  <nav class="pagination is-centered" :class="responsive.isTablet ? '' : 'is-small'">
    <ul class="pagination-list">
      <template v-if="responsive.isTablet">
        <li v-if="currentPage > 3">
          <nuxt-link :to="getLink(1)" class="pagination-link">1</nuxt-link>
        </li>
        <li v-if="currentPage > 4">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage > 2">
          <nuxt-link :to="getLink(currentPage - 2)" class="pagination-link">
            {{ currentPage - 2 }}
          </nuxt-link>
        </li>
      </template>
      <template v-else>
        <li v-if="currentPage > 2">
          <nuxt-link :to="getLink(1)" class="pagination-link">1</nuxt-link>
        </li>
        <li v-if="currentPage > 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
      </template>
      <li v-if="currentPage > 1">
        <nuxt-link :to="getLink(currentPage - 1)" class="pagination-link">
          {{ currentPage - 1 }}
        </nuxt-link>
      </li>
      <li>
        <a href="#" class="pagination-link is-current" @click.prevent>
          {{ currentPage }}
        </a>
      </li>
      <li v-if="currentPage < pages">
        <nuxt-link :to="getLink(currentPage + 1)" class="pagination-link">
          {{ currentPage + 1 }}
        </nuxt-link>
      </li>
      <template v-if="responsive.isTablet">
        <li v-if="currentPage < pages - 1">
          <nuxt-link :to="getLink(currentPage + 2)" class="pagination-link">
            {{ currentPage + 2 }}
          </nuxt-link>
        </li>
        <li v-if="currentPage < pages - 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage < pages - 2">
          <nuxt-link :to="getLink(pages)" class="pagination-link">
            {{ pages }}
          </nuxt-link>
        </li>
      </template>
      <template v-else>
        <li v-if="currentPage < pages - 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage < pages - 1">
          <nuxt-link :to="getLink(pages)" class="pagination-link">
            {{ pages }}
          </nuxt-link>
        </li>
      </template>
      <li>
        <form class="pagination-form" @submit.prevent="submit">
          <label class="label">{{ $t('pagination.go_to') }}</label>
          <div class="control">
            <input type="text" class="input has-text-centered" :class="{'is-small': !responsive.isTablet}"
              v-model="inputValue" ref="input">
          </div>
        </form>
      </li>
    </ul>
  </nav>
</template>

<script>
  import {Responsive} from '@/plugins/mixins'

  export default {
    mixins: [Responsive],
    data() {
      return {
        inputValue: ''
      }
    },
    props: {
      pages: {type: Number, required: true},
      currentPage: {type: Number, required: true},
      getLink: {type: Function, required: true}
    },
    methods: {
      submit() {
        let input = this.inputValue.trim()
        if (/^[1-9]\d*$/.test(input)) {
          let page = Number.parseInt(input)
          if (page <= this.pages && page !== this.currentPage) {
            this.$router.push(this.getLink(page))
          }
        }
      }
    },
    watch: {
      currentPage() {
        this.inputValue = ''
        this.$refs.input.blur()
      }
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
      @media (max-width: 768px) {
        width: 3em;
      }
    }
  }
</style>
