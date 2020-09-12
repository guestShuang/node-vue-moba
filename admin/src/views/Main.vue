<template>
  <el-container>
		<el-header type="flex">
			<h1>王者荣耀后台</h1>
			<div class="header_user">
				<a href="">{{username}}</a>
        <span> | </span>
        <span @click="logout">退出</span>
			</div>
		</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router  unique-opened :default-active="$route.path" active-text-color="rgb(255,255,255)">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-reading"></i>内容管理
            </template>
            <el-menu-item-group>
              <template slot="title">物品</template>
              <el-menu-item index="/items/create">新建物品</el-menu-item>
              <el-menu-item index="/items/list">物品列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">英雄</template>
              <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
              <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">文章</template>
              <el-menu-item index="/articles/create">新建文章</el-menu-item>
              <el-menu-item index="/articles/list">文章列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-custom"></i>运营管理
            </template>
            <el-menu-item-group>
              <template slot="title">广告位</template>
              <el-menu-item index="/ads/create">新建广告位</el-menu-item>
              <el-menu-item index="/ads/list">广告位列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>系统设置
            </template>
            <el-menu-item-group>
              <template slot="title">分类</template>
              <el-menu-item index="/categories/create">新建分类</el-menu-item>
              <el-menu-item index="/categories/list">分类列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">管理员</template>
              <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
              <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<style>
.el-header {
  background-color: #00284d;
  color: #fff;
}
.el-header h1 {
	line-height: 60px;
	float: left;
	margin: 0;
}
.el-header .header_user {
  float: right;
  line-height: 60px;
}
.el-header .header_user a {
	color: #fff;
	text-decoration: none;
}
.el-header .header_user span {
	cursor: pointer;
}
.el-aside, .el-menu , .el-submenu__title {
	background-color: #001529;
  color: #fff;
}
.el-menu-item {
	color: #838c95;
}
.el-menu-item.is-active {
	background-color: #3370ff !important;
}
.el-menu-item:hover {
	background-color: #3370ff !important;
	color: #fff !important;
}
.el-submenu .el-submenu__title i {
	color: #fff;
}
.el-submenu .el-submenu__title:hover{
	background-color: #3370ff !important;
}

</style>

<script>
export default {
	computed: {
		username() {
			return localStorage.getItem('username')
		}
	},
	methods: {
		logout() {
			localStorage.clear()
			this.$router.push('/login')
		}
	}
};
</script>