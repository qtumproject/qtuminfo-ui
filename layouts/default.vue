<template>
  <div id="app">
    <header class="header-container">
      <Navigator />
    </header>
    <div class="background">
      <div class="main-container">
        <template v-if="$route.path !== '/'">
          <Breadcrumb />
        </template>
      </div>
      <nuxt />
    </div>
    <MyAddresses class="my-addresses" />
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script>
import Navigator from "@/components/header";
import Breadcrumb from "@/components/breadcrumb/index.vue";
import Footer from "@/components/footer";
import MyAddresses from "@/components/my-addresses.vue";

export default {
  head() {
    return {
      htmlAttrs: {
        lang: this.$store.state.locale.language
      }
    };
  },
  mounted() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          registration.update();
          setInterval(() => registration.update(), 3600 * 1000);
        });
    }
    if (window.Notification) {
      Notification.requestPermission();
    }
  },
  components: { Navigator, Breadcrumb, Footer, MyAddresses }
};
</script>

<style lang="less" scoped>
@import "../styles/variables.less";

.size(@data) {
  @result: (@data*0.75);
}

#app {
  display: flex;
  flex-direction: column;
  width:100%;

  min-height: 100vh;
  background: @title-blue;
}
.header-container {
  width: .size(1800px) [];
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
}
.main-container {
  width: .size(1600px) [];
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}
.container {
  width: .size(1600px) [];
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
}

.background {
  background-color: #f5f6f8;
}

.my-addresses {
  position: fixed;
  z-index: 100;
  @media (max-width: 768px) {
    bottom: 1em;
    right: 1em;
  }
  @media (min-width: 769px) {
    bottom: 2em;
    right: 2em;
  }
}
</style>
