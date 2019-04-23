<template>
  <div>
  <p>123123123</p>
    <el-select v-model="selectData" v-on:change="myOn" placeholder="请选择啊">
      <el-option value="1"></el-option>
      <el-option value="2"></el-option>
    </el-select>
  </div>
</template>

<script>
    export default {
        name: "lyftest",
      data:function () {
        return {
          selectData:''
        }
      },
      methods:{
          myOn:function (event) {
            console.log(event)
            console.log("-------------------")
            console.log(this)
          }
      }
    }
</script>

<style scoped>

</style>
