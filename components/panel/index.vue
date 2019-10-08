<template>
  <div :class="noMargin? 'panel-main':'panel-main margin'" :style="{width:width,height:height}">
    <div class="panel-title" v-if="title || address.toString()">
      <div class="logo" v-if="!address.toString()">
        <i :class="icon"></i>
        <!-- <img src="~/assets/sprites.png" alt=""> -->
        <span :style="{fontSize:titleSize+'px'}">{{title}}</span>
      </div>
      <div v-if="address" class="select">
        <ul>
          <li
            :class="{'active': $route.matched.some(route => route.name === item.link)}"
            v-for="item in address"
          >
            <nuxt-link :to="{name: item.link, params: {id:item.id}}">{{item.name}}</nuxt-link>
          </li>
        </ul>
      </div>
      <template v-if="link">
        <nuxt-link :to="link" class="link">
          More
          <i class="arrow"></i>
        </nuxt-link>
      </template>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: "auto"
    },
    title: {
      type: String,
      default: ""
    },
    titleSize: {
      type: String,
      default: "16"
    },
    icon: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    noMargin: {
      type: String,
      default: ""
    },
    address: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang='less' scoped>
@import url("../../styles/components/panel.less");
</style>
