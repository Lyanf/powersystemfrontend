<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>筛选</span>
      </div>
      <el-row>
        <el-col span=6>
          <el-select value="" v-model="manufacture" placeholder="厂商选择">
            <el-option value="抓毛车间" label="天合紫竹园区"></el-option>
            <el-option value="食堂" label="天合印染"></el-option>
            <!--                <el-option value="空压机" label="空压机断路器"></el-option>-->
            <!--                <el-option value="织布机" label="织布机1断路器"></el-option>-->
            <!--                <el-option value="织布机2" label="织布机2断路器"></el-option>-->
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
        <el-col span=3 push=4>
          <el-button type="primary" v-on:click="searchClicked">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col span=9>
        <el-card>
          <div id="chart1" style="height: 300px;"></div>
        </el-card>

      </el-col>
      <el-col span=14 push=1>
        <el-card>
          <div id="chart2" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col span=9>
        <el-card>
          <div id="chart3" style="height: 300px;"></div>
        </el-card>

      </el-col>
      <el-col span=14 push=1>
        <el-card>
          <div id="chart4" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import MyFrame from "../components/Frame";

  export default {
    name: "usageSurvey",
    components: {MyFrame, Navmenu, Sidebar},
    data: function () {
      return {
        manufacture: '',
        date: ''
      }
    },
    mounted() {
      var chart1 = document.getElementById("chart1");
      var chart2 = document.getElementById("chart2");
      var chart3 = document.getElementById("chart3");
      var chart4 = document.getElementById("chart4");

      chart1 = echarts.init(chart1,'halloween');
      chart2 = echarts.init(chart2,'halloween');
      chart3 = echarts.init(chart3,'halloween');
      chart4 = echarts.init(chart4,'halloween');

      var option1 = {
        title: {
          text: '日分项用能\n同比分析',
          // subtext: '数据来自网络'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['今日', '昨日']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          // data:['照明插座','特殊','空调用电','动力']
        },
        yAxis: {
          type: 'category',
          data: ['照明插座', '特殊', '空调用电', '动力']
        },
        series: [
          {
            name: '今日',
            type: 'bar',
            data: [100, 96, 22, 45]
          },
          {
            name: '昨日',
            type: 'bar',
            data: [65, 40, 31, 55]
          }
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
          text: "过去7天分\n项用能趋势"
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
      chart2.setOption(option2);
      chart3.setOption(option3);
      chart4.setOption(option4)


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
