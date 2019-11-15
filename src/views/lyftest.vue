<template>
  <div>
    <div class="block">
      <span class="demonstration">单选选择任意一级选项</span>
      <el-cascader
        :options="options"
        :props="{ checkStrictly: true, label:'value' }"
        clearable></el-cascader>
    </div>
  </div>
</template>

<script>
    import * as echarts from 'echarts';
    import Navmenu from "../components/NavMenu";
    import Sidebar from "../components/Sidebar"
    import axios from "axios"
    import MyFrame from "../components/Frame";

    export default {
        name: "lyftest",
        data: function () {
            return {
                options: []
            }
        },
        methods: {
            myOn: function (event) {
                console.log(event)
                console.log("-------------------")
                console.log(this)
            }
        },
        created() {
            let that = this
          axios.post("/api/metadataTreeJson").then(function (response) {
              that.options = response.data
              console.log(response.data)
          })
        }
    }
</script>

<style scoped>

</style>
