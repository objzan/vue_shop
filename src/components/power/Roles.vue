<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <!-- 添加角色按钮 -->
        <el-col>
          <el-button type="primary" @click="addRolesDialogFn">添加角色</el-button>
        </el-col>
        <!-- 角色列表表格 -->
        <el-col>
          <el-table :data="rolesList" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row
                  :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vertical']"
                  v-for="(item1, index1) in scope.row.children"
                  :key="item1.id"
                >
                  <!-- 渲染一级菜单 -->
                  <el-col :span="6">
                    <el-tag closable @close="deleteTagFn(scope.row, item1.id)">
                      {{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二三级菜单 -->
                  <el-col :span="18">
                    <el-row
                      :class="[index2 === 0 ? '' : 'bdtop', 'vertical']"
                      v-for="(item2, index2) in item1.children"
                      :key="item2.id"
                    >
                      <!-- 二级权限 -->
                      <el-col :span="5">
                        <el-tag type="success" closable @close="deleteTagFn(scope.row, item2.id)">{{
                          item2.authName
                        }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 三级权限 -->
                      <el-col :span="19">
                        <el-tag
                          type="warning"
                          closable
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          @close="deleteTagFn(scope.row, item3.id)"
                          >{{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <!-- 编辑角色按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialogFn(scope.row.id)"
                  >编辑</el-button
                >
                <!-- 删除角色按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteRolesFn(scope.row.id)"
                  >删除</el-button
                >
                <!-- 分配权限按钮 -->
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="showSetRolesDialogFn(scope.row)"
                  >分配权限</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="colseDialogFn"
    >
      <!-- 添加角色表单 -->
      <el-form :model="rolesForm" :rules="rolesRules" ref="rolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesFn">取 消</el-button>
        <el-button type="primary" @click="addRolesFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="50%">
      <!-- 编辑角色表单 -->
      <el-form
        :model="editRolesForm"
        :rules="rolesRules"
        ref="editRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="ritgtList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRightFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'my-roles',
  data() {
    return {
      rolesList: [], // 角色列表数据
      addRolesDialogVisible: false, // 添加角色对话框显示状态
      editRolesDialogVisible: false, // 编辑用户对话框显示状态
      setRoleDialogVisible: false, // 分配权限对话框显示状态
      // 添加角色表单数据
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {},
      // 表单认证
      rolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      ritgtList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 显示添加角色对话框
    addRolesDialogFn() {
      this.addRolesDialogVisible = true
    },
    // 关闭对话框清空输入框数据
    colseDialogFn() {
      this.$refs.rolesFormRef.resetFields()
    },
    // 确定添加角色
    addRolesFn() {
      this.$refs.rolesFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.rolesForm)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.addRolesDialogVisible = false
          this.getRolesList()
        }
      })
    },
    // 显示编辑用户对话框
    async editDialogFn(id) {
      this.editRolesDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      this.editRolesForm = res.data
      console.log(res)
    },
    // 编辑提交
    editRolesFn() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `roles/${this.editRolesForm.roleId}`,
            this.editRolesForm
          )
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
          this.$message.success('编辑角色成功')
          this.editRolesDialogVisible = false
          this.getRolesList()
        }
      })
    },
    // 删除角色
    async deleteRolesFn(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    // 删除角色对应的权限
    async deleteTagFn(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRolesDialogFn(role) {
      this.roleId = role.id
      this.setRoleDialogVisible = true
      // 获取权限数据
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      // 把获取到的权限数据保存到ritgtList
      this.ritgtList = res.data
      // 递归获取三级节点id
      this.getDefKeysFn(role, this.defKeys)
    },
    // 分配权限对话框关闭清空defKeys ID
    setRightDialogClose() {
      this.defKeys = []
    },

    // 点击确定分配勾选权限
    async addRightFn() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      // 拼接数组
      const idStr = keys.join(',')
      console.log(idStr)

      // 发起网络请求
      const { data: res } = await this.$http.post(`roles/${this.roleId}}/rights`, { rids: idStr })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRoleDialogVisible = false
      this.getRolesList()
    },

    // 递归函数 获取所有节点id
    getDefKeysFn(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getDefKeysFn(item, arr))
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vertical {
  display: flex;
  align-items: center;
}
</style>
