<template>
  <MyFrame>
    <el-card>
      <div slot="header">
        <span>筛选</span>
      </div>
      <el-row>
        <el-col span=5>
          <!--              <el-select value="" v-model="manufacture" placeholder="厂商选择">-->
          <!--                <el-option value="抓毛车间" label="常州天和印染有限公司"></el-option>-->
          <!--                <el-option value="食堂" label="天合紫竹园区配电站"></el-option>-->
          <!--              </el-select>-->
          <el-cascader
            v-model="selectedMetaData"
            :options="metaDataTree"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            placeholder="请选择设备"
          ></el-cascader>
        </el-col>
        <!--            <el-col span=5>-->
        <!--              <el-select value="" v-model="device" placeholder="设备选择">-->
        <!--                <el-option value="照明插座"></el-option>-->
        <!--                <el-option value="空调用电"></el-option>-->
        <!--                <el-option value="动力用电"></el-option>-->
        <!--                <el-option value="特殊用电"></el-option>-->
        <!--              </el-select>-->
        <!--            </el-col>-->
        <!--            <el-col span=5>-->
        <!--              <el-select value="" v-model="algorithm" placeholder="算法选择">-->
        <!--                <el-option value="预测算法1"></el-option>-->
        <!--                <el-option value="预测算法2"></el-option>-->
        <!--              </el-select>-->
        <!--            </el-col>-->
        <el-col span=5 push=10>
          <el-button type="primary" v-on:click="searchClicked">显示</el-button>
          <!--              <el-button type="primary" v-on:click="searchClicked2">重新预测</el-button>-->
        </el-col>
      </el-row>
    </el-card>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
    import * as echarts from 'echarts';
    import Navmenu from "../components/NavMenu";
    import Sidebar from "../components/Sidebar"
    import axios from "axios"
    import MyFrame from "../components/Frame";

    export default {
        name: "predict",
        components: {MyFrame, Navmenu, Sidebar},
        data: function () {
            return {
                factory: '',
                line: '',
                device: '',
                algorithm: '',
                date: '',
                trueData: '',
                predictData: '',
                metaDataTree: '',
                selectedMetaData: ''
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
            searchClicked: function () {
                var chart1 = document.getElementById("chart1");

                chart1 = echarts.init(chart1);
                let that = this;
                axios.post("/api/predict", {
                    factory: that.factory,
                    line: that.line,
                    device: that.device,
                    measurePoint: "三相总有功功率"
                }).then(function (response) {
                    let data = response.data;
                    that.trueData = data['y_true'];
                    that.predictData = data['y_pred'];
                    console.log(that.trueData)
                    console.log(that.predictData)
                    console.log([Array.from({length: 4000}, (a, i) => i)])
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
                            text: "厂商用能预测图"
                        },
                        legend: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: {
                            type: 'category',
                            data: Array.from({length: 3835}, (a, i) => i)
                        },
                        yAxis: {},
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {
                                name: '真实值',
                                type: 'line',
                                smooth: 'true',
                                data: that.trueData
                            },
                            {
                                name: '预测值',
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
            searchClicked2: function () {
                let that = this
                axios.get("/algorithm/predict")
                axios.post("/algorithm/predict", {
                    "factory": that.factory,
                    "line": that.line,
                    "device": that.device
                })
            }
        },
        mounted() {
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
