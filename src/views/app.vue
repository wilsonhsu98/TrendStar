<template lang="html">
  <div class="message">
    {{ message }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'Helo, Vue.js'
    }
  }
}
</script>

<style lang="scss">
.message {
  color: pink;
  font-size: 1.4em;
}
</style>