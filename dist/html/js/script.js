new Vue({
  el: '#app',
  data () {
    return {
      siteInfo: null,
      loading: true,
      errored: false
    }
  },
  mounted () {
    axios
      .get('../siteInfo/data.json')
      .then(response => {
        this.siteInfo = response.data;
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
});
