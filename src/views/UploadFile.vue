<template>
    <MyFrame>
      <MiniUpload></MiniUpload>
    </MyFrame>
</template>
<script type="text/javascript">
  import NavMenu from '@/components/NavMenu'
  import UploadFile from '@/components/UploadFile'
  import Sidebar from '@/components/Sidebar'
  import {getCookie} from '@/api/util'
  import MiniUpload from "../components/MiniUpload";
  import MyFrame from "../components/Frame";

  export default {
    name: 'manage',
    components: {MyFrame, MiniUpload, NavMenu, UploadFile, Sidebar},
    created() {
      if (getCookie('username') == "") {
        this.$router.push({path: "/login"})
      }
    }
  }
</script>
<style type="text/css" scoped>
</style>
