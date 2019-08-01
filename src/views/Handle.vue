<template>
  <MyFrame>
    <el-button>添加任务</el-button>
    <el-button>开始任务</el-button>
    <el-table></el-table>
  </MyFrame>
</template>

<script>
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar";
  import MyFrame from "../components/Frame";

  export default {
    name: "Handle",
    components: {MyFrame, Sidebar, Navmenu}
  }
</script>

<style scoped>
</style>
