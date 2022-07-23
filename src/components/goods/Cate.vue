<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
        <el-col>
          <!-- 表格 -->
          <tree-table
            class="treeTable"
            :data="cateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            border
            index-text="#"
            show-row-hover
          >
            <!-- 是否有效插槽 -->
            <template slot="isOk" slot-scope="scope">
              <i
                class="el-icon-success"
                v-if="scope.row.cat_deleted === false"
                style="color: lightgreen"
              ></i>
              <i class="el-icon-error" v-else style="color: red"></i>
            </template>

            <!-- 等级 -->
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag size="mini" type="warning" v-else>三级</el-tag>
            </template>

            <!-- 操作 -->
            <template slot="opt">
              <el-button type="primary" size="mini">编辑</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </tree-table>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeCateDialog"
    >
      <!-- 添加分类表单 -->
      <el-form :model="cateForm" :rules="cateFormRules" ref="cateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentsCateList"
            :props="{ expandTrigger: 'hover', ...cascaderProps, checkStrictly: 'ture' }"
            clearable
            change-on-select
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'my-cate',
  data() {
    return {
      // 获取分类列表查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [], // 分类列表数据
      total: 0, // 总数`
      // 定义列数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框显示状态
      addCateDialogVisible: false,
      // 添加分类表单数据
      cateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加分类表单校验规则
      cateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentsCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [] // 级联选择器选择的id
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentsCateList()
    },
    // 获取父级分类数据
    async getParentsCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentsCateList = res.data
    },
    handleChange(value) {
      console.log(value)
      if (this.selectedKeys.length !== 0) {
        this.cateForm.cat_pid = value[this.selectedKeys.length - 1]
        this.cateForm.cat_level = this.selectedKeys.length
        return false
      } else {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      }
    },
    // 关闭添加分类对话框清空数据
    closeCateDialog() {
      this.$refs.cateFormRef.resetFields()
      this.selectedKeys = []
      this.cateForm.cat_pid = 0
      this.cateForm.cat_level = 0
    },
    // 添加商品分类
    addCateFn() {
      console.log(this.cateForm)
      this.$refs.cateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.cateForm)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.addCateDialogVisible = false
          this.getCateList()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
