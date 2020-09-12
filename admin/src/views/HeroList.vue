<template>
  <div class="home">
    <h1>英雄列表</h1>
    <el-row>
      <el-col :span="16">
        <el-row type="flex">
          <el-col :span="6">
            <el-select placeholder="请选择一个英雄分类" v-model="search.cat">
              <el-option label="不限" value></el-option>
              <el-option
                v-for="heroCat of heroCats"
                :key="heroCat._id"
                :label="heroCat.name"
                :value="heroCat._id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12" v-model="search.name">
            <el-input placeholder="请输入要搜索的英雄名称，支持模糊查询" auto-complete="off" v-model="search.name"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="searchHero" icon="el-icon-search">搜索</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="items" stripe>
      <el-table-column prop="_id" label="ID" width="240"></el-table-column>
      <el-table-column prop="categories[0].name" label="英雄分类" align="center"></el-table-column>
      <el-table-column prop="name" label="英雄名称" align="center"></el-table-column>
      <el-table-column prop="title" label="称号"></el-table-column>
      <el-table-column prop="avatar" label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="height:3rem;" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/heroes/edit/${scope.row._id}`)"
          >编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
		<!-- 分页 -->
    <div class="mt-10">
      <el-pagination background layout="prev, sizes, pager, next" :total="heroCounts" @current-change="changePage" @size-change="changeSizeChange" :page-size="5" :page-sizes="[5, 10, 15, 20]"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
			items: [],
			heroCounts: 0,
			perpage: 5,
			page: 1,
      heroCats: [],
      search: {
        cat: "",
        name: "",
      },
    };
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
    searchHero() {
			this.fetch()
		},
    async fetch() {
      const res = await this.$http({
				url: 'rest/heroes',
				params: {
					page: this.page,
					cat: this.search.cat,
					name: this.search.name,
					perpage: this.perpage
				}
			});
			this.items = res.data.items;
			this.heroCounts = res.data.counts;
			console.log(this.items);
			console.log(this.heroCounts);
    },
    async fetchHeroCats() {
      const res = await this.$http.get(`rest/categories`);
      this.heroCats = res.data;

      this.heroCats = this.heroCats.filter(
        (cate) => cate.name == "英雄分类"
      )[0].children;
    },
    async remove(row) {
      this.$confirm(`是否确定要删除分类 "${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.$http.delete(`rest/heroes/${row._id}`);
        console.log(res);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.fetch();
      });
    },
  },
  created() {
    this.fetchHeroCats();
    this.fetch();
  },
};
</script>

<style >
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 50px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 50px;
}
</style>