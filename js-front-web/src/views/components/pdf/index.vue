<template>
  <div style="width: 100%;height: 100%;">
    <iframe name="fd-jspdf" id="fd-jspdf" frameborder="0" :src="`/web/viewer.html?file=${src}`" style="width:100%;height:100%;"></iframe>
  </div>
</template>

<script>

export default {
  name: 'Pdf',
  props:{
    src:{
      type: String,
      default:''
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
