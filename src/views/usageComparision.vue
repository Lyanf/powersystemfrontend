<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>筛选</span>
      </div>
      <el-row>
        <el-col span=5>
          <el-cascader
            v-model="selectedMetaData"
            :options="metaDataTree"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            placeholder="请选择设备"
          ></el-cascader>
        </el-col>
        <el-col span=5>
          <el-select value="" v-model="measurePoint" placeholder="测点选择">
            <el-option v-for="item in allMeasurePoint" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col span=5 push=10>
          <el-button type="primary" v-on:click="searchClicked">显示</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table id="showTable"
              :data="tableData"
              border
              stripe
              height="300"
              max-height="300"
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="device"
        label="设备"
      >
      </el-table-column>
      <el-table-column
        prop="value"
        label="相关性"
      >
      </el-table-column>
    </el-table>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
    import * as echarts from 'echarts';
    import Navmenu from "../components/NavMenu";
    import Sidebar from "../components/Sidebar"
    import MyFrame from "../components/Frame";
    import axios from "axios"

    export default {
        name: "usageStatistics",
        components: {MyFrame, Navmenu, Sidebar},
        data: function () {
            return {
                factory: '',
                line: '',
                device: '',
                measurePoint: '',
                algorithm: '',
                date: '',
                trueData: '',
                predictData: '',
                metaDataTree: '',
                selectedMetaData: '',
                tableData: [],
                allMeasurePoint: []
            }
        },
        methods: {
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
            searchClicked: function () {
                let that = this;
                axios.post("/api/correlation", {
                    'factory': this.factory,
                    'line': this.line,
                    'device': this.device,
                    'measurePoint': this.measurePoint
                }).then(function (response) {
                    console.log(response.data);
                    let data = response.data;
                    let tableData = [];
                    for (let i in data) {
                        let tempObj = {};
                        tempObj['device'] = i;
                        tempObj['value'] = data[i];
                        tableData.push(tempObj)
                    }
                    that.tableData = tableData;
                    console.log(that.tablaData)
                })
            }
        },
        mounted() {
            this.getAllMeasurePoint()
            this.getMetaData();
            var option1 = {
                title: {
                    text: "厂商用能同比分析"
                },
                legend: {},
                tooltip: {},
                dataset: {
                    source: [
                        ['product', '天和印染', '天合紫竹园区', 'a公司', 'b公司'],
                        ['照明插座', 43.3, 85.8, 93.7, 22.4],
                        ['空调用电', 83.1, 73.4, 55.1, 11.2],
                        ['动力用电', 86.4, 65.2, 82.5, 43.4],
                        ['特殊用电', 72.4, 53.9, 39.1, 30.3]
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
            }
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
