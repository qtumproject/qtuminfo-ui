<template>
  <div class="nav-container">
    <nuxt-link to="/" class="anchor">
      <span class="qtum-icon qtum-icon--qtum"></span>
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
          <li>
            <nuxt-link to="/block">区块</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tx">交易</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/misc/rich-list">富豪榜</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/contract/tokens" class="nav-item-main">
            代币
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>
            <nuxt-link to="/contract/tokens">代币概览</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/">代币交易</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <span class="nav-item-main">
            资源
            <span></span>
          </span>
        </div>
        <ul>
          <li>
            <a href="https://chart.qtum.info/"  target="_Blank">统计图表</a>
          </li>
          <li>
            <nuxt-link to="/misc/biggest-miners">挖矿</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/misc/api">浏览器API</nuxt-link>
          </li>
          <li>
            <a href="https://testnet.qtum.info/"  target="_Blank">测试网络</a>
          </li>
          <li>工具箱</li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/" class="nav-item-main">
            更多
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li><a href="https://qtum.org/"  target="_Blank">官网</a></li>
          <li>
            <a href="https://forum.qtum.org/"  target="_Blank">论坛</a></li>
          <li><a href="https://qtumeco.io/wallet"  target="_Blank">钱包&生态</a></li></li>
        </ul>
      </div>

      <Search class="search" />
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
@import url('../../styles/components/header.less');
</style>


