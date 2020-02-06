<template>
  <MyFrame>
    <BaseSelectInput title="用能查询" :show-mul="true" :loading="this.loading" @searchClicked="searchClicked"/>
    <el-row>
      <el-col span=24>
        <el-table id="showTable"
                  :data="showData"
                  border
                  height="300"
                  max-height="300"
        >
          <!--              max-height="400px"-->
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="date"
            label="时间"
          >
          </el-table-column>
          <el-table-column
            prop="place"
            label="用户/设备"
          >
          </el-table-column>
          <el-table-column
            prop="value"
            label="值"
          >
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination style="left: auto;right: auto"
                         layout="prev, pager, next"
                         :total="tableData.length" :page-size="100"
                         @current-change="this.handleCurrentChange"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col span=5>
        <el-card style="height: 400px;">
          <div slot="header">
            <span>其他功能</span>
          </div>
          <el-row style="margin-top: 10px">
            <el-select value=""  v-model="newAddLine" placeholder="请选择要的用户/设备">
              <el-option v-for="item in this.allPlace" :value="item"/>
            </el-select>
          </el-row>
          <el-row style="margin-top: 100px;" gutter=30>
            <el-col :span=11>
              <el-button type="primary" v-on:click="generateChart">添加曲线</el-button>
            </el-col>
            <el-col :span=11>
              <el-button type="primary" v-on:click="exportExcel2(tableData)">导出表格</el-button>
            </el-col>
          </el-row>
          <el-row gutter=30>
            <el-col :span=11>
              <el-button type="primary" v-on:click="clearChart">重置图表</el-button>
            </el-col>
            <!--            <el-col :span=11>-->
            <!--              <el-button type="primary" v-on:click="compareChart">数据对比</el-button>-->
            <!--            </el-col>-->
          </el-row>
        </el-card>
      </el-col>
      <el-col span=18 push=1>
        <div id="chart" style="height: 400px ;"></div>
      </el-col>
    </el-row>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import axios from 'axios'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import MyFrame from "../components/Frame";
  import OlapTable from "../components/olapTable";
  import {getUnit, loadingButton} from "../tool/toolFunc"
  import BaseSelectInput from "../components/BaseSelectInput";


  function fixDateFormat(oriDates) {
    let newDates = [];
    for (let oriDate of oriDates) {
      let tempDate = oriDate.slice(0, 4) + "-" + oriDate.slice(4, 6) + "-" + oriDate.slice(6, 8);
      newDates.push(tempDate)
    }
    return oriDates

  }

  export default {
    name: "newSearch2",
    components: {BaseSelectInput, OlapTable, MyFrame, Sidebar, Navmenu},
    data() {
      return {
        allMeasurePoint: '',
        metaDataTree: '',


        showData: '',

        newAddLine: '',
        allPace: '',
        tableData: '',
        lineData: '',

        chartOption: '',

        text: '计算',
        loading: false
      }
    },
    methods: {
      handleCurrentChange: function (val) {
        console.log(val)
        let that = this
        let len = that.tableData.length
        let start = (val - 1) * 100
        let end = val * 100
        if (end > len) {
          end = len
        }
        that.showData = that.tableData.slice(start, end)
      }
      ,
      exportExcel: function () {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.getElementById('showTable'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '数据表格.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      }
      ,
      exportExcel2:function(jsonData){
        let str = `时间,用户/设备,值\n`;
        //增加\t为了不让表格显示科学计数法或者其他格式
        for(let i = 0 ; i < jsonData.length ; i++ ){
          for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;
          }
          str+='\n';
        }
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        //通过创建a标签实现
        let link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        link.download =  "json数据表.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      ,
      fixDateFormat: function (oriDate) {
        return oriDate.slice(0, 4) + "-" + oriDate.slice(4, 6) + "-" + oriDate.slice(6, 8)
      }
      ,
      getValueByMeasurePoint: function (imeasure) {
        let allValue = [];
        for (let i of this.tableData) {
          if (i.measurePoint === imeasure) {
            allValue.push(i.value)
          }
        }
        return allValue
      }
      ,
      getAllDate: function () {
        let allDate = new Set();
        for (let i of this.tableData) {
          allDate.add(i.date)
        }
        return Array.from(allDate)
      }
      ,
      searchClicked: function (data) {
        let show = document.getElementById("show")
        let that = this;
        that.allData = data
        loadingButton(true, that)
        axios.post("/api/getSpecificData2", data).then(function (response) {
          that.tableData = response.data.tableData
          that.lineData = response.data.lineData
          that.allPlace = response.data.allPlace
          that.handleCurrentChange(1)
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
        }).finally(function () {
          loadingButton(false, that)
        });
      }
      ,
      generateChart: function () {
        let chart = echarts.init(document.getElementById("chart"), 'halloween');
        this.chartOption['series'].push(
          {
            data: this.lineData[this.newAddLine],
            type: 'line',
            name: this.newAddLine
          })
        chart.setOption(this.chartOption, true)
        console.log(this.chartOption)
      }
      ,
      clearChart: function () {
        var chart = echarts.init(document.getElementById("chart"), 'halloween');
        var option = {
          title: {
            text: '电气量曲线',
            subtext: '初始案例'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['电气量1', '电气量2']
          },
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
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
          },
          series: [
            {
              name: '电气量1',
              type: 'line',
              data: [11, 11, 15, 13, 12, 13, 10],
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            },
            {
              name: '电气量2',
              type: 'line',
              data: [1, -2, 2, 5, 3, 2, 0],
              markPoint: {
                data: [
                  {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'},
                  [{
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                  }, {
                    symbol: 'circle',
                    label: {
                      normal: {
                        position: 'start',
                        formatter: '最大值'
                      }
                    },
                    type: 'max',
                    name: '最高点'
                  }]
                ]
              }
            }
          ]
        };
        this.chartOption = {
          title: {
            text: '电气量曲线'
            // subtext: '单'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
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
          xAxis: {
            type: 'category',
            // data: (this.getAllDate()),
            name: '时间',

          },
          yAxis: {
            type: 'value',
            scale: true,
            name: getUnit(this.measurePoint)
          },
          series: [],
        }


        chart.setOption(option, true)
      }

    },
    mounted() {
      var chart = echarts.init(document.getElementById("chart"), 'halloween');
      var option = {
        title: {
          text: '电气量曲线',
          subtext: '初始案例'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['电气量1', '电气量2']
        },
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
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          scale: true,
        },
        series: [
          {
            name: '电气量1',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            }
          },
          {
            name: '电气量2',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [
                {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
              ]
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'},
                [{
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                }, {
                  symbol: 'circle',
                  label: {
                    normal: {
                      position: 'start',
                      formatter: '最大值'
                    }
                  },
                  type: 'max',
                  name: '最高点'
                }]
              ]
            }
          }
        ]
      };

      this.chartOption = {
        title: {
          text: '电气量曲线'
          // subtext: '单'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
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
        xAxis: {
          type: 'category',
          // data: (this.getAllDate()),
          name: '时间',

        },
        yAxis: {
          type: 'value',
          scale: true,
          name: getUnit(this.measurePoint)
        },
        series: [],
      }


      chart.setOption(option, true)
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
