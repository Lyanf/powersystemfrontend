<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>用电模式挖掘</span>
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
        <el-col span=4>
          <el-button type="primary" :loading="this.flag" v-on:click="searchClicked">{{text}}</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
    <div id="chart2" style="height: 600px;width: 100%;"></div>
    <div id="chart3" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import MyFrame from "../components/Frame";
  import * as echarts from 'echarts';
  import axios from "axios"

  export default {
    name: "cluster",
    components: {MyFrame},
    data: function () {
      return {
        factory: '',
        line: '',
        device: '',
        measurePoint: '',
        algorithm: '',
        date: '',
        metaDataTree: '',
        selectedMetaData: '',
        allMeasurePoint: [],
        hourX: '',
        dayX: '',
        hourList: [],
        dayList: [],


        text: '计算',
        flag: false
      }
    },
    methods: {
      loadingButton: function (loading) {
        if (loading === true)
        {
          this.text = '计算中'
          this.flag = true
        }
        else{
          this.text = '计算'
          this.flag = false
        }
      },
      handleChange: function () {
        this.factory = this.selectedMetaData[0];
        this.line = this.selectedMetaData[1];
        this.device = this.selectedMetaData[2];
      },
      getMetaData: function () {
        let that = this;
        axios.post("/api/getMetaDataTree").then(function (response) {
          that.metaDataTree = response.data
        });
        console.log(this.metaDataTree)
      },
      getAllMeasurePoint: function () {
        let that = this;
        axios.post("/api/getAllMeasurePoint").then(function (response) {
          that.allMeasurePoint = response.data
        });
        console.log(this.allMeasurePoint)
      },
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
      searchClicked: function () {
        let that = this
        let chart1 = document.getElementById("chart1");
        let chart2 = document.getElementById("chart2");
        let chart3 = document.getElementById("chart3");
        that.loadingButton(true)
        chart1 = echarts.init(chart1,'halloween');
        chart2 = echarts.init(chart2,'halloween');
        chart3 = echarts.init(chart3,'halloween');
        axios.post("/api/cluster", {
          factory: that.factory,
          line: that.line,
          device: that.device,
          measurePoint: that.measurePoint,
          date: that.date
        }).then(function (response) {
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
              name:'数据点'
            },
            yAxis: {scale: true,name:that.measurePoint},
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
            yAxis: {scale: true},
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
            yAxis: {scale: true},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: that.generateSeries(that.dayList)
          }
          chart1.setOption(option1);
          chart2.setOption(option2);
          chart3.setOption(option3);
          that.loadingButton(false)

        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
          that.loadingButton(false)
        });
      },
    },
    mounted() {
      this.getMetaData();
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
