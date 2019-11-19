<template>
  <!--  <script src="//unpkg.com/vue/dist/vue.js"></script>-->
  <!--<script src="//unpkg.com/element-ui@2.12.0/lib/index.js"></script>-->
  <!-- 引入样式 -->
  <div>
<!--    <div class="block">-->
<!--      <span class="demonstration">单选选择任意一级选项</span>-->
<!--      <el-cascader-->
<!--        :options="options"-->
<!--        :props="{ checkStrictly: true }"-->
<!--        clearable></el-cascader>-->
<!--    </div>-->
<!--    <div class="block">-->
<!--      <span class="demonstration">多选选择任意一级选项</span>-->
<!--      <el-cascader-->
<!--        :options="options"-->
<!--        :props="{ multiple: true, checkStrictly: true }"-->
<!--        clearable></el-cascader>-->
<!--    </div>-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="index"
        label="序列"
        width="180" type="index">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="value"
        label="地址">
      </el-table-column>
    </el-table>
    <pre id="text"></pre>
  </div>
</template>
<script>
    export default {
        name: "lyftest",
        data() {
            return {
                tableData:[]
            }

        },
        mounted() {
            let t = {
                "a": {
                    temp:{
                        "tempChild":[1,2,3,4],
                        "ttt":"123"
                    }
                },
                "b":{
                    e:[1,2,3,4,5],
                    f:"fuck"
                }
            }
            console.log(t)
            this.tableData = t
            document.getElementById("text").innerHTML = JSON.stringify(t,undefined, 2)
        }
    };
</script>
