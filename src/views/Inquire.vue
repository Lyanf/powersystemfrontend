<template>
  <MyFrame>
    <el-row :gutter=10>
      <el-col :span=9>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span=6>
        <el-input placeholder="测点" v-model="measurePoint"></el-input>
      </el-col>
      <el-col :span=6>
        <el-input placeholder="位置" v-model="location"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" v-on:click="searchClicked">查询</el-button>
      <el-button type="success" v-on:click="viewSettingClicked">可视化</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="500"
      >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="measurePoint"
          label="测点"
          width="180">
        </el-table-column>
        <el-table-column
          prop="location"
          label="位置"
          width="180">
        </el-table-column>
        <el-table-column
          prop="value"
          label="值"
          width="180">
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="可视化方案" :visible.sync="dialogSettingVisible">
      <el-row>
        <el-form label-width="80px">
          <el-form-item label="方案选择">
            <el-radio v-model="view.schemeRadio" label="line">折线图</el-radio>
            <el-radio v-model="view.schemeRadio" label="bar">柱形图</el-radio>
          </el-form-item>
          <el-form-item label="x轴">
            <el-input value="日期" disabled></el-input>
          </el-form-item>
          <el-form-item label="y轴">
            <el-input value="值" disabled></el-input>
          </el-form-item>
          <el-form-item label="维度">
            <el-select value="location" v-model="view.dimension">
              <el-option label="位置" value="location"></el-option>
              <el-option label="测点" value="measurePoint"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left: 80%" v-on:click="viewClicked">确定</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogShowChartVisible" width="1000px">
      <el-row>
        <div id="chart1" style="height: 400px;width: 700px;margin-left: auto;margin-right: auto"></div>
      </el-row>
    </el-dialog>
  </MyFrame>
</template>
<script type="text/javascript">
  import NavMenu from '@/components/NavMenu'
  import InquireData from '@/components/InquireData'
  import Sidebar from '@/components/Sidebar'
  import FileTable from "../components/FileTable";
  import axios from 'axios'
  import * as echarts from 'echarts';
  import MyFrame from "../components/Frame";

  function changeDataToDimension(dataList, dimension) {
    let mySet = new Set();
    for (var i in dataList) {
      let thisData = dataList[i]
      for (let key in thisData) {
        if (dimension === key) {
          let thisStr = thisData[key]
          mySet.add(thisStr)
          thisData[thisStr] = thisData['value']
        }
      }
    }
    //必须要把同一个维度的obj放在一堆，不然line不会连线
    let newDataList = [];
    for (var dimensionName of mySet) {
      for (var dataObj of dataList) {
        for (var key in dataObj) {
          if (dimensionName === key) {
            newDataList.push(dataObj)
            break
          }
        }
      }
    }

    let arrayResult = []
    arrayResult.push('date')
    for (let temp of mySet) {
      arrayResult.push(temp)
    }
    return [arrayResult, newDataList]
  }

  function getSeries(arrayDimensions, seriesType) {
    let result = [];
    for (let i = 0; i < arrayDimensions.length - 1; i++) {
      result.push(
        {type: seriesType}
      )
    }
    return result
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  export default {
    name: 'inquire',
    components: {MyFrame, FileTable, NavMenu, Sidebar},
    data: function () {
      return {
        date: '',
        measurePoint: '',
        location: '',
        tableData: [],
        view: {
          schemeRadio: '1',
          dimension: ''
        },
        dialogSettingVisible: false,
        dialogShowChartVisible: false
      }
    },
    methods: {
      searchClicked: function () {
        let that = this
        axios.post('/api/searchData',
          {
            ilocation: that.location,
            imeasurePoint: that.measurePoint,
            idate: that.date

          }).then(function (response) {
          that.tableData = response.data
        })
      },
      viewClicked: async function () {
        this.dialogSettingVisible = false
        this.dialogShowChartVisible = true
        await sleep(1500)
        let changeResponse = changeDataToDimension(this.tableData, this.view.dimension)
        let arrayDimensions = changeResponse[0];
        this.tableData = changeResponse[1]
        console.log(arrayDimensions)
        var chart1 = echarts.init(document.getElementById("chart1"),'halloween')
        var option = {
          legend: {},
          tooltip: {
            // trigger:'axis'
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {},
            },
            orient: 'vertical'
          },
          dataset: {
            source: this.tableData,
            dimensions: arrayDimensions
          },
          xAxis: {type: 'category'},
          yAxis: {type: 'value'},
          series: getSeries(arrayDimensions, this.view.schemeRadio)
        };
        chart1.setOption(option, true);
        console.log(JSON.stringify(this.tableData))
        console.log(JSON.stringify(option))
      },
      viewSettingClicked: function () {
        this.dialogSettingVisible = true
      }
    },
    created() {

    }
  }
</script>
<style type="text/css" scoped>
  .el-row {
    margin-bottom: 20px;
  }

</style>
