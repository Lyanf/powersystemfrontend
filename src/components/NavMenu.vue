<template>
	<el-row type="flex" justify="space-between" class="header">
		<el-col :span=6><div class="grid-content brand"> <router-link to="/">精细化用能分析系统</router-link></div></el-col>

		<el-col :span=6>
			<div class="grid-content lgout-options">
				<div v-if="loginOrNot" >
					<el-button type="text" @click="logout"><i class="el-icon-back "/> 退出</el-button>
				</div>
				<div v-else>
					<router-link to="/login">登录</router-link>
					<router-link to="/register">注册</router-link>
				</div>

			</div>
		</el-col>

	</el-row>
</template>
<script>
  import {getCookie,delCookie} from '@/api/util'
  import {logout} from '@/api/link'
  export default {
  	name:"navmenu",
  	data(){
  		return {
  			loginOrNot: false
  		}
  	},
  	created(){
  		if(getCookie('username')==""){
  			this.loginOrNot = false
  			this.$router.push({path:'/login'})
  		}else{
  			this.loginOrNot = true
  		}
  	},
  	methods:{
  		logout(){
			delCookie('username')
			this.$router.push({path:'/login'})
  		}
  	}

  }
</script>

<style scoped="scoped">
	.header{
	  	height: 60px;
	  	line-height: 60px;
	  	background-color: #21a5f0;
	 }
	.brand,.lgout-options {
	  	color: white;
	 }
	.brand {
	  	padding-left: 20px;
	 }
	.lgout-options{
	  	text-align: right;
	  	padding-right: 20px;

	}
  	.el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }

	.grid-content {
	  height: 60px;
	  line-height: 60px;

	}
	.grid-content ,.grid-content a{
		color: white;
		height: 60px;
		display: inline-block;
	}
	.el-button:first-child,a:first-child{
		margin-right: 8px;
	}
	a:hover,a{
		text-decoration-line: none;
	}



</style>
