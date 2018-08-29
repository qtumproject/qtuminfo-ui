export const Responsive = {
  data() {
    return {
      responsive: {
        isMobile: false,
        isTablet: true
      }
    }
  },
  methods: {
    $responsiveResize() {
      this.responsive.isMobile = document.documentElement.clientWidth <= 768
      this.responsive.isTablet = !this.responsive.isMobile
    }
  },
  created() {
    this.$responsive = {}
  },
  mounted() {
    this.$responsiveResize()
    window.addEventListener('resize', this.$responsiveResize, false)
  },
  beforeDestory() {
    window.removeEventListener('resize', this.resize)
  }
}
