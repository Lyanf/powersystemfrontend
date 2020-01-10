<template>
  <my-frame>
    <BaseSelectInput title="行为画像特性分析" :loading="this.loading" @searchClicked="searchClicked" />
    <ProfileTable :table-data="allTableData"/>
    <pre id="show"/>
    <!-- <div id="chart1" style="height: 600px;width: 100%;"></div> -->
    <div id="chart2" style="height: 600px;width: 100%;"></div>
    <div id="chart3" style="height: 600px;width: 100%;"></div>
    <div id="chart4" style="height: 600px;width: 100%;"></div>
    <div id="chart5" style="height: 600px;width: 100%;"></div>
  </my-frame>
</template>

<script>
  import MyFrame from "../components/Frame";
  import ProfileTable from "../components/profileTable"
  import axios from "axios"
  import * as echarts from 'echarts';
  import BaseSelectInput from "../components/BaseSelectInput";
  import {loadingButton} from "../tool/toolFunc";

  export default {
    name: "profileFeature",
    components: {BaseSelectInput, MyFrame, ProfileTable},
    data: function () {
      return {
        hourX: '',
        dayX: '',
        hourList: [],
        dayList: [],
        allTableData: [],

        loading: false,
        allData: '',
      }
    },
    methods: {
      searchClicked: function (data) {
        let show = document.getElementById("show")
        let that = this;
        that.allData = data
        loadingButton(true,that)
        axios.post("/api/profileFeature",data).then(function (response) {

          that.allTableData = []
          that.allTableData.push(response.data.static)
          that.allTableData[0]["entropyh"] = response.data.dynamic.entropyh
          that.allTableData[0]["entropyd"] = response.data.dynamic.entropyd
          // let obj = response.data
          // show.innerHTML = JSON.stringify(obj,null,2);
          that.generateChart(response.data)
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
        }).finally(function () {
          loadingButton(false,that)
        });
      },
      generateChart: function (data) {
        let generateSeries = []
        let i = 0
        let arrlen = 0
        for (let tableElement in data.static.featurelineh) {
          i = i + 1
          let tempSeries = {}
          tempSeries.name = "典型特征模式曲线" + i + "（小时尺度)"
          tempSeries.type = 'line'
          tempSeries.smooth = 'true'
          tempSeries.data = data.static.featurelineh[tableElement]
          generateSeries.push(tempSeries)
          arrlen = data.static.featurelineh[tableElement].length
        }
        console.log(generateSeries)
        var option1 = {
          title: {
            text: "典型特征模式曲线（小时尺度）"
          },
          legend: {},
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: function () {
              var list = [];
              for (var i = 1; i <= arrlen; i++) {
                list.push(i)
              }
              return list;
            }()
          },
          yAxis: {
            scale: true,
            "min": "dataMin",
            type: 'value',
            minInterval: 0.01,

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
          },
        }


        // let chart1 = echarts.init(document.getElementById("chart1"));
        // chart1.setOption(option1)

        generateSeries = []
        i = 0
        arrlen = 0
        for (let tableElement in data.static.linearfeaturelined) {
          i = i + 1
          let tempSeries = {}
          tempSeries.name = "典型特征模式曲线" + i + "（天尺度)"
          tempSeries.type = 'line'
          tempSeries.smooth = 'true'
          tempSeries.data = data.static.linearfeaturelined[tableElement]
          generateSeries.push(tempSeries)
          arrlen = data.static.linearfeaturelined[tableElement].length
        }
        console.log(generateSeries)
        var option2 = {
          title: {
            text: "典型特征模式曲线（天尺度）"
          },
          legend: {},
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: function () {
              var list = [];
              for (var i = 1; i <= arrlen; i++) {
                list.push(i)
              }
              return list;
            }()
          },
          yAxis: {
            scale: true,
            "min": "dataMin",
            type: 'value',
            minInterval: 0.01,

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
        let chart2 = echarts.init(document.getElementById("chart2"), 'halloween');

        chart2.setOption(option2)

        generateSeries = []
        let tempSeries = {}
        tempSeries.name = "温度曲线"
        tempSeries.type = 'line'
        tempSeries.smooth = 'true'
        tempSeries.data = data.temp
        generateSeries.push(tempSeries)


        var option3 = {
          title: {
            text: "温度曲线"
          },
          legend: {},
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            name: "温度(℃)",
            boundaryGap: false,
            data: function () {
              var list = [];
              for (var i = 1; i <= 200; i++) {
                list.push(i)
              }
              return list;
            }()
          },
          yAxis: {
            scale: true,
            "min": "dataMin",
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
        let chart3 = echarts.init(document.getElementById("chart3"), 'halloween');

        chart3.setOption(option3)

        generateSeries = []
        tempSeries = {}
        tempSeries.name = "负荷曲线"
        tempSeries.type = 'line'
        tempSeries.smooth = 'true'
        tempSeries.data = data.load
        generateSeries.push(tempSeries)

        var option4 = {
          title: {
            text: "负荷曲线"
          },
          legend: {},
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            name: "负荷(KW)",
            boundaryGap: false,
            data: function () {
              var list = [];
              for (var i = 1; i <= 200; i++) {
                list.push(i)
              }
              return list;
            }()
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
        let chart4 = echarts.init(document.getElementById("chart4"), 'halloween');

        chart4.setOption(option4)


        generateSeries = []
        tempSeries = {}
        tempSeries.name = "温度负荷散点图"
        tempSeries.type = 'scatter'
        // tempSeries.symbolSize = 20
        tempSeries.data = data.scatter
        generateSeries.push(tempSeries)

        var option5 = {
          title: {
            text: "温度负荷散点图"
          },
          legend: {},
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name: "温度(℃)"
          },
          yAxis: {
            name: "负荷(KW)",
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
        let chart5 = echarts.init(document.getElementById("chart5"), 'halloween');

        chart5.setOption(option5)
      },
    },
    mounted() {
    }
  }

</script>

<style scoped>

</style>
