
<template>
    <div>
        <el-button size="mini" type="text" @click="showDialog">撤回</el-button>
        <el-dialog
            title="撤回评估"
            :visible.sync="show"
            width="500px"
            :close-on-click-modal="false"
            append-to-body
        >
            <el-descriptions :column="1">
                <el-descriptions-item label="受试者编号">{{
                    detailsInfo.examineeNo
                }}</el-descriptions-item>
                <el-descriptions-item label="随机编号">{{
                    detailsInfo.randomNo
                }}</el-descriptions-item>
                <el-descriptions-item label="撤回原因">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="validMsg"
                    >
                    </el-input>
                </el-descriptions-item>
            </el-descriptions>

            <h2 style="text-align: center">撤回链条</h2>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    prop="assessTypeMsg"
                    label="评估类型"
                    width=""
                />
                <el-table-column
                    prop="assessCfgId"
                    label="评估配置编号"
                    width=""
                />
                <el-table-column prop="irNo" label="评估人编号" />
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="retract">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
  <script>
import {
    setAssessValid,
    getAssessExamineeVisitDetails,
} from "@/api/assess/task";
export default {
    props: {
        assessJobId: { type: Number },
    },
    data() {
        return {
            show: false,
            detailsInfo: {
                assessVisitInfoList: [],
            },
            validMsg: "",
            tableData: [],
        };
    },
    mounted() {},
    methods: {
        getAssessExamineeVisitDetails() {
            getAssessExamineeVisitDetails({
                assessJobId: this.assessJobId,
                updateType: 1,
            }).then((res) => {
                this.detailsInfo = res.data || {};
                this.tableData = res.data.assessVisitInfoList || [];
            });
        },
        showDialog() {
            this.getAssessExamineeVisitDetails();
            this.show = true;
        },
        // 撤回
        retract() {
            if (!this.validMsg) {
                return this.$message.warning("请填写撤回原因");
            }
            setAssessValid({
                assessJobId: this.assessJobId,
                validMsg: this.validMsg,
            }).then((res) => {
                this.validMsg = "";
                this.$message.success("撤回成功");
                this.show = false;
                this.$emit("getList");
            });
        },
    },
};
</script>
  
  <style scoped>
</style>
  