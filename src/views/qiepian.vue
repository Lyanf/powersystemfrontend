<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>切片与切块</span>
      </div>
      <el-row>

        <el-row :gutter=20>
          <el-col :span=5>
            <el-cascader
              v-model="selectedMetaData"
              :options="metaDataTree"
              :props="{ expandTrigger: 'hover', multiple: 'true'  }"
              @change="handleChange"
              placeholder="请选择设备"
            />
          </el-col>
          <el-col :span=4>
            <el-select value="" multiple v-model="measurePoint" placeholder="测点选择">
              <el-option v-for="item in limitedMeasurePoint" :value="item"/>
            </el-select>
          </el-col>
          <el-col :span=10>
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="defaultTime"
            >
            </el-date-picker>
          </el-col>

        </el-row>
      </el-row>
      <el-row>

        <el-row :gutter=20>
          <el-col :span=4>
            <el-select value="" v-model="collectContent" placeholder="请选择聚合对象">
              <el-option value="用户"/>
              <el-option value="天"/>
              <el-option value="设备"/>
              <el-option value="设备+天"/>
            </el-select>
          </el-col>
          <el-col :span=4 push=1>
            <el-select value="" v-model="collectMethod" placeholder="请选择聚合方案">
              <el-option value="求和"/>
              <el-option value="求平均"/>
            </el-select>
          </el-col>
          <el-col :span=4 push=7>
            <el-button type="primary" :loading="flag" v-on:click="collectClicked">{{ text }}</el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
    <olap-table  :table-label="allTableLabel"  :table-data="allTableData"/>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
    <div id="chart2" style="min-height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Sidebar from "../components/Sidebar"
  import axios from "axios"
  import MyFrame from "../components/Frame";
  import OlapTable from "../components/olapTable";
  import {changeDateFormat, getUnit} from "../tool/toolFunc";

  export default {
    name: "qiepian",
    components: {OlapTable, MyFrame, Sidebar},
    computed:{
      defaultTime: function () {
        let temp = []
        temp[0] = "00:00:00"
        temp[1] = "23:59:59"
        return temp
      },
      limitedMeasurePoint: function(){
        let temp = []
        for(let one of this.allMeasurePoint){
          if (getUnit(one) == 'kWh' || getUnit(one) == 'kW' || getUnit(one)=='kVar' || getUnit(one)=='kVarh') {
            temp.push(one)
          }
        }
        return temp;
      }
    },
    data: function () {
      return {
        factory: '',
        line: '',
        device: '',
        measurePoint: [],
        algorithm: '',
        collectContent: '',
        collectMethod: '',
        date: [],
        p1:'',
        p2:'',
        p3:'',
        p4:'',
        p5:'',


        trueData: '',
        predictData: '',
        metaDataTree: '',
        selectedMetaData: [],
        allMeasurePoint: [],
        chartOption: {},
        allTableData:[],
        allTableLabel: [],
        text: "切片",
        flag: false,
      }
    },
    methods: {
      handleChange: function () {
        this.factory = this.selectedMetaData[0];
        this.line = this.selectedMetaData[1];
        this.device = this.selectedMetaData[2];
        // console.log(this.selectedMetaData)
      },
      getMetaData: function () {
        let that = this;
        axios.post("/api/getMetaDataTree").then(function (response) {
          that.metaDataTree = response.data
        });
        // console.log(this.metaDataTree)
      },
      getAllMeasurePoint: function () {
        let that = this;
        axios.post("/api/getAllMeasurePoint").then(function (response) {
          that.allMeasurePoint = response.data
        });
        // console.log(this.allMeasurePoint)
      },
      collectClicked: function () {

        this.searchClicked()

      },
      loadingButton: function (loading) {
        if (loading === true)
        {
          this.text = '计算中'
          this.flag = true
        }
        else{
          this.text = '计算'
          this.flag = false
        }
      },
      searchClicked: function (count = 0) {
        let that = this;
        that.loadingButton(true)

        axios.post("/api/qiepian", {
          p1: that.selectedMetaData,
          p2: that.measurePoint,
          p3: changeDateFormat(that.date),
          p4: that.collectContent,
          p5: that.collectMethod,

        }).then(function (response) {
          if (response.data.status === 'error'){
            throw Error
          }

          that.allTableLabel = response.data.header
          that.allTableData = response.data.content

          that.generateChart(response.data)
          that.loadingButton(false)

        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
          that.loadingButton(false)
        });
      },
      generateChart: function (data) {

        let generateSeries = []
        var plot1 = data["plot1"]
        var xlist = plot1.x
        var ylist = plot1.y
        var plot2 = data["plot2"]
        var xlist2 = plot2.x
        var ylist2 = plot2.y


        var legendlist = []
        for(var key in ylist){
          let tempSeries = {}
          legendlist.push(key)
          tempSeries.name = key
          tempSeries.type = 'bar'
          tempSeries.data = ylist[key]
          tempSeries.barMaxWidth = 30
          generateSeries.push(tempSeries)
        }



        // console.log(generateSeries)
        var option1 = {
            title: {
                text: "柱状图1"
            },
            legend: {
                  type: 'scroll',
                   orient: 'vertical',
                   right: 20,
                   top: 50,
                   bottom: 20,
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: xlist
            },
            yAxis: {
                scale: true,
                type: 'value',

            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: generateSeries,
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            }
        }
        let chart1 = echarts.init(document.getElementById("chart1"),'halloween');
        chart1.setOption(option1)
        legendlist = []
        generateSeries = []
        for(var key in ylist2){
          let tempSeries = {}
          tempSeries.name = key
          legendlist.push(key)
          tempSeries.type = 'bar'
          tempSeries.data = ylist2[key]
          tempSeries.barMaxWidth = 30
          generateSeries.push(tempSeries)
        }


        console.log(generateSeries)
        var option2 = {
            title: {
                text: "柱状图2"
            },
            legend: {
                  type: 'scroll',
                   orient: 'vertical',
                   right: 20,
                   top: 50,
                   bottom: 20,
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: xlist2
            },
            yAxis: {
                scale: true,
                type: 'value',

            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: generateSeries,
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            }
        }
        let chart2 = echarts.init(document.getElementById("chart2"),'halloween');
        chart2.clear()
        chart2.setOption(option2)
      }

    },
    mounted() {
      this.getMetaData()
      this.getAllMeasurePoint()
    },
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-card {
    margin-bottom: 20px;
  }
</style>
