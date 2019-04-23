<template>
  <div id="RemoteDownload">
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item>远端上传</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <div id="input_area">
      <el-row :gutter="10">
        <el-col :span="3">
          <el-select >
            <el-option label="kafka">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input v-model="input1"
            placeholder="请输入地址"
            >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="input2"
            placeholder="请输入topic"
            >
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="2">
        <el-col :span="3">
          <el-button v-on:click="startDownload">开始</el-button>
        </el-col>
        <el-col :span="3">
          <el-button v-on:click="stopDownload">停止</el-button>
        </el-col>
      </el-row>

    </div>
    <div id="result_area">

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
        input1:'',
        input2:'',
      }
    },
    create() {

    },
    methods: {
      startDownload: function () {
        axios.get("/task/start")
      },
      stopDownload: function () {
        axios.get("/task/stop")
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
