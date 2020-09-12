<template>
  <div class="home">
    <h1>文章列表</h1>
    <el-row>
      <el-col :span="16">
        <el-row type="flex">
          <el-col :span="6">
            <el-select placeholder="请选择一个英雄分类" v-model="search.cat">
              <el-option label="不限" value></el-option>
              <el-option
                v-for="articleCat of articleCats"
                :key="articleCat._id"
                :label="articleCat.name"
                :value="articleCat._id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input placeholder="请输入要搜索的文章名称，支持模糊查询" auto-complete="off" v-model="search.name"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="searchArticle">搜索</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="240"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/articles/edit/${scope.row._id}`)"
          >编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="mt-10">
      <el-pagination background layout="prev, sizes, pager, next" :total="articleCounts" @current-change="changePage" @size-change="changeSizeChange" :page-size="5" :page-sizes="[5, 10, 15, 20]"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
			articleCats: [],
			page: 1,
			perpage: 5,
			articleCounts: 0,
			search: {
        cat: "",
        name: "",
      }
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
		searchArticle() {
			this.fetch();
		},
    async fetch() {
      const res = await this.$http({
				url: 'rest/articles',
				params: {
					page: this.page,
					cat: this.search.cat,
					name: this.search.name,
					perpage: this.perpage
				}
			});
			this.items = res.data.items;
			this.articleCounts = res.data.counts;
    },
    async fetchArticleCats() {
      const res = await this.$http.get(`rest/categories`);
      this.articleCats = res.data;

      this.articleCats = this.articleCats.filter(
        (cate) => cate.name == "新闻分类"
      )[0].children;
    },
    async remove(row) {
      this.$confirm(`是否确定要删除文章 "${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.$http.delete(`rest/articles/${row._id}`);
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
    this.fetchArticleCats();
    this.fetch();
  },
};
</script>