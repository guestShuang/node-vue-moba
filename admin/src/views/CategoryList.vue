<template>
  <div class="home">
    <h1>分类列表</h1>
    <tree-table
      :data="items"
      show-index
      index-text="序号"
      :columns="columns"
      :expand-type="false"
      :selection-type="false"
      border
    >
      <template slot="operate" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="$router.push(`/categories/edit/${scope.row._id}`)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row)">删除</el-button>
      </template>
    </tree-table>
    <!-- <el-table :data="items">
			<el-table-column prop="_id" label="ID" width="240"></el-table-column>
			<el-table-column prop="parent.name" label="上级分类"></el-table-column>
			<el-table-column prop="name" label="分类名称"></el-table-column>
			<el-table-column fixed="right" label="操作" width="180">
				<template slot-scope="scope">
					<el-button type="text" size="small" 
					@click="$router.push(`/categories/edit/${scope.row._id}`)">编辑</el-button>
					<el-button type="text" size="small" 
					@click="remove(scope.row)">删除</el-button>
				</template>	
			</el-table-column>
    </el-table>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      columns: [
        {
          label: "分类名称",
          prop: "name",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
          align: "center",
          headerAlign: "center",
        }
			]
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/categories");
			const data = res.data;
      this.items = data
      console.log(this.items);
    },
    async remove(row) {
      this.$confirm(`是否确定要删除分类 "${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.$http.delete(`rest/categories/${row._id}`);
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
    this.fetch();
  },
};
</script>