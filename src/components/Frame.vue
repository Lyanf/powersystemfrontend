<template>
  <div style="min-height: 100vh;background-color: #1b3157">
    <el-container>
      <el-header>
        <Navmenu/>
      </el-header>
    </el-container>
    <el-container style="height: 100%;position: relative;">
      <el-aside  style="min-height: 100vh;">
        <Sidebar/>
      </el-aside>
      <el-main>
        <slot/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import Navmenu from "./NavMenu";
  import Sidebar from "./Sidebar";

  export default {
    name: "MyFrame",
    components: {Sidebar, Navmenu}
  }
</script>

<style scoped>
  .el-header {
    padding: 0;
    margin-bottom: 0;
  }
  .main{
    padding: 0;
    margin-left: 10px;
    overflow: hidden;
  }
  .el-main{
    overflow-x: hidden;
  }
  .el-aside{
    overflow: hidden;
  }
</style>
