<template>
  <el-card>
    <div slot="header">
      <span>{{title}}</span>
    </div>
    <el-row>
      <el-col span=5>
        <el-cascader
          v-model="selectedMetaData"
          :options="metaDataTree"
          :props="{ expandTrigger: 'hover', multiple: showMul,checkStrictly: true    } "
          placeholder="请选择设备或用户" collapse-tags
        />
      </el-col>
      <el-col span=5>
        <el-select v-model="measurePoint" placeholder="测点选择" >
          <el-option v-for="item in limitedMeasurePoint" :value="item"/>
        </el-select>
      </el-col>
      <el-col span=10>
      <el-row>
        <el-date-picker v-if="this.dateSelect=='daterange'"
                        v-model="date"
                        :type="this.dateSelect"
                        range-separator="至"
                        :default-time="defaultTime"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        <el-date-picker v-else
                        v-model="date"
                        :type="this.dateSelect"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-row>
        <el-row style="margin-top: 10px">
        <el-select  v-if="predict == true" v-model="selectAllTrain" placeholder="训练数据选择">
          <el-option label="选择全部训练数据" value="true"></el-option>
          <el-option label="选择时间段内训练数据" value="false"></el-option>
        </el-select>
        </el-row>
      </el-col>
      <el-col span=4>
        <el-row>
        <el-button type="primary" :loading="this.loading" v-on:click="searchClicked">{{buttonText}}</el-button>
        </el-row>
        <el-row style="margin-top: 10px">
        <el-button v-if="predict == true "type="primary" v-on:click="exportClicked">导出表格</el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import axios from "axios";
  import {changeDateFormat, getUnit} from '../tool/toolFunc'

  export default {
    name: "BaseSelectInput",
    props: {
      title: String,
      loading: String,
      showMul: {
        type: Boolean,
        default: false
      },
      dateSelect: {
        type: String,
        default: "daterange"
      },
      predict: {
        type: Boolean,
        default: false
      },
      baseLine:{
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        selectedMetaData: '',
        metaDataTree: '',
        measurePoint: '',
        allMeasurePoint: '',
        date: '',
        selectAllTrain:'',
      }
    },
    methods: {
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
        let data = {
          'measurePoint': this.measurePoint,
          'selectedMetaData': this.computedSelectedMetaData,
          'date': changeDateFormat(this.date)
        }
        if (this.predict == true){
          data['selectAllTrain'] = this.selectAllTrain
        }
        console.log(this.defaultTime)
        console.log(document.getElementById("test"))

        this.$emit('searchClicked', data)
      },
      exportClicked:function () {
        this.$emit('exportClicked')
      }
    },
    mounted() {
      this.getMetaData()
      this.getAllMeasurePoint()
    },
    computed: {
      buttonText: function () {
        if (this.loading === false) {
          return '计算'
        } else {
          return '计算中'
        }
      },
      computedSelectedMetaData: function () {
        if (this.showMul === false) {
          let temp = []
          temp[0] = this.selectedMetaData
          return temp
        } else {
          return this.selectedMetaData
        }
      },
      defaultTime: function () {
        let temp = []
        temp[0] = "00:00:00"
        temp[1] = "23:59:59"
        return temp
      },
      limitedMeasurePoint: function(){
        let temp = []
        for(let one of this.allMeasurePoint){
          if (getUnit(one) == 'kWh' || getUnit(one) == 'kW' || getUnit(one)=='kVar' || getUnit(one)=='kVarh') {
            temp.push(one)
          }
        }
        return temp;
      }
    }
  }
</script>

<style scoped>

</style>
