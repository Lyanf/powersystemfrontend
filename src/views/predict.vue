<template>
  <MyFrame>
    <BaseSelectInput title="短期负荷预测" :loading="loading" @searchClicked="searchClicked"/>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import axios from "axios"
  import MyFrame from "../components/Frame";
  import {getMeasurePointAndUnit, getUnit, loadingButton} from "../tool/toolFunc";
  import BaseSelectInput from "../components/BaseSelectInput";

  export default {
    name: "predict",
    components: {BaseSelectInput, MyFrame, Navmenu, Sidebar},
    data: function () {
      return {
        trueData: '',
        predictData: '',
        chartOption: {},


        loading: false,
        allData: ''
      }
    },
    methods: {
      searchClicked: function (data) {
        let that = this
        that.allData = data
        var chart1 = document.getElementById("chart1");
        loadingButton(true, that)
        chart1 = echarts.init(chart1, 'halloween');
        axios.post("/api/predict", data).then(function (response) {
          let data = response.data;
          that.trueData = data['y_true'];
          that.predictData = data['y_pred'];
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
              text: "用户（设备）用能预测"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: Array.from({length: that.trueData.length}, (a, i) => i),
              // name: '数据点'
            },
            yAxis: {scale: true, name: getMeasurePointAndUnit(that.allData.measurePoint,0)},
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
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
        }).finally(function () {
          loadingButton(false, that)
        });
      },
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
