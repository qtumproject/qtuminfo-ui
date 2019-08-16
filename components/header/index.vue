<template>
  <div class="nav-container">
    <nuxt-link to="/" class="anchor">
      <span class="qtum-icon qtum-icon--qtum "></span>
      <span class="title">Qtum.info</span>
    </nuxt-link>
    <nav class="nav-list">
      <div class="nav-item">
        <div>
          <nuxt-link to="/block" class="nav-item-main">
            区块链
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>区块</li>
          <li>交易</li>
          <li>富豪榜</li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/12" class="nav-item-main">
            代币
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>区块</li>
          <li>交易</li>
          <li>富豪榜</li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/12" class="nav-item-main">
            资源
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>统计图表</li>
          <li>挖矿</li>
          <li>浏览器API</li>
          <li>测试网络</li>
          <li>工具箱</li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/12" class="nav-item-main">
            更多
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>官网</li>
          <li>论坛</li>
          <li>钱包&生态</li>
        </ul>
      </div>

      <Search class="search"/>
    </nav>
  </div>
</template>

<script>
import Search from "@/components/search";
export default {
  components: { Search }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>


