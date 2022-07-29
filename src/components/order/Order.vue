<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            <span>{{ $dateFormat(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showLocationDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog title="地址" :visible.sync="adressDialogVisible" width="50%">
      <!-- 表单区域 -->
      <el-form :model="adressForm" :rules="adressFormRules" ref="adressFormRef" label-width="100px">
        <el-form-item label="活动名称" prop="adress1">
          <el-cascader :options="cityData" v-model="adressForm.adress1"></el-cascader>
        </el-form-item>
        <el-form-item label="活动名称" prop="adress2">
          <el-input v-model="adressForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="showLocationDialogVisible" width="50%">
      <!-- 时间线区域 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLocationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showLocationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入地区
import cityData from './citydata.js'
export default {
  name: 'goods-order',
  created() {
    this.getOrderList()
  },
  data() {
    return {
      // 获取订单数据查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单数据列表
      orderList: [],

      // 订单数据数量
      total: 0,
      adressDialogVisible: false, // 地址对话框显示状态

      // 地址对话框数据
      adressForm: {
        adress1: [],
        adress2: ''
      },
      // 地址对话框检验规则
      adressFormRules: {
        adress1: [{ required: true, message: '请选市/县', trigger: 'blur' }],
        adress2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 城市数据
      cityData,
      // 显示物流信息对话框显示状态
      showLocationDialogVisible: false,
      // 物流信息数据
      progressInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },

    // 改变订单每页显示数量触发
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },

    // 改变订单页码触发
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    // 显示地址对话框
    showEditDialog() {
      this.adressDialogVisible = true
    },
    // 显示物流信息对话框
    showLocationDialog() {
      this.showLocationDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
