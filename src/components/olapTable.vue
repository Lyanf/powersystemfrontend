<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      tooltip-effect="dark"
      style="width: 100%"
      >

        <el-table-column
          v-for="(item,index) in tableLabel"
          :key= "index"
          :prop = "item.prop"
          :label="insideGetMeasurePointAndUnit(item.label,1)"
          :index = "item.index"
          v-if="item.prop != 'id'"
          >
        </el-table-column>

      <!-- <el-table-column
        prop="date"
        label="时间"
        width="220">
      </el-table-column>
      <el-table-column
        prop="measurePoint"
        label="测点"
        width="220">
      </el-table-column>
      <el-table-column
        prop="customer"
        label="用户"
        width="150">
      </el-table-column>
      <el-table-column
        prop="line"
        label="进线"
        width="150">
      </el-table-column>
      <el-table-column
        prop="device"
        label="设备"
        width="150">
      </el-table-column>
      <el-table-column
        prop="value"
        label="值"
        width="220">
      </el-table-column> -->
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getMeasurePointAndUnit} from '../tool/toolFunc'
  export default {
    name: "olapTable",
    data() {
      return {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    },
    // props:['tableData','tableLabel'],
    props:{
        tableData:{
          type: Array,
          default: function () {
            return []
          }
        },
        tableLabel:{
          type: Array,
          default: function () {
            return []
          },
          required: true

        }
    },
    methods: {
      current_change: function (currentPage) {
        this.currentPage = currentPage;
      },
      insideGetMeasurePointAndUnit(measurePoint,hasValue){
        return getMeasurePointAndUnit(measurePoint,hasValue)
      },
      mounted: function () {
      }
    },
    watch:{
      tableData(val){
        this.total = val.length


      },

    },

  }
</script>

<style scoped>

</style>
