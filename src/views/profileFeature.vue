<template>
  <my-frame>
    <el-card>
      <div slot="header">
        <span>行为画像特性</span>
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
          <el-button type="primary" v-on:click="searchClicked">显示</el-button>
        </el-col>
      </el-row>
    </el-card>
    <pre id="show"></pre>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </my-frame>
</template>

<script>
    import MyFrame from "../components/Frame";
    import axios from "axios"
    import * as echarts from 'echarts';

    export default {
        name: "profileFeature",
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
            searchClicked: function () {
                var chart1 = document.getElementById("chart1");
                let show = document.getElementById("show")
                chart1 = echarts.init(chart1);
                let that = this;
                axios.post("/api/profileFeature", {
                    factory: that.factory,
                    line: that.line,
                    device: that.device,
                    measurePoint: that.measurePoint
                }).then(function (response) {
                    console.log(response);
                    console.log(response.data)
                    let obj = response.data
                    show.innerHTML = JSON.stringify(obj,null,2);
                    // console.log(response.data['staticFeatures'])
                    // for (let i of obj){
                    //     for (let j of i){
                    //
                    //     }
                    // }
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
