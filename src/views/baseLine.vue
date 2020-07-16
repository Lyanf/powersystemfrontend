<template>
  <my-frame>
    <BaseSelectInput :base-line="true" title="能耗基线提取" :loading="this.loading" @searchClicked="searchClicked" date-select="date"/>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </my-frame>
</template>

<script>
  import MyFrame from "../components/Frame";
  import axios from "axios"
  import * as echarts from 'echarts';
  import {getMeasurePointAndUnit, loadingButton} from "../tool/toolFunc";
  import BaseSelectInput from "../components/BaseSelectInput";

  export default {
    name: "baseLine",
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
        var chart1 = document.getElementById("chart1");
        loadingButton(true,that)
        chart1 = echarts.init(chart1, 'halloween');
        axios.post("/api/baseline",data).then(function (response) {
          let data = response.data;
          that.trueData = data.trueValue;
          that.predictData = data.baseValue;
          console.log(that.trueData)
          console.log(that.predictData)
          console.log([Array.from({length: 500}, (a, i) => i)])
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
              text: "能耗基线提取"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: Array.from({length: that.trueData.length}, (a, i) => i),
              // name:'数据点'
            },
            yAxis: {scale: true,name:getMeasurePointAndUnit(that.allData.measurePoint,0)},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              {
                name: '实际值',
                type: 'line',
                smooth: 'true',
                data: that.trueData
              },
              {
                name: '能耗基线',
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
          loadingButton(false,that)
        });
      },

    },
    mounted() {
    }
  }

</script>

<style scoped>

</style>
