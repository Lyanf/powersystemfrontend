<template>
  <el-container>
    <el-header>
      <Navmenu></Navmenu>
    </el-header>
    <el-container>
      <el-aside width='300px'>
        <Sidebar></Sidebar>
      </el-aside>
      <el-container class="container">
        <el-main class="main">
          <el-button type="primary" v-on:click="openForm(true,'')">增加</el-button>


          <el-dialog title="" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="主键" :label-width="formLabelWidth" v-show="showid">
                <el-input v-model="form.id" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="物理名称" :label-width="formLabelWidth">
                <el-input v-model="form.physics" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="英文名称" :label-width="formLabelWidth">
                <el-input v-model="form.englishname" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="类型" :label-width="formLabelWidth">
                <el-select v-model="form.type">
                  <el-option v-for="item in physicsTypeList"
                             :value="item"
                             :key="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属逻辑" :label-width="formLabelWidth">
                <el-select v-model="form.logic">
                  <el-option v-for="(value,key) in logicObj"
                             :value="value"
                             :label="value"
                             :key="value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <!--<el-form-item label="所属概念" :label-width="formLabelWidth">-->
                <!--<el-select v-model="form.concept">-->
                  <!--<el-option v-for="(value,key) in conceptObj"-->
                             <!--:value="value"-->
                             <!--:label="value"-->
                             <!--:key="value"-->
                  <!--&gt;</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->

              <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="form.description"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="sendForm(addingFlag)">确 定</el-button>
            </div>
          </el-dialog>


          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column prop="id" label="主键" v-show="false">
            </el-table-column>
            <el-table-column
              prop="physics"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="englishname"
              label="英文名称">
            </el-table-column>
            <el-table-column
              prop="logic"
              label="逻辑">
            </el-table-column>

            <!--<el-table-column-->
              <!--prop="logicid"-->
              <!--label="逻辑主键">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="concept"-->
              <!--label="概念">-->
            <!--</el-table-column>-->

            <!--<el-table-column-->
              <!--prop="conceptid"-->
              <!--label="概念主键">-->
            <!--</el-table-column>-->

            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="createtime"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="openForm(false, scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>

    </el-container>
  </el-container>

</template>

<script>
  import Navmenu from "../components/NavMenu";
  import Sidebar from "../components/Sidebar";
  import axios from 'axios'

  export default {
    name: "physicsLayer",
    components: {Sidebar, Navmenu},
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        addingFlag: true,
        showid: true,
        form: {
          physics:'',
          id: '',
          englishname: '',
          type: '',
          description: '',
          concept:'',
          conceptid:'',
          logic:'',
          logicid:''
        },
        physicsTypeList: [],
        conceptObj:{},
        logicObj:{},
        allLogicFromBack:[],
        formLabelWidth: '120px'
      }
    },
    created() {
      this.getTable()
    }
    ,
    methods: {
      clearForm: function () {
        for(let i in this.form){
          this.form[i] = ''
        }
      },
      getTable: function () {
        let that = this
        axios.post('/api/getPhysics').then(function (response) {
          that.tableData = response.data;
          console.log(response.data)
        });
        axios.post('/api/getPhysicsType').then(function (response) {
          let newList = []
          for (var testt of response.data) {
            newList.push(testt['physicstype'])
          }
          that.physicsTypeList = newList
        })
        this.addLackNameFromid()
      },
      handleDelete: function (id) {
        let that = this
        axios.post('/api/deletePhysics', {id: id}).then(function (response) {
          that.getTable()
        })
      },
      openForm: function (addFlag, row) {
        this.dialogFormVisible = true;
        if (addFlag === true) {
          //  说明是完全的增加
          this.clearForm()
          this.addingFlag = true
          this.showid = false
        } else {
          //  说明是更改，此时需要对form进行输入，并且允许一部分内容的修改
          this.showid = true
          for(var index in this.form){
            this.form[index] = row[index]
          }
          this.addingFlag = false
          console.log(row)
        }
      },
      sendForm: function (addFlag) {
        this.dialogFormVisible = false;
        let that = this
        for(var index in this.logicObj){
          if (this.form.logic === this.logicObj[index]) {
            this.form.logicid = index
            break
          }
        }
        if (addFlag === true) {
          axios.post('/api/addPhysics', that.form).then(function (response) {
            that.getTable()
          })
        } else {
          axios.post('/api/changePhysics', that.form).then(function (response) {
            that.getTable()
          })
        }
      },
      addLackNameFromid:function () {
        let that = this
        axios.post('/api/getLogic').then(function (response) {
          that.allLogicFromBack = response.data
          for(var obj of that.allLogicFromBack){
            console.log(obj)
            that.logicObj[obj.id] = obj.logic
          }
          for(var row of that.tableData){
            row['logic'] = that.logicObj[row['logicid']]
            //发现了vue.js的一个bug，这个时候他不会更新，因为他没有监控开始不存在的一个
            //对象属性
            var temp = row['englishname']
            row['englishname'] = ''
            row['englishname'] = temp
          }
        })
        console.log(this.tableData)
      }

    }


  }
</script>

<style scoped>
  .el-header {
    padding: 0px;
    margin-bottom: 10px;
  }

  .main {
    padding: 0px;
    margin-left: 10px;
  }

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
