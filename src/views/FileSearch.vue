<template>
  <MyFrame>
    <el-row gutter=30>
      <el-col span=2>
        <el-select value="方案1"></el-select>
      </el-col>
      <el-col span=4>

        <el-select value="华东"></el-select>
      </el-col>
      <el-col span=4>

        <el-select value="需电量"></el-select>
      </el-col>
      <el-col span=6>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
        <!--        <el-select placeholder="选择相关因素"></el-select>-->
      </el-col>
      <el-col span=2>

        <el-input placeholder="历史年份"></el-input>
      </el-col>
      <el-col span=2>

        <el-input placeholder="预测年份"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col span=3>
        <el-button type="primary">主导因素分析</el-button>
      </el-col>
      <el-col span=2>
        <el-button type="primary">统计分析</el-button>
      </el-col>
      <el-col span=2>
        <el-button type="primary">趋势分析</el-button>
      </el-col>

    </el-row>
  </MyFrame>
</template>
<script>
    import * as link from '@/api/link'
    import axios from "axios";
    import echarts from "echarts";
    import NavMenu from "../components/NavMenu";
    import Sidebar from "../components/Sidebar";
    import MyFrame from "../components/Frame";
  const cityOptions = ['GDP', '财政收入', '总人口', '财政支出'];

    export default {
        name: 'FileSearch',
        components: {MyFrame, Sidebar, NavMenu},
        data() {
            return {
                checkAll: false,
                checkedCities: ['GDP', '总人口'],
                cities: cityOptions,
                isIndeterminate: true
            };
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedCities = val ? cityOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            }
        }
    }


</script>
<style type="text/css" scoped>


  #input_area {
    margin-top: 10px;
    overflow: hidden;
  }

  #result_area {
    margin-top: 10px;
  }

  .el-row {
    margin-bottom: 10px;
  }

</style>
