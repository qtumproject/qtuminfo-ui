<template>
  <div :class="noMargin? 'panel-main':'panel-main margin'" :style="{width:width,height:height}">
    <div class="panel-title">
      <div class="logo">
        <i :class="icon"></i>
        <!-- <img src="~/assets/sprites.png" alt=""> -->
        <span>{{title}}</span>
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
    icon: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    noMargin:{
      type:String,
      default:""
    }
  }
};
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
