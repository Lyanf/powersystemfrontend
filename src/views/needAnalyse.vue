<template>
<MyFrame>
        <el-card>
          <div slot="header">
            <span>筛选</span>
          </div>
        <el-row>
          <el-col span=4>
<!--          <div class="block">-->
<!--            <span class="demonstration">选择进线</span>-->
              <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
                placeholder="请选择进线"
              ></el-cascader>
<!--          </div>-->
          </el-col>
          <el-col span=4 push=2>
          <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col span=3 push=10>
            <el-button type="primary" v-on:click="searchClicked">查询</el-button>
          </el-col>
        </el-row>
        </el-card>
        <el-row style="margin-top: 20px">
          <el-col span="11">
            <el-card style="width: 100%;">
              <div slot="header">
                <span>1#配电400V进电</span>
              </div>
              <div id="bar1" style="height: 400px;width: 100%;"></div>
            </el-card>
          </el-col>
          <el-col span="11" push="1">
            <el-card style="width: 100%;">
              <div slot="header">
                <span>2#配电400V进电</span>
              </div>
              <div id="bar2" style="height: 400px;width: 100%;"></div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="24">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
            >
              <el-table-column
                prop="a1"
                label="进线名称"
                >
              </el-table-column>
              <el-table-column
                prop="a2"
                label="契约值"
                >
              </el-table-column>
              <el-table-column
                prop="a3"
                label="最大值&时间"
                >

              </el-table-column>
              <el-table-column
                prop="a4"
                label="<40%>">
              </el-table-column>
              <el-table-column
                prop="a5"
                label="40%-60%">
              </el-table-column>
              <el-table-column
                prop="a6"
                label="60%-70%">
              </el-table-column>
              <el-table-column
                prop="a7"
                label="70%-80%">
              </el-table-column>
              <el-table-column
                prop="a8"
                label="80%-90%">
              </el-table-column>
              <el-table-column
                prop="a9"
                label="90%-100%">
              </el-table-column>
              <el-table-column
                prop="a10"
                label="100%-150%">
              </el-table-column>
              <el-table-column
                prop="a11"
                label=">=150%">
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
</MyFrame>
</template>

<script>
  import * as echarts from 'echarts';
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar"
  import MyFrame from "../components/Frame";

  export default {
    name: "needAnalyse",
    components: {MyFrame, Navmenu, Sidebar},
    methods: {
      handleChange(value) {
        console.log(value);
      }
    },
    data() {
      return {
        tableData: [
          {
            a1:'1#配电400V进电',
            a2:'300',
            a3:'72.67',
            a4:'100%',
            a5:'0',
            a6:'0',
            a7:'0',
            a8:'0',
            a9:'0',
            a10:'0',
            a11:'0'
          },
          {
            a1:'2#配电400V进电',
            a2:'300',
            a3:'72.67',
            a4:'100%',
            a5:'0',
            a6:'0',
            a7:'0',
            a8:'0',
            a9:'0',
            a10:'0',
            a11:'0'
          }
        ],
        date: '',
        location: '',
        factory:'',
        line:'',
        options:[
          {
            value:'1',
            label:'1',
            children:[
              {
                value:'a1',
                label:'a1',
              }
            ]
          },
          {
            value:'2',
            label:'2',
            children:[
              {
                value:'b1',
                label:'b1'
              },
              {
                value:'c1',
                label:'c1'
              }
            ]
          }
        ]
      }
    },
    mounted() {
      let option1 = {

        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['<40%', '40%-60%', '60%-70%','70%-80%', '80%-90%', '90%-100%', '100%-150%', '>=150%']
        },
        series: [
          {
            name: '值域时间占比',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 335, name: '<40%'},
              {value: 310, name: '40%-60%'},
              {value: 310, name: '60%-70%'},
              {value: 234, name: '70%-80%'},
              {value: 135, name: '80%-90%'},
              {value: 1548, name: '90%-100%'},
              {value: 100, name: '100%-150%'},
              {value: 245, name: '>=150%'}
            ],
            center:['60%','50%']
          },

        ],
        toolbox: {
          show: true,
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
      };

      let bar1 = echarts.init(document.getElementById("bar1"));
      let bar2 = echarts.init(document.getElementById("bar2"));

      bar1.setOption(option1);
      bar2.setOption(option1)
    },

  }


</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

</style>
