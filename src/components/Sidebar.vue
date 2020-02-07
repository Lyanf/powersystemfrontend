<template>

  <div id="aside" style="background-color:#4f58db;height: 100%;">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#4f58db"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="isActive"
    >
      <el-submenu index=4>
        <template slot="title">
          <i class="el-icon-location"/>
          <span>上传文件</span>
        </template>
        <el-menu-item index="/uploadfile">
          <i class="el-icon-upload2"/>
          <span slot="title">本地上传</span>
        </el-menu-item>
        <el-menu-item index="/remotedownload">
          <i class="el-icon-upload"/>
          <span slot="title">远端上传</span>
        </el-menu-item>
        <el-menu-item index="/filesearch">
          <i class="el-icon-message"/>
          <span slot="title">文件查看</span>
        </el-menu-item>
      </el-submenu>
      <!--<el-menu-item index="/metadata">-->
      <!--<i class="el-icon-tickets"></i>-->
      <!--<span slot="title">元数据管理</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="/conceptLayer">-->
      <!--<i class="el-icon-tickets"></i>-->
      <!--<span slot="title">概念层业务元数据管理</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="/logicLayer">-->
      <!--<i class="el-icon-tickets"></i>-->
      <!--<span slot="title">逻辑层业务元数据管理</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="/physicsLayer">-->
      <!--<i class="el-icon-tickets"></i>-->
      <!--<span slot="title">物理层元数据管理</span>-->
      <!--</el-menu-item>-->
      <!--      <el-menu-item index="/handledata">-->
      <!--        <i class="el-icon-printer"></i>-->
      <!--        <span slot="title">处理入库</span>-->
      <!--      </el-menu-item>-->
      <!--      <el-menu-item index="/inquire">-->
      <!--        <i class="el-icon-view"/>-->
      <!--        <span slot="title">查询数据</span>-->
      <!--      </el-menu-item>-->
      <!--      <el-menu-item index="/needAnalyse">-->
      <!--        <i class="el-icon-view"/>-->
      <!--        <span slot="title">需量分析</span>-->
      <!--      </el-menu-item>-->
      <el-menu-item index="/newSearch">
        <i class="el-icon-view"/>
        <span slot="title">用能查询（多测点）</span>
      </el-menu-item>
      <el-menu-item index="/newSearch2">
        <i class="el-icon-view"/>
        <span slot="title">用能查询（多用户）</span>
      </el-menu-item>
      <el-submenu index=1>
        <template slot="title">
          <i class="el-icon-location"/>
          <span>olap分析</span>
        </template>
        <el-menu-item index="/qiepian">
          <i class="el-icon-view"/>
          <span slot="title">切片与切块</span>
        </el-menu-item>
        <el-menu-item index="/zuanqu">
          <i class="el-icon-view"/>
          <span slot="title">钻取</span>
        </el-menu-item>
        <el-menu-item index="/xuanzhuan">
          <i class="el-icon-view"/>
          <span slot="title">旋转</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index=2>
        <template slot="title">
          <i class="el-icon-location"/>
          <span>多维度时空分析</span>
        </template>
        <el-menu-item index="/usageComparision">
          <i class="el-icon-view"/>
          <span slot="title">时空相关性分析</span>
        </el-menu-item>
        <el-menu-item index="/profileFeature">
          <i class="el-icon-view"/>
          <span slot="title">行为画像特性分析  </span>
        </el-menu-item>
      </el-submenu>
      <!--      <el-menu-item index="/usageSurvey">-->
      <!--        <i class="el-icon-view"/>-->
      <!--        <span slot="title">分项用能概况</span>-->
      <!--      </el-menu-item>-->
      <!--      <el-menu-item index="/usageStatistics">-->
      <!--        <i class="el-icon-view"/>-->
      <!--        <span slot="title">分项用能统计</span>-->
      <!--      </el-menu-item>-->
      <el-menu-item index="/baseLine">
        <i class="el-icon-view"/>
        <span slot="title">能耗基线提取</span>
      </el-menu-item>
      <el-submenu index=3>
        <template slot="title">
          <i class="el-icon-location"/>
          <span>模式挖掘与建模预测</span>
        </template>
        <el-menu-item index="/cluster">
          <i class="el-icon-view"/>
          <span slot="title">用电模式挖掘</span>
        </el-menu-item>
        <el-menu-item index="/predict">
          <i class="el-icon-view"/>
          <span slot="title">短期负荷预测  </span>
        </el-menu-item>
      </el-submenu>

<!--      <el-menu-item index="/testapp">-->
<!--        <i class="el-icon-view"/>-->
<!--        <span slot="title">测试模块</span>-->
<!--      </el-menu-item>-->


    </el-menu>
  </div>
</template>
<script type="text/javascript">

  export default {
    name: 'sidebar',
    data() {
      return {
        isActive: true,

      }
    },
    created() {

    },
  }
</script>
<style type="text/css" scoped>
  /*a {*/
  /*text-decoration: none*/
  /*}*/

  /*#aside {*/
  /*  width: 100%;*/
  /*  min-height: calc(100vh - 60px);*/
  /*  background-color: rgb(244, 251, 254);*/
  /*  overflow: hidden;*/
  /*}*/


</style>
