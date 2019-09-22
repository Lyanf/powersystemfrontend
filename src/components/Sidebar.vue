<template>

  <div id="aside" style="background-color:#545c64;height: 100%;">
    <el-menu

      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="isActive"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据库</span>
        </template>
        <el-menu-item index="/uploadFile">社会经济类数据</el-menu-item>
        <el-menu-item index="1-2">电力电量类数据</el-menu-item>
        <el-menu-item index="1-2">地理气象类数据</el-menu-item>
      </el-submenu>
      <el-menu-item index="/remotedownload">
        <i class="el-icon-upload"></i>
        <span slot="title">预测模型</span></el-menu-item>
<!--      <el-menu-item index="/remotedownload">-->
<!--        <i class="el-icon-upload"></i>-->
<!--        <span slot="title">远端上传</span>-->
<!--      </el-menu-item>-->
      <el-menu-item index="/filesearch">
        <i class="el-icon-message"></i>
        <span slot="title">数据统计分析</span>
      </el-menu-item>
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
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">查询数据</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/needAnalyse">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">需量分析</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/newSearch">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">用能查询</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/usageSurvey">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">分项用能概况</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/usageStatistics">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">分项用能统计</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/usageComparision">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">同比分析</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/predict">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">预测模块</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/cluster">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">用能模式挖掘</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/testapp">-->
<!--        <i class="el-icon-view"></i>-->
<!--        <span slot="title">测试模块</span>-->
<!--      </el-menu-item>-->


    </el-menu>
  </div>
</template>
<script type="text/javascript">
    import * as lgn from '@/api/link'
    import {setCookie, getCookie, delCookie} from '@/api/util'

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
