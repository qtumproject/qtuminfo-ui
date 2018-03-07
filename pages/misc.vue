<template>
  <div class="container">
    <div class="tabs is-centered">
      <ul>
        <li :class="{'is-active': $route.matched.map(route => route.path).includes('/misc/rich-list')}">
          <nuxt-link to="/misc/rich-list">{{ $t('misc.rich_list_title') }}</nuxt-link>
        </li>
        <li :class="{'is-active': $route.matched.map(route => route.path).includes('/misc/biggest-miners')}">
          <nuxt-link to="/misc/biggest-miners">{{ $t('misc.biggest_miners_title') }}</nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child />
  </div>
</template>
