<template>
  <MyFrame>
    <el-row gutter=30>
      <el-col span=2>
        <el-select value="长期"></el-select>
      </el-col>
      <el-col span=4>

        <el-select value="传统预测模型库"></el-select>
      </el-col>
      <el-col span=6>

        <el-select placeholder="选择相关因素"></el-select>
      </el-col>
      <el-col span=2>

        <el-input placeholder="历史年份"></el-input>
      </el-col>
      <el-col span=2>

        <el-input placeholder="预测年份"></el-input>
      </el-col>
      <el-col span= 2 >
        <el-button type="primary">开始预测</el-button>
      </el-col>
            <el-col span= 2 >
        <el-button type="primary">误差分析</el-button>
      </el-col>
                  <el-col span= 2 >
        <el-button type="primary">可视化展示</el-button>
      </el-col>
    </el-row>
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
