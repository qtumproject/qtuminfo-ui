<template>
  <footer>
    <div class="container">
      <h3 class="is-size-4">CONTACT US</h3>
      <div class="line"></div>
      <a href="mailto:foundation@qtum.org">foundation@qtum.org</a>
      <ul class="links">
        <li>
          <a target="_blank" href="https://www.facebook.com/QtumOfficial/">
            <Icon icon="facebook"></Icon> Facebook
          </a>
        </li>
        <li>
          <a target="_blank" href="https://twitter.com/qtumofficial">
            <Icon icon="twitter"></Icon> Twitter
          </a>
        </li>
        <li>
          <a target="_blank" href="https://forum.qtum.org">
            <span class="qtum-icon qtum-icon--qtum"></span> Forum
          </a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/qtumproject/qtum">
            <Icon icon="github"></Icon> Github
          </a>
        </li>
      </ul>
      <div class="copyright">
        2017 QTUM Project &copy; All rights Reserved
      </div>
    </div>
  </footer>
</template>

<style lang="less" scoped>
  footer {
    padding-top: 6rem;
    padding-bottom: 6rem;
    background-color: #1a191e;
    text-align: center;
    color: white;
  }
  a:link, a:visited, a:hover, a:active {
    color: inherit;
  }
  .line {
    width: 2rem;
    height: 1px;
    margin: 0.5rem auto;
    background-color: white;
  }
  .links {
    display: flex;
    width: 40rem;
    margin: 2.5rem auto;
    padding: 0.5rem;
    border-bottom: 1px solid rgba(242, 242, 242, 0.2);
    justify-content: space-between;
  }
  span.fa, span.qtum-icon {
    font-size: 2em;
    vertical-align: middle;
  }
</style>
