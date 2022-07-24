<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- alert警告提示区域 -->
      <el-alert
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="selectCate">
        <el-col>
          <span>请选择商品分类</span>
        </el-col>
        <!-- 级联选择器区域 -->
        <el-col>
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover', ...cascaderProps }"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="showAddAttributesDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格区域 -->
          <el-table :data="manyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染参数属性 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加属性 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" @click="deleteAttributes(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="showAddAttributesDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格区域 -->
          <el-table :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染参数属性 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加属性 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" @click="deleteAttributes(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数、静态属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addAttributesDialogVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <!-- 表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttributesBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑动态参数、静态属性对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editAttributesDialogVisible" width="50%">
      <!-- 表单区域 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttributesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttributesBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goods-params',
  data() {
    return {
      cateList: [], // 商品分类数据
      // 级联选择器属性
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectKeys: [], // 级联选择器选择的id
      activeName: 'many', // tab标签选择状态
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态属性数据
      addAttributesDialogVisible: false, // 添加参数对话框显示状态
      // 添加参数表单数据
      addForm: {},
      // 添加参数表单校验
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editForm: {}, // 编辑分类对话框数据
      editAttributesDialogVisible: false // 编辑参数对话框显示状态
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择框选中项变化,会触发
    handleChange() {
      // 证明选中的不是三级分类
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []

        // 解决选择二级分类有数据
        this.manyTableData = []
        this.onlyTableData = []
        return false
      } else {
        this.getAttributesList()
      }
    },
    // tab 页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName)
      this.getAttributesList()
    },
    // 获取动态参数、静态属性列表
    async getAttributesList() {
      // 根据所选的分类的ID,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 获取Tag的数据分割为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
        item.inputVisible = false // 控制文本框的显示和隐藏
        item.inputValue = '' // 清空文本输入框
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 显示添加参数对话框
    showAddAttributesDialog() {
      this.addAttributesDialogVisible = true
    },
    // 关闭添加参数对话框清空表单数据
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addAttributesBtn() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.addAttributesDialogVisible = false
          this.getAttributesList()
        } else {
          return false
        }
      })
    },
    // 显示编辑对话框
    async showEditDialog(attrId) {
      this.editAttributesDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        attr_sel: this.activeName
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    // 提交编辑参数
    async editAttributesBtn() {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editAttributesDialogVisible = false
      this.getAttributesList()
    },
    // 删除参数
    async deleteAttributes(attrId) {
      console.log(attrId)
      const confirmResult = await this.$confirm('是否永久删除该参数？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attrId}`
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getAttributesList()
      } else {
        return false
      }
    },
    // 文本框失去焦点和回车触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      } else {
        // 如果没有return证明内容合法做后续处理
        row.attr_vals.push(row.inputValue.trim())

        row.inputValue = ''
        row.inputVisible = false
        // 需要发送请求,保存
        this.saveTagInputData(row)
      }
    },
    // 显示input输入框
    showInput(row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // Tag标签的删除
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveTagInputData(row)
    },
    // 发起添加或者修改参数可选项网络请求
    async saveTagInputData(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    // 添加属性、参数按钮是否禁用
    isBtnDisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 三级分类id值
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[this.selectKeys.length - 1]
      } else {
        return null
      }
    },
    // 添加动态参数、静态属性标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.selectCate {
  margin-top: 15px;
}
.el-tag {
  margin: 0 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
