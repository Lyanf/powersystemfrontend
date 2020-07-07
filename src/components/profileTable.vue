<!-- 用于用户画像的table组件 -->
<template>
  <div>
    <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column :label="jingtaitexing">
      <el-table-column
        prop="maxv"
        label="最大值"
        >
      </el-table-column>
      <el-table-column
        prop="minv"
        label="最小值"
        >
      </el-table-column>
      <el-table-column
        prop="median"
        label="中位数"
        >
      </el-table-column>
      <el-table-column
        prop="avg"
        label="均值"
        >
      </el-table-column>
      <el-table-column
        prop="standard"
        label="标准差"
        >
      </el-table-column>
      <el-table-column
        prop="fftavg"
        label="fft频谱均值"
        >
      </el-table-column>
      <el-table-column
        prop="fftstandard"
        label="fft频谱标准差"
        >
      </el-table-column>

    </el-table-column>

    <el-table-column label="动态特性">
      <el-table-column
        prop="entropyh"
        label="行为信息熵（小时尺度）"
        >
      </el-table-column>
      <el-table-column
        prop="entropyd"
        label="行为信息熵（天尺度）"
        >
      </el-table-column>

    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  import {getMeasurePointAndUnit} from "../tool/toolFunc";

  export default {
    name: "profileTable",
    data() {
      return {
        jingtaitexing:'静态特性'+'  '+getMeasurePointAndUnit(this.measurePoint,0),
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
        measurePoint:{
          type: String,
          default:function () {
            return ''
          }
        }

    },
    methods: {

      mounted: function () {
      }
    },
    watch:{


    },

  }
</script>

<style scoped>

</style>
