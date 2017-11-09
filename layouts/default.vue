<template>
  <div id="app">
    <div class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item">QtumScan</router-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <router-link to="/" class="navbar-item">
              {{ $t('blockchain.blockchain') }}
            </router-link>
            <router-link to="/" class="navbar-item">
              {{ $tc('blockchain.token') }}
            </router-link>
          </div>
          <form class="navbar-end" @submit.prevent>
            <div class="navbar-item input-item">
              <input
                type="text" class="input"
                placeholder="Search by Block / Address / Transaction">
              <button type="submit" class="button is-primary">
                <span class="fa fa-search"></span>
              </button>
            </div>
          </form>
        </div>
      </nav>
    </div>
    <nuxt></nuxt>
  </div>
</template>

<style lang="less" scoped>
  .navbar-brand {
    font-size: 1.5rem;
  }
  .navbar-start .navbar-item {
    text-transform: uppercase;
  }
  .navbar-end {
    flex: auto;
    align-items: center;
    .navbar-item {
      flex: auto;
      position: relative;
      input {
        padding-right: 3em;
      }
      button {
        position: absolute;
        top: 0.5em;
        right: 1em;
      }
    }
  }
</style>
