<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>时空相关性分析</span>
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
    <el-table id="showTable"
              :data="tableData"
              border
              height="300"
              max-height="300"
    >
      <el-table-column
        type="index"
      >
      </el-table-column>
      <el-table-column
        prop="device"
        label="设备"
      >
      </el-table-column>
      <el-table-column
        prop="value"
        label="相关性"
      >
      </el-table-column>
    </el-table>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import MyFrame from "../components/Frame";
  import axios from "axios"
  import {getUnit} from "../tool/toolFunc"

  export default {
    name: "usageStatistics",
    components: {MyFrame, Navmenu, Sidebar},
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
        tableData: [],
        allMeasurePoint: [],
        correlationData: []
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
      searchClicked: function () {
        let that = this;
        axios.post("/api/correlation", {
          'factory': this.factory,
          'line': this.line,
          'device': this.device,
          'measurePoint': this.measurePoint,
          'date':this.date
        }).then(function (response) {
          let correlationValue = JSON.parse(response.data.correlationValue);
          let correlationData = JSON.parse(response.data['correlationData']);
          let tableData = [];
          for (let i in correlationValue) {
            let tempObj = {};
            tempObj['device'] = i;
            tempObj['value'] = correlationValue[i];
            tableData.push(tempObj)
          }
          that.tableData = tableData;
          that.correlationData = correlationData
          that.generateChart()
        })
      },
      generateChart: function () {
        let generateSeries = []
        for (let tableElement in this.correlationData) {
          if (tableElement === 'timestamp') {
            continue
          }
          let i = tableElement
          let tempSeries = {}
          tempSeries.name = i
          tempSeries.type = 'line'
          tempSeries.smooth = 'true'
          tempSeries.data = this.correlationData[i]
          generateSeries.push(tempSeries)
        }
        console.log(generateSeries)
        var option1 = {
          title: {
            text: "厂商用能同比分析"
          },
          legend: {},
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.correlationData.timestamp
          },
          yAxis: {scale: true, name: getUnit(this.measurePoint)},
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
        console.log(this.correlationData.timestamp)
        chart1.setOption(option1)
      }
    },
    mounted() {
      this.getAllMeasurePoint()
      this.getMetaData();
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
