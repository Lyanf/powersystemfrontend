<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>OLAP-旋转</span>
      </div>
      <el-row>
        <el-col span=5>
          <el-cascader
            v-model="selectedMetaData"
            :options="metaDataTree"
            :props="{ 'checkStrictly': 'true' }"
            expandTrigger = "hover"
            @change="handleChange" clearable="true">
            <!--            placeholder="请选择设备" clearable-->
          </el-cascader>
        </el-col>
        <el-col span=10 push=3>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col span=3 push=4>
          <el-button type="primary" v-on:click="newSearchClicked">查询</el-button>
        </el-col>
        <el-col span=3 push=3>
          <el-button type="primary">旋转</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col span=24>
        <el-table id="showTable"
                  :data="tableData"
                  border
                  stripe
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
            label="日期"
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
      </el-col>
    </el-row>
    <el-row>
      <el-col span=5>
        <el-card style="height: 400px;">
          <div slot="header">
            <span>其他功能</span>
          </div>
          <el-row style="margin-top: 10px">
            <el-select value="" v-model="measurePoint1" placeholder="请选择电气量1">
              <el-option value="线电流Ia"></el-option>
              <el-option value="线电流Ib"></el-option>
              <el-option value="线电流Ic"></el-option>
              <el-option value="A相电压"></el-option>
              <el-option value="C相电压"></el-option>
              <el-option value="AB线电压"></el-option>
              <el-option value="BC线电压"></el-option>
              <el-option value="CA线电压"></el-option>
              <el-option value="反向有功电度"></el-option>
              <el-option value="正向有功电度"></el-option>
              <el-option value="反向无功电度"></el-option>
              <el-option value="正向无功电度"></el-option>
            </el-select>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-select value="" v-model="measurePoint2" placeholder="请选择电气量2">
              <el-option value="线电流Ia"></el-option>
              <el-option value="线电流Ib"></el-option>
              <el-option value="线电流Ic"></el-option>
              <el-option value="A相电压"></el-option>
              <el-option value="C相电压"></el-option>
              <el-option value="AB线电压"></el-option>
              <el-option value="BC线电压"></el-option>
              <el-option value="CA线电压"></el-option>
              <el-option value="反向有功电度"></el-option>
              <el-option value="正向有功电度"></el-option>
              <el-option value="反向无功电度"></el-option>
              <el-option value="正向无功电度"></el-option>
            </el-select>
          </el-row>
          <el-row style="margin-top: 100px;">
            <el-button type="primary" v-on:click="exportExcel">导出表格</el-button>
            <el-button type="primary" v-on:click="generateChart">生成图表</el-button>
          </el-row>
          <el-row>
            <el-button type="primary" v-on:click="clearChart">重置图表</el-button>

            <el-button type="primary" v-on:click="compareChart">数据对比</el-button>

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

    function fixDateFormat(oriDates) {
        let newDates = [];
        for (let oriDate of oriDates) {
            let tempDate = oriDate.slice(0, 4) + "-" + oriDate.slice(4, 6) + "-" + oriDate.slice(6, 8);
            newDates.push(tempDate)
        }
        return oriDates

    }

    export default {
        name: "olap3",
        components: {MyFrame, Sidebar, Navmenu},
        data() {
            return {
                date: '',
                location: '',
                factory: '',
                line: '',
                device: '',
                measurePoint: '',
                measurePoint1: '',
                measurePoint2: '',
                idate: '',
                tableData: '',
                chartRef: '',
                metaDataTree: '',
                selectedMetaData: '',
                options: [{
                    value: 'zhinan',
                    label: '指南',
                    children: [{
                        value: 'shejiyuanze',
                        label: '设计原则',
                        children: [{
                            value: 'yizhi',
                            label: '一致'
                        }, {
                            value: 'fankui',
                            label: '反馈'
                        }, {
                            value: 'xiaolv',
                            label: '效率'
                        }, {
                            value: 'kekong',
                            label: '可控'
                        }]
                    }, {
                        value: 'daohang',
                        label: '导航',
                        children: [{
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                        }, {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                        }]
                    }]
                }, {
                    value: 'zujian',
                    label: '组件',
                    children: [{
                        value: 'basic',
                        label: 'Basic',
                        children: [{
                            value: 'layout',
                            label: 'Layout 布局'
                        }, {
                            value: 'color',
                            label: 'Color 色彩'
                        }, {
                            value: 'typography',
                            label: 'Typography 字体'
                        }, {
                            value: 'icon',
                            label: 'Icon 图标'
                        }, {
                            value: 'button',
                            label: 'Button 按钮'
                        }]
                    }, {
                        value: 'form',
                        label: 'Form',
                        children: [{
                            value: 'radio',
                            label: 'Radio 单选框'
                        }, {
                            value: 'checkbox',
                            label: 'Checkbox 多选框'
                        }, {
                            value: 'input',
                            label: 'Input 输入框'
                        }, {
                            value: 'input-number',
                            label: 'InputNumber 计数器'
                        }, {
                            value: 'select',
                            label: 'Select 选择器'
                        }, {
                            value: 'cascader',
                            label: 'Cascader 级联选择器'
                        }, {
                            value: 'switch',
                            label: 'Switch 开关'
                        }, {
                            value: 'slider',
                            label: 'Slider 滑块'
                        }, {
                            value: 'time-picker',
                            label: 'TimePicker 时间选择器'
                        }, {
                            value: 'date-picker',
                            label: 'DatePicker 日期选择器'
                        }, {
                            value: 'datetime-picker',
                            label: 'DateTimePicker 日期时间选择器'
                        }, {
                            value: 'upload',
                            label: 'Upload 上传'
                        }, {
                            value: 'rate',
                            label: 'Rate 评分'
                        }, {
                            value: 'form',
                            label: 'Form 表单'
                        }]
                    }, {
                        value: 'data',
                        label: 'Data',
                        children: [{
                            value: 'table',
                            label: 'Table 表格'
                        }, {
                            value: 'tag',
                            label: 'Tag 标签'
                        }, {
                            value: 'progress',
                            label: 'Progress 进度条'
                        }, {
                            value: 'tree',
                            label: 'Tree 树形控件'
                        }, {
                            value: 'pagination',
                            label: 'Pagination 分页'
                        }, {
                            value: 'badge',
                            label: 'Badge 标记'
                        }]
                    }, {
                        value: 'notice',
                        label: 'Notice',
                        children: [{
                            value: 'alert',
                            label: 'Alert 警告'
                        }, {
                            value: 'loading',
                            label: 'Loading 加载'
                        }, {
                            value: 'message',
                            label: 'Message 消息提示'
                        }, {
                            value: 'message-box',
                            label: 'MessageBox 弹框'
                        }, {
                            value: 'notification',
                            label: 'Notification 通知'
                        }]
                    }, {
                        value: 'navigation',
                        label: 'Navigation',
                        children: [{
                            value: 'menu',
                            label: 'NavMenu 导航菜单'
                        }, {
                            value: 'tabs',
                            label: 'Tabs 标签页'
                        }, {
                            value: 'breadcrumb',
                            label: 'Breadcrumb 面包屑'
                        }, {
                            value: 'dropdown',
                            label: 'Dropdown 下拉菜单'
                        }, {
                            value: 'steps',
                            label: 'Steps 步骤条'
                        }]
                    }, {
                        value: 'others',
                        label: 'Others',
                        children: [{
                            value: 'dialog',
                            label: 'Dialog 对话框'
                        }, {
                            value: 'tooltip',
                            label: 'Tooltip 文字提示'
                        }, {
                            value: 'popover',
                            label: 'Popover 弹出框'
                        }, {
                            value: 'card',
                            label: 'Card 卡片'
                        }, {
                            value: 'carousel',
                            label: 'Carousel 走马灯'
                        }, {
                            value: 'collapse',
                            label: 'Collapse 折叠面板'
                        }]
                    }]
                }, {
                    value: 'ziyuan',
                    label: '资源',
                    children: [{
                        value: 'axure',
                        label: 'Axure Components'
                    }, {
                        value: 'sketch',
                        label: 'Sketch Templates'
                    }, {
                        value: 'jiaohu',
                        label: '组件交互文档'
                    }]
                }]
            };
        }
    ,
    methods: {
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
                    data: fixDateFormat(this.getAllDate())
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: value,
                    type: 'line',
                    name: this.measurePoint1
                }],
            };
            let chart = echarts.init(document.getElementById("chart"));
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
                    data: fixDateFormat(this.getAllDate())
                },
                yAxis: {
                    type: 'value'
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
            let chart = echarts.init(document.getElementById("chart"));
            chart.setOption(option, true)
        }
    ,
        clearChart: function () {
            this.measurePoint1 = '';
            this.measurePoint2 = '';
            var chart = echarts.init(document.getElementById("chart"));
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
                    }
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
            axios.post('/api/getSpecificData',
                {
                    factory: this.factory,
                    line: this.line,
                    device: this.device,
                    timestamp: this.date
                }).then(function (response) {
                that.tableData = response.data
            })
        }
    }
    ,
    mounted()
    {
        var chart = echarts.init(document.getElementById("chart"));
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
                }
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
