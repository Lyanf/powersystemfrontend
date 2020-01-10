<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>用能查询</span>
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
        <el-col span=3>
          <el-button type="primary" :loading="this.flag" v-on:click="newSearchClicked">{{text}}</el-button>
        </el-col>
      </el-row>
    </el-card>
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
            prop="measurePoint"
            label="测点"
          >
          </el-table-column>
          <!--              <el-table-column-->
          <!--                prop="location"-->
          <!--                label="设备"-->
          <!--                width="180">-->
          <!--              </el-table-column>-->
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
    <!--  <el-row>-->
    <!--    <olap-table v-bind:table-data="tableData"/>-->
    <!--  </el-row>-->
    <el-row>
      <el-col span=5>
        <el-card style="height: 400px;">
          <div slot="header">
            <span>其他功能</span>
          </div>
          <el-row style="margin-top: 10px">
            <el-select value="" v-model="measurePoint1" placeholder="请选择电气量1">
              <el-option v-for="item in allMeasurePoint" :value="item"/>
            </el-select>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-select value="" v-model="measurePoint2" placeholder="请选择电气量2">
              <el-option v-for="item in allMeasurePoint" :value="item"/>
            </el-select>
          </el-row>
          <el-row style="margin-top: 100px;" gutter=30>
            <el-col :span=11>
              <el-button type="primary" v-on:click="exportExcel">导出表格</el-button>
            </el-col>
            <el-col :span=11>
              <el-button type="primary" v-on:click="generateChart">生成图表</el-button>
            </el-col>
          </el-row>
          <el-row gutter=30>
            <el-col :span=11>
              <el-button type="primary" v-on:click="clearChart">重置图表</el-button>
            </el-col>
            <el-col :span=11>
              <el-button type="primary" v-on:click="compareChart">数据对比</el-button>
            </el-col>
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
  import {getUnit} from "../tool/toolFunc"


  function fixDateFormat(oriDates) {
    let newDates = [];
    for (let oriDate of oriDates) {
      let tempDate = oriDate.slice(0, 4) + "-" + oriDate.slice(4, 6) + "-" + oriDate.slice(6, 8);
      newDates.push(tempDate)
    }
    return oriDates

  }

  export default {
    name: "newSearch",
    components: {OlapTable, MyFrame, Sidebar, Navmenu},
    data() {
      return {
        date: '',
        location: '',
        factory: '',
        line: '',
        device: '',
        allMeasurePoint: '',
        measurePoint: '',
        measurePoint1: '',
        measurePoint2: '',
        idate: '',
        tableData: '',
        chartRef: '',
        metaDataTree: '',
        selectedMetaData: '',

        showData: '',

        text: '计算',
        flag: false
      }
    },
    methods: {
      loadingButton: function (loading) {
        if (loading === true) {
          this.text = '计算中'
          this.flag = true
        } else {
          this.text = '计算'
          this.flag = false
        }
      },
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
      },
      getAllMeasurePoint: function () {
        let that = this;
        axios.post("/api/getAllMeasurePoint").then(function (response) {
          that.allMeasurePoint = response.data
        });
        console.log(this.allMeasurePoint)
      }
      ,
      exportExcel: function () {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.getElementById('showTable'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '示例表格.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
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
      searchClicked: function () {
        let that = this;
        axios.post('/api/getSpecificData',
          {
            factory: that.factory,
            line: that.line,
            device: that.device,
            timestamp: that.date

          }).then(function (response) {
          that.tableData = response.data;
        })
      }
      ,
      generateChart: function () {
        let date = this.getAllDate();
        let value = this.getValueByMeasurePoint(this.measurePoint1);
        let option = {
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
            data: (this.getAllDate()),
            name: '时间',

          },
          yAxis: {
            type: 'value',
            scale: true,
            name: getUnit(this.measurePoint1)
          },
          series: [{
            data: value,
            type: 'line',
            name: this.measurePoint1
          }],
        };
        let chart = echarts.init(document.getElementById("chart"), 'halloween');
        chart.setOption(option, true)
      }
      ,
      compareChart: function () {
        let date = this.getAllDate();
        let value1 = this.getValueByMeasurePoint(this.measurePoint1);
        let value2 = this.getValueByMeasurePoint(this.measurePoint2);
        let option = {
          title: {
            text: '电气量曲线',
            // subtext: '单'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            // data: ['电气量1', '电气量2']
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
            data: (this.getAllDate()),
            name: '时间',
          },
          yAxis: {
            type: 'value',
            scale: true,
            name: getUnit(this.measurePoint2)
          },
          series: [
            {
              data: value1,
              type: 'line',
              name: this.measurePoint1
            },
            {
              data: value2,
              type: 'line',
              name: this.measurePoint2
            }
          ]
        };
        let chart = echarts.init(document.getElementById("chart"), 'halloween');
        chart.setOption(option, true)
      }
      ,
      clearChart: function () {
        this.measurePoint1 = '';
        this.measurePoint2 = '';
        var chart = echarts.init(document.getElementById("chart"), 'halloween');
        this.$chart = chart;
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

        chart.setOption(option, true)
      }
      ,
      getMetaData: function () {
        let that = this;
        axios.post("/api/getMetaDataTree").then(function (response) {
          that.metaDataTree = response.data
        });
      }
      ,
      handleChange: function () {
        this.factory = this.selectedMetaData[0];
        this.line = this.selectedMetaData[1];
        this.device = this.selectedMetaData[2];
      }
      ,
      newSearchClicked: function () {
        let that = this;
        that.loadingButton(true)
        axios.post('/api/getSpecificData',
          {
            factory: this.factory,
            line: this.line,
            device: this.device,
            timestamp: this.date
          }).then(function (response) {
          that.tableData = response.data
        }).then(function () {
          that.handleCurrentChange(1)
          that.loadingButton(false)
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
          that.loadingButton(false)
        })
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

      chart.setOption(option, true)
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
