<template lang="html">
  <div class="loading-page" v-if="loading">
    <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
  z-index: 100;
  .loader {
    width: 100vw;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dot {
    width: 16px;
    height: 16px;
    background: @qtum-blue;
    border-radius: 100%;
    margin-left: 10px;
    animation: slide 1s infinite;
  }
  .dot:nth-child(1) {
    animation-delay: 0.1s;
  }
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  .dot:nth-child(3) {
    animation-delay: 0.3s;
  }
  .dot:nth-child(4) {
    animation-delay: 0.4s;
  }
  .dot:nth-child(5) {
    animation-delay: 0.5s;
  }

  @keyframes slide {
    0% {
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>