<template>
  <div>
    <el-button style="margin-left: 10px" size="mini" type="primary" @click="detailsDialog = true">质疑详情</el-button>
    <!-- 质疑详情 -->
    <QuestionDetails :visible="detailsDialog" :visitId="visitId" @close="closeDia" />
  </div>
</template>

<script>
import { getQuestionDetail, addVisitAnswer, setVisitQuestionStatus } from '@/api/audit/data'
import QuestionDetails from '@/views/components/QuestionDetails/index'
export default {
  components: { QuestionDetails },
  props: ['visitId'],
  data() {
    return {
      detailsDialog: false
    }
  },
  methods: {
    // 关闭质疑弹窗
    closeDia() {
      this.detailsDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>   </style>
