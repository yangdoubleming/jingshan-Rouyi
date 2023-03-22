
<template>
  <div>
    <el-button size="mini" type="text" @click="showDialog">修改评估人</el-button>
    <el-dialog title="修改仲裁评估人" :visible.sync="show" width="500px" :close-on-click-modal="false" append-to-body>
      <el-descriptions :column="1">
        <el-descriptions-item label="受试者编号">{{detailsInfo.examineeNo}}</el-descriptions-item>
        <el-descriptions-item label="随机编号">{{detailsInfo.randomNo}}</el-descriptions-item>
        <el-descriptions-item label="包括的访视">{{detailsInfo.visitNames}}</el-descriptions-item>
        <el-descriptions-item label="新评估人">
          <el-select v-model="evaluatorId" placeholder="请选择" filterable style="width: 100%">
              <el-option v-for="item in detailsInfo.evaluatorList" :key="item.evaluatorId" :label="item.evaluatorName" :value="item.evaluatorId" />
          </el-select>
        </el-descriptions-item>
      </el-descriptions>

      <el-table title="关联修改链条" :data="tableData" style="width: 100%">
        <el-table-column prop="assessTypeMsg" label="评估类型" width="" />
        <el-table-column prop="assessCfgId" label="评估配置编号" width="" />
        <el-table-column prop="irNo" label="评估人编号" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateEvaluator">确 定</el-button>
        <el-button @click="show = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  setAssessEvaluatorId,
  getAssessExamineeVisitDetails
} from '@/api/assess/task'
export default {
  props: {
    assessJobId:{ type:Number }
  },
  data() {
    return {
      show: false,
      detailsInfo:{
        assessVisitInfoList:[]
      },
      evaluatorId:'',
      tableData:[]
    }
  },
  mounted(){

  },
  methods: {
    getAssessExamineeVisitDetails(){
      getAssessExamineeVisitDetails({assessJobId:this.assessJobId,updateType: 2}).then(res=>{
        this.detailsInfo = res.data || {}
        this.tableData = res.data.assessVisitInfoList || []
      })
    },
    showDialog() {
      this.getAssessExamineeVisitDetails()
      this.show = true
    },
    // 修改评估人
    updateEvaluator() {
      if(!this.evaluatorId){
        return this.$message.warning('请选择新评估人')
      }
      setAssessEvaluatorId({
        assessJobId: this.assessJobId,
        evaluatorId:  this.evaluatorId
      }).then(res=>{
        this.evaluatorId = ''
        this.$message.success('修改成功')
        this.show = false
        this.$emit('getList')
      })
    }
  }
}
</script>

<style scoped>

</style>
