<template>
  <div id="RemoteDownload">
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item>远端上传</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <div id="input_area">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-select v-model="selectedMethod" placeholder="请选择方案">
            <el-option  label="天合公司-kafka">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button v-on:click="startDownload">开始</el-button>
        </el-col>
        <!--<el-col :span="5">-->
        <!--<el-input v-model="input1"-->
        <!--placeholder="请输入地址"-->
        <!--&gt;-->
        <!--</el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="3">-->
        <!--<el-input v-model="input2"-->
        <!--placeholder="请输入topic"-->
        <!--&gt;-->
        <!--</el-input>-->
        <!--</el-col>-->
      </el-row>
      <el-row :gutter="2">
        <el-table :data="tablaData">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="ip地址" prop="ip"></el-table-column>
          <el-table-column label="端口号" prop="port"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="运行状态" prop="status"></el-table-column>
          <el-table-column label="操作">
            <el-button size="mini" v-on:click="stopDownload">停止</el-button>
          </el-table-column>
        </el-table>
      </el-row>

    </div>
  </div>
</template>

<script>
  import * as link from '@/api/link'
  import axios from "axios"

  export default {
    name: "RemoteDownload",
    data() {
      return {
        input6: '',
        input1: '',
        input2: '',
        tablaData: [],
        status: '',
        selectedMethod:''
      }
    },
    created() {
      // this.getStatus()

      // var s ='true';
      // console.log('做了一次');
      // let that = this;
      // if (s === 'true') {
      //   var tempObj = {
      //     name: '天合公司-kafka',
      //     ip: '202.120.40.111',
      //     port: '8080',
      //     description: '由天合公司提供的kafka数据源',
      //     status: '正在运行'
      //   };
      //   var tempTable = [];
      //   tempTable.push(tempObj);
      //   that.tablaData = tempTable;
      // } else {
      //   that.tablaData = []
      // }
      this.getStatus()
      // this.timer = setInterval(() => {this.getStatus()})
    },
    methods: {
      startDownload: function () {
        let that = this;
        axios.get("/task/start").then(function () {
          that.getStatus()
        })
      },
      stopDownload: function () {
        let that = this;
        axios.get("/task/stop").then(function () {
          that.getStatus()
        })
      },
      getStatus: function () {
        let that = this;
        axios.get('/task/status').then(function (response) {
          var s = response.data['Msg'];
          console.log('查询一次');

          if (s === 'true') {
            var tempObj = {
              name: '天合公司-kafka',
              ip: '202.120.40.111',
              port: '8080',
              description: '由天合公司提供的kafka数据源',
              status: '正在运行'
            };
            var tempTable = [];
            tempTable.push(tempObj);
            that.tablaData = tempTable;
          } else {
            that.tablaData = []
          }
        })
      }
    }
  }
</script>
<style scoped>
  #input_area {
    margin-top: 10px;
    overflow: hidden;
  }

  #result_area {
    margin-top: 10px;
  }

  .el-row {
    margin-bottom: 10px;
  }


</style>
