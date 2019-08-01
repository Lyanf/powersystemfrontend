<template>
  <MyFrame>
    <RemoteDownload></RemoteDownload>
  </MyFrame>
</template>
<script type="text/javascript">
  import NavMenu from '@/components/NavMenu'
  import RemoteDownload from '@/components/RemoteDownload'
  import Sidebar from '@/components/Sidebar'
  import MyFrame from "../components/Frame";

  export default {
    name: 'remoteDownload',
    components: {MyFrame, NavMenu, RemoteDownload, Sidebar},
    created() {

    }
  }
</script>
<style type="text/css" scoped>
</style>
