<template>
  <div style="height: 100%;">
    <el-container>
      <el-header>
        <Navmenu></Navmenu>
      </el-header>
    </el-container>
    <el-container>
      <el-aside width='150px'>
        <Sidebar></Sidebar>
      </el-aside>
      <el-main>
        <el-card>
          <div slot="header">
            <span>筛选</span>
          </div>
          <el-row>
            <el-col span=5>
              <el-select value="" v-model="manufacture" placeholder="厂商选择">
                <el-option value="抓毛车间" label="常州天和印染有限公司"></el-option>
                <el-option value="食堂" label="天合紫竹园区配电站"></el-option>
              </el-select>
            </el-col>
            <el-col span=5>
              <el-select value="" v-model="device" placeholder="设备选择">
                <el-option value="照明插座"></el-option>
                <el-option value="空调用电"></el-option>
                <el-option value="动力用电"></el-option>
                <el-option value="特殊用电"></el-option>
              </el-select>
            </el-col>
            <el-col span=5>
              <el-select value="" v-model="algorithm" placeholder="算法选择">
                <el-option value="预测算法1"></el-option>
                <el-option value="预测算法2"></el-option>
              </el-select>
            </el-col>
            <el-col span=5>
              <el-button type="primary" v-on:click="searchClicked">预测</el-button>
            </el-col>
          </el-row>
        </el-card>
        <div id="chart1" style="height: 600px;width: 100%;"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"

  export default {
    name: "predict",
    components: {Navmenu, Sidebar},
    data: function () {
      return {
        manufacture: '',
        device: '',
        algorithm: '',
        date: ''
      }
    },
    mounted() {
      var chart1 = document.getElementById("chart1");
      // var chart2 = document.getElementById("chart2");
      // var chart3 = document.getElementById("chart3");
      // var chart4 = document.getElementById("chart4");

      chart1 = echarts.init(chart1);
      // chart2 = echarts.init(chart2);
      // chart3 = echarts.init(chart3);
      // chart4 = echarts.init(chart4);

      var option1 = {
        title: {
          text: "厂商用能预测图"
        },
        legend: {},
        tooltip: {
          trigger:'axis'
        },
        dataset: {
          source: [
            ['product', '实际值', '预测值'],
            ['0时', 43.3, 85.8],
            ['1时', 66.5, 53.4],
            ['2时', 66.4, 63.2],
            ['4时', 12.4, 33.9],
            ['5时', 42.4, 53.9],
            ['6时', 92.4, 93.9],
            ['7时', 72.2, 53.4],
            ['8时', 42.4, 54.9],
            ['9时', 52.4, 53.3],
            ['11时', 112.4, 153.9],
            ['12时', 72.4, 55.6],

          ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {type: 'line', smooth: 'true'},
          {
            type: 'line',
            smooth: 'true',
            lineStyle:{
              type:'dashed'
            }
          },
        ]
      };

      var option2 = {
        title: {
          text: "本月分项用能排名"
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '照明插座', '空调用电', '动力用电', '特殊用电'],
            ['办公楼', 43.3, 85.8, 93.7, 22.4],
            ['门卫室', 83.1, 73.4, 55.1, 11.2],
            ['三层', 86.4, 65.2, 82.5, 43.4],
            ['一层', 72.4, 53.9, 39.1, 30.3]
          ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {type: 'bar'},
          {type: 'bar'},
          {type: 'bar'},
          {type: 'bar'}
        ]
      };

      var option3 = {
        title: {
          text: '过去31天分项用能饼图',
          // subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['照明插座', '空调用电', '动力', '特殊']
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '照明插座'},
              {value: 310, name: '空调用电'},
              {value: 234, name: '动力'},
              {value: 135, name: '特殊'},
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      var option4 = {
        title: {
          text: "过去31天分\n项用能趋势"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['动力', '空调用电', '特殊', '照明插座']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '动力',
            type: 'bar',
            stack: '广告',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '空调用电',
            type: 'bar',
            stack: '广告',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '特殊',
            type: 'bar',
            stack: '广告',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '照明插座',
            type: 'bar',
            stack: '广告',
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      };

      chart1.setOption(option1);
      // chart2.setOption(option2);
      // chart3.setOption(option3);
      // chart4.setOption(option4)


    }
  }
</script>

<style scoped>
  .el-header {
    padding: 0;
    margin-bottom: 0px;
  }

  .main {
    padding: 0;
    margin-left: 10px;
  }

  .el-row {
    margin-bottom: 20px;
  }

  .el-card {
    margin-bottom: 20px;
  }
</style>
