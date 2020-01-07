<template>
  <my-frame>
    <el-card>
      <div slot="header">
        <span>能耗基线提取</span>
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
        <el-col span=5>
          <el-date-picker
            v-model="date"
            type="date">
          </el-date-picker>
        </el-col>
        <el-col span=5>
          <el-button type="primary" v-on:click="searchClicked">显示</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </my-frame>
</template>

<script>
    import MyFrame from "../components/Frame";
    import axios from "axios"
    import * as echarts from 'echarts';

    export default {
        name: "baseLine",
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
                var chart1 = document.getElementById("chart1");
                chart1 = echarts.init(chart1);
                let that = this
                axios.post("/api/baseline", {
                    factory: that.factory,
                    line: that.line,
                    device: that.device,
                    measurePoint: that.measurePoint,
                    year:that.date.getFullYear(),
                    month:that.date.getMonth(),
                    day:that.date.getDate()
                }).then(function (response) {
                    let data = response.data;
                    that.trueData = data['trueValue'];
                    that.predictData = data['baseValue'];
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
                            data: Array.from({length: that.trueData.length}, (a, i) => i)
                        },
                        yAxis: {scale: true},
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

</style>
