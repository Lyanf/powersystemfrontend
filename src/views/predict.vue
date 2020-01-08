<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>短期负荷预测</span>
      </div>
      <el-row>
        <el-col span=5>
          <el-cascader
            v-model="selectedMetaData"
            :options="metaDataTree"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            placeholder="请选择设备"
          />
        </el-col>
        <el-col span=5>
          <el-select value="" v-model="measurePoint" placeholder="测点选择">
            <el-option v-for="item in allMeasurePoint" :value="item"/>
          </el-select>
        </el-col>
        <el-col span=10>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col span=4>
          <el-button type="primary" :loading="this.flag" v-on:click="searchClicked">{{text}}</el-button>
        </el-col>
        <el-col span=5>
          <!--          <el-button type="primary" v-on:click="addCompare">添加对比</el-button>-->
        </el-col>
      </el-row>
    </el-card>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import axios from "axios"
  import MyFrame from "../components/Frame";
  import {getUnit} from "../tool/toolFunc";

  export default {
    name: "predict",
    components: {MyFrame, Navmenu, Sidebar},
    data: function () {
      return {
        factory: '',
        line: '',
        device: '',
        measurePoint: '',
        algorithm: '',
        date: '',
        trueData: '',
        predictData: '',
        metaDataTree: '',
        selectedMetaData: '',
        allMeasurePoint: [],
        chartOption: {},


        text: '计算',
        flag: false
      }
    },
    methods: {
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
      addCompare: function () {
        console.log("add compare")
      },
      handleChange: function () {
        this.factory = this.selectedMetaData[0];
        this.line = this.selectedMetaData[1];
        this.device = this.selectedMetaData[2];
      },
      getMetaData: function () {
        let that = this;
        axios.post("/api/getMetaDataTree").then(function (response) {
          that.metaDataTree = response.data
        });
        console.log(this.metaDataTree)
      },
      getAllMeasurePoint: function () {
        let that = this;
        axios.post("/api/getAllMeasurePoint").then(function (response) {
          that.allMeasurePoint = response.data
        });
        console.log(this.allMeasurePoint)
      },
      searchClicked: function () {
        let that = this
        var chart1 = document.getElementById("chart1");
        that.loadingButton(true)
        chart1 = echarts.init(chart1,'halloween');
        axios.post("/api/predict", {
          factory: that.factory,
          line: that.line,
          device: that.device,
          measurePoint: that.measurePoint,
          date:that.date
        }).then(function (response) {
          let data = response.data;
          that.trueData = data['y_true'];
          that.predictData = data['y_pred'];
          console.log(that.trueData)
          console.log(that.predictData)
          console.log([Array.from({length: 4000}, (a, i) => i)])
          var option1 = {
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
            },
            title: {
              text: "厂商用能预测图"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: Array.from({length: that.trueData.length}, (a, i) => i),
              name:'数据点'
            },
            yAxis: {scale: true,name:getUnit(that.measurePoint)},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              {
                name: '真实值',
                type: 'line',
                smooth: 'true',
                data: that.trueData
              },
              {
                name: '预测值',
                type: 'line',
                smooth: 'true',
                lineStyle: {
                  type: 'dashed'
                },
                data: that.predictData
              },
            ],
          };
          chart1.setOption(option1);
          that.loadingButton(false)
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
          that.loadingButton(false)
        });
      },
    },
    mounted() {
      this.getMetaData()
      this.getAllMeasurePoint()
    }
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
