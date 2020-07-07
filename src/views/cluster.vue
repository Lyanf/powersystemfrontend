<template>
  <MyFrame>
    <BaseSelectInput :loading="this.loading" title="用电模式挖掘" @searchClicked="searchClicked"/>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
    <div id="chart2" style="height: 600px;width: 100%;"></div>
    <div id="chart3" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import MyFrame from "../components/Frame";
  import * as echarts from 'echarts';
  import axios from "axios"
  import BaseSelectInput from "../components/BaseSelectInput";
  import {getMeasurePointAndUnit, getUnit, loadingButton} from "../tool/toolFunc";

  export default {
    name: "cluster",
    components: {BaseSelectInput, MyFrame},
    data: function () {
      return {
        hourX: '',
        dayX: '',
        hourList: [],
        dayList: [],


        loading:false,

        allData:''
      }
    },
    methods: {
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
      searchClicked: function (data) {
        let that = this
        that.allData = data
        let chart1 = document.getElementById("chart1");
        let chart2 = document.getElementById("chart2");
        let chart3 = document.getElementById("chart3");
        loadingButton(true,that)
        chart1 = echarts.init(chart1,'halloween');
        chart2 = echarts.init(chart2,'halloween');
        chart3 = echarts.init(chart3,'halloween');
        axios.post("/api/cluster", data).then(function (response) {
          let data = response.data;
          that.hourX = data.hourX;
          that.dayX = data.dayX;
          that.dayList = data['dayList'];
          that.hourList = data['hourList'];
          if (data.status === 'error'){
            throw Error
          }
          console.log(data)

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
              text: "多时间尺度用能模式挖掘（天）"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: that.dayX,
              // name:'数据点'
            },
            yAxis: {scale: true,name:getMeasurePointAndUnit(that.allData.measurePoint,0)},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: that.generateSeries(that.dayList)
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
              text: "多时间尺度用能模式挖掘（月）（保留功能）"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: that.dayX
            },
            yAxis: {scale: true,name:getMeasurePointAndUnit(that.allData.measurePoint,0)},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: that.generateSeries(that.dayList)
          }
          let option3 = {
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
              text: "多时间尺度用能模式挖掘（年）（保留功能）"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: that.dayX
            },
            yAxis: {scale: true,name:getMeasurePointAndUnit(that.allData.measurePoint,0)},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: that.generateSeries(that.dayList)
          }
          chart1.setOption(option1);
          chart2.setOption(option2);
          chart3.setOption(option3);


        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
        }).finally(function () {
          loadingButton(false,that)
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
