<template>
  <MyFrame>
    <BaseSelectInput title="短期负荷预测" :loading="loading" @exportClicked="exportClicked(tableData)"  @searchClicked="searchClicked" :predict="true"/>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border  height="300px">
          <el-table-column
            type="index"
             label="序号" width="100px">
          </el-table-column>
          <el-table-column
            prop="y_true"
            :label="tableShowUnit1"
          >
          </el-table-column>
          <el-table-column
            prop="y_pred"
            :label="tableShowUnit2"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div id="chart1" style="height: 600px;width: 100%;"></div>
  </MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import axios from "axios"
  import MyFrame from "../components/Frame";
  import {getMeasurePointAndUnit, getUnit, loadingButton} from "../tool/toolFunc";
  import BaseSelectInput from "../components/BaseSelectInput";

  export default {
    name: "predict",
    components: {BaseSelectInput, MyFrame, Navmenu, Sidebar},
    data: function () {
      return {
        trueData: '',
        predictData: '',
        chartOption: {},
        showData: {},
        tableData:[],
        measurePoint:'',

        tableShowUnit1:'真实值',
        tableShowUnit2:'预测值',


        loading: false,
        allData: ''
      }
    },
    methods: {
      exportClicked:function(jsonData){
          let str = this.tableShowUnit1+','+this.tableShowUnit2+'\n';
          //增加\t为了不让表格显示科学计数法或者其他格式
          for(let i = 0 ; i < jsonData.length ; i++ ){
            for(let item in jsonData[i]){
              str+=`${jsonData[i][item] + '\t'},`;
            }
            str+='\n';
          }
          //encodeURIComponent解决中文乱码
          let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
          //通过创建a标签实现
          let link = document.createElement("a");
          link.href = uri;
          //对下载的文件命名
          link.download =  "短期负荷预测导出数据表.csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      },
      searchClicked: function (data) {
        let that = this
        that.allData = data
        that.measurePoint = data.measurePoint;
        var chart1 = document.getElementById("chart1");
        loadingButton(true, that)
        chart1 = echarts.init(chart1, 'halloween');
        axios.post("/api/predict", data).then(function (response) {
          let data = response.data;
          console.log(that.measurePoint)
          that.trueData = data['y_true'];
          that.predictData = data['y_pred'];
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
              text: "用户（设备）用能预测"
            },
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: Array.from({length: that.trueData.length}, (a, i) => i),
              // name: '数据点'
            },
            yAxis: {scale: true, name: getMeasurePointAndUnit(that.allData.measurePoint,0)},
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


          for (let i = 0; i < that.trueData.length; i++){
            let temp = {};
            temp['y_true'] = that.trueData[i];
            temp['y_pred'] = that.predictData[i];
            that.tableData.push(temp);
          }
          that.tableShowUnit1 = '真实'+that.measurePoint+'值'+'('+getUnit(that.measurePoint)+')';
          that.tableShowUnit2 = '预测'+that.measurePoint+'值'+'('+getUnit(that.measurePoint)+')';
        }).catch(function (error) {
          console.log(error)
          that.$message.error("计算出现错误，请检查所选参数是否正确！")
        }).finally(function () {
          loadingButton(false, that)
        });
      },
    },
    mounted() {
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
