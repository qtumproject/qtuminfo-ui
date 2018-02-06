<template>
  <nav class="pagination is-centered">
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
    </ul>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        showFull: true
      }
    },
    props: {
      pages: {type: Number, required: true},
      currentPage: {type: Number, required: true},
    },
    methods: {
      resize() {
        this.showFull = document.documentElement.clientWidth > 768
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
