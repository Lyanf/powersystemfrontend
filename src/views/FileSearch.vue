<template>
  <el-container>
    <el-header>
      <NavMenu></NavMenu>
    </el-header>
    <el-container>
      <el-aside width='300px'>
        <Sidebar></Sidebar>
      </el-aside>
      <el-container class="container">
        <el-main class="main">
          <div id="input_area">
            <el-row :gutter="10">
              <el-col :span="10">
                <!--<el-input-->
                <!--placeholder="时间范围"-->
                <!--suffix-icon="el-icon-date"-->
                <!--v-model="input6">-->
                <!--</el-input>-->
                <el-date-picker
                  v-model="input1"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
              <el-col :span="5">
                <el-input
                  placeholder="上传人"
                  suffix-icon="el-icon-date"
                  v-model="input2">
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-input
                  placeholder="文件名"
                  suffix-icon="el-icon-date"
                  v-model="input3">
                </el-input>
              </el-col>

            </el-row>
            <el-row>
              <el-button v-on:click="searchButton">查询</el-button>
            </el-row>
          </div>
          <div>
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <!-- <el-table-column
                      prop="date"
                      label="日期"
                      width="180">
                    </el-table-column> -->
              <el-table-column
                prop="filename"
                label="文件名"
                width="180">
              </el-table-column>
              <!-- <el-table-column
                      prop="address"
                      label="地址"
                      width="180">
                    </el-table-column> -->
              <el-table-column
                label="上传人"
                prop="creator"
              >
                <!--<template slot-scope="scope">-->
                <!--<a :href="'/api/downloadFile/' + scope.row.fileID">-->
                <!--<el-progress :percentage="abc"></el-progress>-->
                <!--<span>alvis</span>-->

                <!--</a>-->
                <!-- <el-button type="text" size="small">编辑</el-button> -->
                <!--</template>-->
              </el-table-column>
              <el-table-column
                label="上传时间"
                prop="createtime"
              >
                <!--<template slot-scope="scope">-->
                <!--<a :href="'/api/downloadFile/' + scope.row.fileID">-->
                <!--<el-progress :percentage="abc"></el-progress>-->
                <!--<span>20190423</span>-->

                <!--</a>-->
                <!-- <el-button type="text" size="small">编辑</el-button> -->
                <!--</template>-->
              </el-table-column>
              <el-table-column
                label="文件大小"
                prop="size"
              >
                <!--<template slot-scope="scope">-->
                <!--<a :href="'/api/parseFile/' + scope.row.fileID">-->
                <!--<span>10M</span>-->
                <!--</a>-->
                <!--</template>-->
              </el-table-column>
              <el-table-column
                label="文件类型"
                prop="type"
              >
                <!--<template slot-scope="scope">-->
                <!--<a :href="'/api/parseFile/' + scope.row.fileID">-->
                <!--<span>源数据</span>-->
                <!--</a>-->
                <!--</template>-->
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <a :href="'/api/downloadFile/' + scope.row.fileid">
                    <!--<el-progress :percentage="abc"></el-progress>-->
                    <span>下载</span>

                  </a>
                  <!-- <el-button type="text" size="small">编辑</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>

    </el-container>
  </el-container>
</template>
<script>
  import * as link from '@/api/link'
  import axios from "axios";
  import echarts from "echarts";
  import NavMenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar";

  export default {
    name: 'FileSearch',
    components: {Sidebar, NavMenu},

    data() {

      return {
        input1: '',
        input2: '',
        input3: '',
        fileList: [],
        tableData: [],
        originTableData: [],
      }
    },
    created() {
      this.fetchData();
    },

    methods: {

      fetchData() {
        let that = this
        link.getFileList.r().then((res) => {
          that.tableData = res.data
          this.originTableData = this.tableData
          console.log(that.tableData)

        });
      },
      searchButton() {
        var startDate = '';
        var endDate = '';
        try {
          var startDay = addZero(this.input1[0].getDate());
          var startYear = (this.input1[0].getFullYear());
          var startMonth = addZero(parseInt(this.input1[0].getMonth()) + 1).toString();

          var endDay = addZero(this.input1[1].getDate());
          var endYear = (this.input1[1].getFullYear());
          var endMonth = addZero(parseInt(this.input1[1].getMonth()) + 1).toString();

          startDate = startYear + "-" + startMonth + "-" + startDay;
          endDate = endYear + "-" + endMonth + "-" + endDay;
        } catch (e) {

        }
        var creatorInput = this.input2;
        var fileNameInput = this.input3;
        var newTableData = []
        for (var obj of this.originTableData) {
          if (obj['filename'].includes(fileNameInput)) {
            if (obj['creator'].includes(creatorInput)) {
              if (startDate === "" || endDate === "") {
                newTableData.push(obj)
              }
              else{
                console.log(obj)
                console.log(startDate,endDate)
                if(startDate<=obj['createtime']&&endDate>=obj['createtime']){
                  newTableData.push(obj)
                }
              }
            }
          }
           }
        this.tableData = newTableData
      }


    }
  }

  function addZero(oristr) {
    var toristr = oristr.toString()
    return toristr.padStart(2,'0')
    // var tempLength = str.length
    // str = '00' + str;
    // return str.substring(str.length - 2, tempLength);
  }

</script>
<style type="text/css" scoped>
  .el-header {
    padding: 0px;
    margin-bottom: 10px;
  }

  .main {
    padding: 0px;
    margin-left: 10px;
  }

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
