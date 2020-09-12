<template>
  <div class="home">
		<h1>物品列表</h1>
		<el-row>
      <el-col :span="16">
        <el-row type="flex">
          <el-col :span="12">
            <el-input placeholder="请输入要搜索的物品名称，支持模糊查询" auto-complete="off" v-model="search.name"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="searchItem">搜索</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
		<el-table :data="items">
			<el-table-column prop="_id" label="ID" width="240"></el-table-column>
			<el-table-column prop="name" label="物品名称"></el-table-column>
			<el-table-column prop="icon" label="图标">
				<template slot-scope="scope">
					<img :src="scope.row.icon" style="height:3rem;">
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="180">
				<template slot-scope="scope">
					<el-button type="text" size="small" 
					@click="$router.push(`/items/edit/${scope.row._id}`)">编辑</el-button>
					<el-button type="text" size="small" 
					@click="remove(scope.row)">删除</el-button>
				</template>	
			</el-table-column>
    </el-table>
		<!-- 分页 -->
    <div class="mt-10">
      <el-pagination background layout="prev, sizes, pager, next" :total="itemsCounts" @current-change="changePage" @size-change="changeSizeChange" :page-size="5" :page-sizes="[5, 10, 15, 20]"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			items: [],
			page: 1,
			perpage: 5,
			itemsCounts: 0,
			search: {        
        name: ""
      }
		}
	},
	methods: {
		changeSizeChange(page) {
			this.perpage = page;
			this.fetch();
		},
		changePage(page) {
      this.page = page;
      this.fetch();
		},
		searchItem() {
			this.fetch();
		},
    async fetch() {
      const res = await this.$http({
				url: 'rest/items',
				params: {
					page: this.page,
					name: this.search.name,
					perpage: this.perpage
				}
			});
			this.items = res.data.items;
			this.itemsCounts = res.data.counts;
    },
		async remove(row) {
			this.$confirm(`是否确定要删除分类 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
					const res = await this.$http.delete(`rest/items/${row._id}`)
					console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
					});
					this.fetch()
        })
		}
	},
	created() {
		this.fetch()
	}
}
</script>