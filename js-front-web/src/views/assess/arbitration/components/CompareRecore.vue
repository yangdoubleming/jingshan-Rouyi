<template>
  <div>
    <el-button
      size="mini"
      type="text"
      @click="showDialog"
    >比对记录</el-button>
    <el-dialog
      title="比对记录"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-descriptions :column="1">
        <el-descriptions-item label="受试者编号">{{
          visitRecord.examineeNo
        }}</el-descriptions-item>
        <el-descriptions-item label="随机编号">{{
          visitRecord.RandomCoding
        }}</el-descriptions-item>
        <!--
                <el-descriptions-item label="比对结果">{{
                    visitRecord.isAgreement === 1 ? "一致" : "不一致"
                }}</el-descriptions-item>
                -->
      </el-descriptions>

      <el-table
        title="关联修改链条"
        :data="visitRecord.list"
        style="width: 100%"
      >
        <el-table-column label="评估人编号">
          <el-table-column prop="visitName" label="访视" />
          <el-table-column prop="assessCfgId" label="评估配置编号" />
        </el-table-column>
        <el-table-column label="IR1" prop="irNo">
          <el-table-column prop="evaluatorName" label="独立评估人" />
          <el-table-column prop="globalEvaluatorName" label="全局评估人" />
          <el-table-column
            prop="judgmentConclusionContent"
            label="独立评估结论"
          />
          <el-table-column prop="globalJudgmentConclusion" label="全局评估结论" />
        </el-table-column>
        <el-table-column label="IR2" prop="irNo2">
          <el-table-column prop="evaluatorName2" label="独立评估人" />
          <el-table-column prop="globalEvaluatorName2" label="全局评估人" />
          <el-table-column label="独立评估结论" prop="judgmentConclusionContent2" />
          <el-table-column prop="globalJudgmentConclusion2" label="全局评估结论" />
        </el-table-column>
        <el-table-column label="访视对比结果" prop="isAgreement" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryVisitRecord } from '@/api/assess/task'
export default {
  props: ['assessJobId', 'examineeId'],
  data() {
    return {
      visible: false,
      loading: false,
      visitRecord: {}
    }
  },
  methods: {
    showDialog() {
      this.visible = true
      this.getData()
    },
    async getData() {
      try {
        if (this.loading) return
        this.loading = true
        const response = await queryVisitRecord({
          projectId: JSON.parse(localStorage['chooseProject']).id,
          assessJobId: this.assessJobId,
          examineeId: this.examineeId
        })
        if (response.code === 200) {
          this.visitRecord = response.data
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
