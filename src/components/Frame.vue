<template>
  <div style="height: 100%;">
    <el-container>
      <el-header>
        <Navmenu></Navmenu>
      </el-header>
    </el-container>
    <el-container style="height: 100%;position: relative">
      <el-aside width="150px">
        <Sidebar></Sidebar>
      </el-aside>
      <el-main>
        <slot></slot>
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

  .main {
    padding: 0;
    margin-left: 10px;
  }
</style>
