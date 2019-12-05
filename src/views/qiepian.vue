<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>切片</span>
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
              <el-option v-for="item in allMeasurePoint" :value="item"/>
            </el-select>
          </el-col>
          <el-col :span=10>
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <!--          <el-col :span=4>-->
          <!--            <el-button type="primary" v-on:click="searchClicked">切块</el-button>-->
          <!--          </el-col>-->
        </el-row>
      </el-row>
      <el-row>
        <!--      <el-card>-->
        <!--        <div slot="header">-->
        <!--          <span>钻取</span>-->
        <!--        </div>-->
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
            <el-button type="primary" v-on:click="collectClicked">切片</el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-card>

    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Sidebar from "../components/Sidebar"
  import axios from "axios"
  import MyFrame from "../components/Frame";

  export default {
    name: "qiepian",
    components: {MyFrame, Sidebar},
    data: function () {
      return {
        factory: '',
        line: '',
        device: '',
        measurePoint: '',
        algorithm: '',
        collectContent: '',
        collectMethod: '',
        date: '',


        trueData: '',
        predictData: '',
        metaDataTree: '',
        selectedMetaData: '',
        allMeasurePoint: [],
        chartOption: {}
      }
    },
    methods: {
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
      collectClicked: function () {

      },
      searchClicked: function () {
        var chart1 = document.getElementById("chart1");

        chart1 = echarts.init(chart1);
        let that = this;
        axios.post("/api/predict", {
          factory: that.factory,
          line: that.line,
          device: that.device,
          measurePoint: that.measurePoint
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
              data: Array.from({length: 3835}, (a, i) => i)
            },
            yAxis: {scale: true},
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
