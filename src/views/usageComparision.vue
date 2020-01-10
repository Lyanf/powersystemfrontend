<template>
  <MyFrame>
    <BaseSelectInput :loading="this.loading" :showMul="false"  title="时空相关性分析"  @searchClicked="searchClicked"/>
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
  import {getUnit, loadingButton} from "../tool/toolFunc"
  import BaseSelectInput from "../components/BaseSelectInput";
  export default {
    name: "usageStatistics",
    components: {BaseSelectInput, MyFrame, Navmenu, Sidebar},
    data: function () {
      return {
        loading: false,
        allData: '',
      }
    },
    methods: {
      searchClicked: function (data) {
        let that = this;
        this.allData = data
        loadingButton(true, that)
        axios.post("/api/correlation", data).then(function (response) {
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
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
        }).finally(function () {
          loadingButton(false,that)
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
            data: this.correlationData.timestamp,
            name: '时间'
          },
          yAxis: {scale: true, name: getUnit(this.allData.measurePoint)},
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
        let chart1 = echarts.init(document.getElementById("chart1"), 'halloween');
        console.log(this.correlationData.timestamp)
        chart1.setOption(option1)
      }
    },
    mounted() {
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
