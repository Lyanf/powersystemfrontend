<template>
  <MyFrame></MyFrame>
</template>
<script type="text/javascript">
  import NavMenu from '@/components/NavMenu'
  import Content from '@/components/Content'
  import Sidebar from '@/components/Sidebar'
  import {getCookie} from '@/api/util'
  import MyFrame from "../components/Frame";
  export default {
    name: 'manage',
    components: {MyFrame, NavMenu,Content,Sidebar},
    created(){
      if(getCookie('username') == ""){
        this.$router.push({path:"/login"})
      }
    }
  }
</script>
<style type="text/css" scoped>
  .el-header{
    padding: 0px;
    margin-bottom: 10px;
  }

</style>
