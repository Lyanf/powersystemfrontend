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
          :props="{ expandTrigger: 'hover', multiple: this.showMul  } "
          placeholder="请选择设备或用户" collapse-tags
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
        <el-button type="primary" :loading="this.loading" v-on:click="searchClicked">{{buttonText}}</el-button>
      </el-col>
      <el-col span=5>
        <!--          <el-button type="primary" v-on:click="addCompare">添加对比</el-button>-->
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import axios from "axios";

  export default {
    name: "BaseSelectInput",
    props: {
      title:String,
      loading:String,
      showMul:{
        type:Boolean,
        default:true
      }
    },
    data: function () {
      return {
        selectedMetaData: '',
        metaDataTree: '',
        measurePoint: '',
        allMeasurePoint: '',
        date: '',
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
          'date': this.date
        }
        this.$emit('searchClicked', data)
      }
    },
    mounted() {
      this.getMetaData()
      this.getAllMeasurePoint()
    },
    computed: {
      buttonText: function () {
        if (this.loading === false)
        {
          return '计算'
        }
        else{
          return '计算中'
        }
      },
      computedSelectedMetaData:function () {
        if (this.showMul === false){
          let temp = []
          temp[0] = this.selectedMetaData
          return temp
        }
        else{
          return this.selectedMetaData
        }
      }
    }
  }
</script>

<style scoped>

</style>
