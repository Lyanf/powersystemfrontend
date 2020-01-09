<template>
	<el-container>
		<el-header>
			<NavMenu></NavMenu>
		</el-header>
	    <el-main id=main>
			    <Login></Login>

	    </el-main>
	    <el-footer>Copyright@上海交通大学</el-footer>
	</el-container>
</template>
<script type="text/javascript">
	import NavMenu from '@/components/NavMenu'
	import Login from '@/components/Login'
	import {getCookie} from '@/api/util'
	export default {
		name: 'manage',
		components: {NavMenu,Login},
		create(){
			if(getCookie('username') != ''){
				this.$router.push({path: '/'})
			}

		}
	}
</script>
<style type="text/css" scoped>
	.el-header{
		padding: 0px;
	}
	
  	.el-footer {
	    background-color: rgb(27,49,87);
	    color: white;
	    text-align: center;
	    line-height: 60px;
	    position: absolute;
	    bottom: 0;
	    width: 100%;
	    border-top: 1px solid;
	    border-color: white;
  	}
</style>
