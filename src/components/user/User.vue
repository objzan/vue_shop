<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserFn">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStatusChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditFormDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserFn(scope.row.id)"
            ></el-button>
            <!-- 权限分配按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="权限分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="addDialogClose" width="50%">
      <!-- 添加用户表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
      width="50%"
    >
      <!-- 添加用户表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <div>
        <p>用户名：{{ userInfo.username }}</p>
        <p>当前用户角色：{{ userInfo.role_name }}</p>
        <p>
          分配新用户角色：
          <el-select v-model="selectRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setNewRoleFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'my-user',
  data() {
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法邮箱'))
      }
    }
    const checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法手机号码'))
      }
    }
    return {
      // 获取用户列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2 // 当前每页显示多少条数据
      },
      userList: [], // 用户列表
      total: 0, // 用户总数
      dialogVisible: false, // 添加用户对话框显示状态
      editDialogVisible: false, // 编辑用户对话框状态
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户对话框表单数据
      editForm: {},
      // 登陆表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur', validator: checkEmail }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur', validator: checkMobile }
        ]
      },
      // 登陆表单验证规则
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur', validator: checkEmail }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur', validator: checkMobile }
        ]
      },

      setRoleDialogVisible: false, // 分配权限对话框显示状态
      userInfo: {}, // 用户信息
      rolesList: [], // 角色列表
      selectRoleId: '' // 选择角色对应id
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据事件
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 监听页码值改变事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 监听用户状态Switch开关事件
    async userStatusChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 添加用户事件
    addUserFn() {
      this.dialogVisible = true
    },
    // 关闭对话框清空表单数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid)
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          console.log(res)
          if (res.meta.status !== 201) return this.$message(res.meta.msg)
          this.$message.success(res.meta.msg)
          // 隐藏对话框
          this.dialogVisible = false
          // 重新获取数据
          this.getUserList()
        } else {
          return false
        }
      })
    },
    // 编辑用户信息对话框
    async showEditFormDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 关闭编辑对话框清空数据
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    editUserFn() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.editDialogVisible = false
          this.getUserList()
        } else {
          return false
        }
      })
    },
    // 删除用户
    async deleteUserFn(id) {
      const confirmResult = await this.$confirm('是否删除用户？', '温馨提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },

    // 展示分配权限对话框
    async showSetRoleDialog(userinfo) {
      this.userInfo = userinfo
      this.setRoleDialogVisible = true
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },

    // 分配新角色
    async setNewRoleFn() {
      if (!this.selectRoleId) return this.$message.error('请选择角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      })
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRoleDialogVisible = false
      this.getUserList()
    }
  }
}
</script>

<style></style>
