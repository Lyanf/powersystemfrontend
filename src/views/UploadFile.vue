<template>
  <MyFrame>
    <el-row>
      <el-col span=3>
        <el-input placeholder="地区"></el-input>
      </el-col>
      <el-col span=3 offset=2>
        <el-input placeholder="时间"></el-input>
      </el-col>
      <el-col span=3 offset=2>
        <el-select></el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-button>查询</el-button>
      <el-button>增加</el-button>
      <el-button>删除</el-button>
      <el-button>修改</el-button>
            <el-button type="primary">可视化展示</el-button>
    </el-row>
    <el-row>
    </el-row>
    <el-table :data="tablaData">
      <el-table-column label="地区" prop="name"></el-table-column>
      <el-table-column label="年份" prop="ip"></el-table-column>
      <el-table-column label="GDP" prop="port"></el-table-column>
      <el-table-column label="一产业GDP" prop="description"></el-table-column>
      <el-table-column label="二产业GDP" prop="status"></el-table-column>
      <el-table-column label="建筑业GDP">
      </el-table-column>
    </el-table>
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
  .el-row {
    margin-bottom: 20px;
  }
</style>
