<template>
  <div class="app-container">
    <span style="font-weight:bold">访视信息配置</span>
    <el-divider />
    <div style="display: flex; justify-content: space-between;">
      <VisiteInfoDialog type="create" :project-id="projectId" @refresh="queryVisitInfoCfgList" />
      <el-button
        plain
        type="warning"
        icon="el-icon-download"
        @click="handleExport"
      >导出</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="visitInfoCfgList"
      style="width: 100%; margin-top:  20px;"
    >
      <el-table-column
        prop="stage"
        label="访视阶段"
      />
      <el-table-column
        prop="fieldNameCn"
        label="字段名称"
      />
      <el-table-column
        prop="isRequired"
        label="是否必填"
      />
      <el-table-column
        prop="fieldTypeMsg"
        label="字段类型"
      />
      <el-table-column
        prop="inputModeMsg"
        label="输入方式"
      />
      <el-table-column
        prop="fieldLength"
        label="字段长度"
      />
      <el-table-column
        prop="decimalPrecision"
        label="小数点精度"
      />
      <el-table-column
        prop="address"
        label="数值范围"
      />
      <el-table-column
        prop="unit"
        label="单位"
      />
      <el-table-column
        prop="sort"
        label="排序"
      />
      <el-table-column
        prop="status"
        label="状态"
      />
      <el-table-column
        prop="createBy"
        label="创建人"
      />
      <el-table-column
        prop="address"
        label="创建时间"
      />
      <el-table-column
        prop="address"
        label="修改人"
      />
      <el-table-column
        prop="createTime"
        label="修改时间"
      />
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <VisiteInfoDialog type="update" :project-id="projectId" :data="scope.row" @refresh="queryVisitInfoCfgList" />
          <el-switch
            v-model="scope.row.status"
            style="margin-left: 20px"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
            @change="(status) => {
              switchVisitInfoStatus(status, scope.$index, scope.row)
            }"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
import { getVisitInfoCfgList, setVisitInfoCfgStatus } from '@/api/project/list'
import VisiteInfoDialog from './components/VisiteInfoDialog'
export default {
  components: { VisiteInfoDialog },
  props: ['activeName'],
  data() {
    return {
      loading: false,
      projectId: this.$route.query.id,
      visitInfoCfgList: [],
      switchRequest: false
    }
  },
  watch: {
    'activeName': function(newValue, oldValue) {
      if (newValue === 'visit') {
        this.queryVisitInfoCfgList()
      }
    }
  },
  methods: {
    async queryVisitInfoCfgList() {
      if (this.loading) return
      this.loading = true
      const response = await getVisitInfoCfgList({ projectId: this.projectId })
      this.loading = false
      if (response.code === 200) {
        this.visitInfoCfgList = response.rows
      }
    },
    async switchVisitInfoStatus(status, index, item) {
      try {
        if (this.switchRequest) return
        this.switchRequest = true
        const response = await setVisitInfoCfgStatus({ id: item.id, status })
        if (response.code === 200) {
          this.$message.success(response.msg)
        }
      } catch (e) {
        const list = _.cloneDeep(this.visitInfoCfgList)
        list[index].status = status === '1' ? '0' : '1'
        this.visitInfoCfgList = [...list]
      } finally {
        this.switchRequest = false
      }
    },
    // 受试者信息配置列表导出
    handleExport() {
      this.download('/visitInfo/cfg/export', {
        projectId: this.projectId
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style scoped>

</style>
