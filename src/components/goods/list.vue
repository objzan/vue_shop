<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="clearInputFn"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchFn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.add_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editGoodsFn(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="deleteGoodsFn(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[5, 15, 30]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods-list',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getGoodsList()
    },
    // 点击搜索触发
    searchFn() {
      this.getGoodsList()
    },
    // 点击清空输入框触发
    clearInputFn() {
      this.getGoodsList()
    },
    // 编辑商品
    editGoodsFn(goodId) {
      console.log(goodId)
      this.$router.push({
        path: '/goods/edit',
        query: {
          id: goodId
        }
      })
    },
    // 删除商品
    async deleteGoodsFn(goodsId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${goodsId}`)
        if (res.meta.status !== 200) return this.$message.success(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsList()
      } else {
        return false
      }
    },
    // 点击添加商品触发
    addGoodsPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style></style>
