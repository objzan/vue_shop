<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- alert提示框区域  -->
      <el-alert title="编辑商品信息" type="info" show-icon :closable="false"> </el-alert>

      <!-- 进度条区域 -->
      <el-steps :active="activeIndex - 0" :space="200" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="goodsInfo"
        status-icon
        :rules="EditFromRules"
        ref="EditFromRef"
        label-width="100px"
      >
        <el-tabs tab-position="left" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsInfo.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsInfo.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsInfo.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器区域 -->
              <el-cascader
                v-model="goodsInfo.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover', ...cascaderProps }"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
          <el-tab-pane label="完成" name="5">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods-name',
  data() {
    return {
      activeIndex: 0,
      goodsInfo: {},
      EditFromRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      },
      cateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },

  created() {
    this.getGoodsInfo()
    this.getCateList()
  },
  methods: {
    // 根据id获取商品信息
    async getGoodsInfo() {
      const { data: res } = await this.$http.get(`goods/${this.goodsId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsInfo = res.data
      console.log(this.goodsInfo)
    },
    // 获取商品分类信息渲染级联选择器
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    }
  },
  computed: {
    goodsId() {
      return Number(this.$route.query.id)
    }
  }
}
</script>

<style></style>
