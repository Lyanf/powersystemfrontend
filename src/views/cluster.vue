<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>用电模式挖掘</span>
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
          <el-button type="primary" v-on:click="searchClicked">显示</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
    <div id="chart2" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import MyFrame from "../components/Frame";
  import * as echarts from 'echarts';
  import axios from "axios"

  export default {
    name: "cluster",
    components: {MyFrame},
    data: function () {
      return {
        factory: '',
        line: '',
        device: '',
        measurePoint: '',
        algorithm: '',
        date: '',
        metaDataTree: '',
        selectedMetaData: '',
        allMeasurePoint: [],
        hourX: '',
        dayX: '',
        hourList: [],
        dayList: [],
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
      generateSeries: function (dataList) {
        let seriesList = []
        for (let i in dataList) {
          let temp = {
            name: 'cluster' + i.toString(),
            type: 'line',
            smooth: 'true',
            data: dataList[i]
          }
          seriesList.push(temp)
        }
        return seriesList
      },
      searchClicked: function () {
        let chart1 = document.getElementById("chart1");
        let chart2 = document.getElementById("chart2");

        chart1 = echarts.init(chart1);
        chart2 = echarts.init(chart2);
        let that = this;
        axios.post("/api/cluster", {
          factory: that.factory,
          line: that.line,
          device: that.device,
          measurePoint: that.measurePoint,
          date: that.date
        }).then(function (response) {
          let data = response.data;
          that.hourX = data['hourX'];
          that.dayX = data['dayX'];
          that.dayList = data['dayList'];
          that.hourList = data['hourList'];

          let option1 = {
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
              text: "多时间尺度用能模式挖掘（小时）"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: that.hourX
            },
            yAxis: {scale: true},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: that.generateSeries(that.hourList)
          };
          let option2 = {
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
              text: "多时间尺度用能模式挖掘（天）"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: that.dayX
            },
            yAxis: {scale: true},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: that.generateSeries(that.dayList)
          };
          chart1.setOption(option1);
          chart2.setOption(option2);

        });
      },
    },
    mounted() {
      this.getMetaData();
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
