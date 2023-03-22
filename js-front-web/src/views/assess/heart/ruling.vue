<template>
    <div class="app-container">
        <!--    <div-->
        <!--      style="-->
        <!--        display: flex;-->
        <!--        align-items: center;-->
        <!--        justify-content: space-between;-->
        <!--        margin: 30px;-->
        <!--      "-->
        <!--    >-->
        <!--      <el-image>-->
        <!--        <div slot="error" class="image-slot">-->
        <!--          <i class="el-icon-picture-outline"></i>-->
        <!--        </div>-->
        <!--      </el-image>-->
        <!--      <div style="text-align: center; font-size: 16px; font-weight: bold">-->
        <!--        <div>【客户公司名称】 【方案编号】</div>-->
        <!--        <div>景杉科技 【项目编号】</div>-->
        <!--      </div>-->
        <!--      <el-image :src="logoImg" style="height: 30px">-->
        <!--        <div slot="error" class="image-slot">-->
        <!--          <i class="el-icon-picture-outline"></i>-->
        <!--        </div>-->
        <!--      </el-image>-->
        <!--    </div>-->
        <div
            style="
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin: 15px;
            "
        >
            心脏毒性裁定评估病例报告
        </div>
        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span style="display: inline-block"
                    >受试者编号：{{ examineeNo }}</span
                >
                <span style="display: inline-block; margin: 0 50px"
                    >访视名称：{{ visitName }}</span
                >
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="dialogVisible1 = true"
                    >查看文件</el-button
                >
            </div>
          <div v-if="currentTableData.list&&currentTableData.list[0].isFirstVisit!==1">
            <div style="text-align: center; margin-bottom: 10px">
                既往心脏毒性独立评估报告小结
            </div>
            <el-table :data="pastTableData" style="width: 100%" border>
                <el-table-column prop="visitName" label="访视名称"/>
                <el-table-column
                    prop="judgmentConclusionContent"
                    label="独立评估者#1结论"
                >
                    <template slot-scope="scope">
                        <router-link
                            target="_blank"
                            style="text-decoration: underline"
                            :to="{
                                path:
                                    scope.row.isFirstVisit === 1
                                        ? '/assess/heart/compareBaseLine'
                                        : '/assess/heart/compareVisit',
                                query: {
                                    assessJobId: scope.row.assessJobId,
                                    assessJobId2: scope.row.assessJobId2,
                                    examineeNo: $route.query.examineeNo,
                                    visitName: scope.row.visitName,
                                },
                            }"
                            >{{ scope.row.judgmentConclusionContent }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="judgmentConclusionContent2"
                    label="独立评估者#2结论"
                >
                    <template slot-scope="scope">
                        <router-link
                            target="_blank"
                            style="text-decoration: underline"
                            :to="{
                                path:
                                    scope.row.isFirstVisit === 1
                                        ? '/assess/heart/compareBaseLine'
                                        : '/assess/heart/compareVisit',
                                query: {
                                    assessJobId: scope.row.assessJobId,
                                    assessJobId2: scope.row.assessJobId2,
                                    examineeNo: $route.query.examineeNo,
                                    visitName: scope.row.visitName,
                                },
                            }"
                            >{{
                                scope.row.judgmentConclusionContent2
                            }}</router-link
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="globalIrNo" label="裁定评估者结论">
                    <template slot-scope="scope">
                        {{
                            scope.row.globalIrNo === null
                                ? "N/A"
                                : scope.row.globalIrNo==="IR1"?"独立评估者 #1":"独立评估者 #2"
                        }}
                    </template>
                </el-table-column>
            </el-table>
          </div>
            <div style="text-align: center; margin: 10px">
                当前访视心脏毒性独立评估报告小结
            </div>
            <el-table :data="currentTableData.list" style="width: 100%" border>
                <el-table-column prop="visitName" label="访视名称" />
                <el-table-column
                    prop="judgmentConclusionContent"
                    label="独立评估者#1结论"
                >
                    <template slot-scope="scope">
                        <router-link
                            target="_blank"
                            style="text-decoration: underline"
                            :to="{
                                path:
                                    scope.row.isFirstVisit === 1
                                        ? '/assess/heart/compareBaseLine'
                                        : '/assess/heart/compareVisit',
                                query: {
                                    assessJobId: scope.row.assessJobId,
                                    assessJobId2: scope.row.assessJobId2,
                                    examineeNo: $route.query.examineeNo,
                                    visitName: scope.row.visitName,
                                },
                            }"
                            >{{ scope.row.judgmentConclusionContent }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="judgmentConclusionContent2"
                    label="独立评估者#2结论"
                >
                    <template slot-scope="scope">
                        <router-link
                            target="_blank"
                            style="text-decoration: underline"
                            :to="{
                                path:
                                    scope.row.isFirstVisit === 1
                                        ? '/assess/heart/compareBaseLine'
                                        : '/assess/heart/compareVisit',
                                query: {
                                    assessJobId: scope.row.assessJobId,
                                    assessJobId2: scope.row.assessJobId2,
                                    examineeNo: $route.query.examineeNo,
                                    visitName: $route.query.visitName,
                                },
                            }"
                            >{{
                                scope.row.judgmentConclusionContent2
                            }}</router-link
                        >
                    </template>
                </el-table-column>
            </el-table>

            <el-descriptions title="" :column="1" border>
                <el-descriptions-item label="*裁定评估者同意评估结论为">
                    <template v-if="!isShow">
                        <el-radio v-model="conclusion" label="1"
                            >独立评估者#1</el-radio
                        >
                        <el-radio v-model="conclusion" label="2"
                            >独立评估者#2</el-radio
                        >
                    </template>
                    <template v-if="isShow">
                        <el-radio
                            v-model="conclusion"
                            :disabled="isShow"
                            :label="currentTableData.list[0].irNo"
                            >独立评估者#1</el-radio
                        >
                        <el-radio
                            v-model="conclusion"
                            :disabled="isShow"
                            :label="currentTableData.list[0].irNo2"
                            >独立评估者#2</el-radio
                        >
                    </template>
                    的结论。
                </el-descriptions-item>
                <el-descriptions-item label="评估意见">
                    <el-input
                        :readonly="isShow"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="assessOpinions"
                    ></el-input>
                </el-descriptions-item>
            </el-descriptions>
            <div
                style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 30px;
                    font-size: 14px;
                    color: #606266;
                "
            >
                在此处签字表明，在您的经验和知识范围内，以上判断准确无误：
                <el-button
                    type="primary"
                    @click="showSignDialog"
                    v-if="!isShow"
                >
                    完成提交
                </el-button>
            </div>

            <el-descriptions v-if="isShow" :column="3" border>
                <el-descriptions-item>
                    <template slot="label"> 签名 </template>
                    {{ currentTableData.autographUser }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"> 签名时间 </template>
                    {{ currentTableData.autographDate }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <span class="sign-status"> 已评估 </span>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>

        <el-card
            class="box-card"
            style="margin: 30px 0"
            shadow="never"
            :close-on-click-modal="false"
        >
            <div slot="header" class="clearfix">
                <span>方案规定的心脏功能相关入、排标准</span>
            </div>
            <div style="font-size: 14px; color: #606266">
                <div>入组标准：</div>
                <div>
                    ① 超声心动图：左室射血分数（LVEF）≥55%（双平面 Simpson
                    法测量）；<br />
                    ② NT-proBNP﹤年龄界限值；<br />
                    ③ 肌钙蛋白在正常值范围内；<br />
                    ④ 12 导联心电图：无严重心律失常，QTcF ≤480ms；<br /><br />

                    排除标准：<br />
                    ① 既往发生过心肌梗死、脑出血；<br />
                    ② 首次给药前 6
                    个月内发生过动/静脉血栓事件且未经正规治疗者，如脑血管意外（包括暂时性缺血性发作）、深静脉血栓及肺栓塞者；<br />
                    ③ 首次给药前 6
                    个月内发生严重的心脑血管疾病，如急性冠脉综合征、充血性心力衰竭（美国纽约心脏病协会[NYHA]心功能分级Ⅱ-Ⅳ级）、缺血性脑卒中（腔隙性脑梗塞除外）、主动脉夹层等；<br />
                    ④ 临床无法控制的高血压（即收缩压≥160 mmHg，和/或舒张压≥100
                    mmHg）；<br />
                    ⑤
                    静息心电图或动态心电图提示的严重心律失常或形态学改变，如频发室性早搏(24
                    小时动态心电图室早负荷≥10%)、室性心动过速、II-III
                    度房室传导阻滞、病态窦房结综合征等；<br />
                    ⑥ 任何增加 QTc
                    延长风险或心律失常风险的因素，如心衰、低钾血症、先天性长 QT
                    综合征、长 QT 综合征家族史，或一级亲属中有小于 40
                    岁发生无法解释的猝死，或使用任何已知可延长 QT
                    间期的伴随药物；<br />
                </div>
            </div>
        </el-card>

        <el-card
            class="box-card"
            style="margin: 30px 0"
            shadow="never"
            :close-on-click-modal="false"
        >
            <div slot="header" class="clearfix">
                <span>方案规定的心脏毒性相关停止治疗标准</span>
            </div>
            <div style="font-size: 14px; color: #606266">
                <div>
                    受试者出现以下一条或多条心脏毒性：<br />
                    ① 左室射血分数（LVEF）绝对值≤45%且较基线降低≥10%；<br />
                    ②
                    出现充血性心衰症状（NYHA分级III-IV级）或体征（肺部听诊有啰音或下肢水肿）伴有NT-proBNP超过年龄界限值；<br />
                    ③
                    发生急性心肌梗死或有临床意义的急性心肌损伤，肌钙蛋白超过正常参考值上限2倍及以上；<br />
                    ④
                    12导联心电图或心电监护新出现的有临床意义的ST段抬高，经证实存在心肌缺血或心肌梗死；<br />
                    ⑤ 心电图、动态心电图或心电监护记录的严重心律失常：<br />
                    室性心动过速、尖端扭转室性心动过速、心室颤动等危及生命的快速性室性心律失常；<br />
                    二度II型房室阻滞、二度2:1房室阻滞、高度房室阻滞、三度房室阻滞；<br />
                    严重窦性心动过缓（心率≤40次/分），窦性停搏、窦房阻滞；<br />
                    ⑥
                    静息心电图测定QTc间期（用Fridericia’s公式校正心率)，当QTc间期延长＞500ms或较基线QTc延长＞60ms。<br />
                    注：若受试者出现可疑上述情况，经由心脏毒性独立评估委员会评估后决定是否符合停止治疗标准。<br />
                </div>
            </div>
        </el-card>
        <el-dialog
            title="文件列表"
            :visible.sync="dialogVisible1"
            width="50%"
            :close-on-click-modal="false"
        >
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane
                    v-for="(item, index) in visitList"
                    :key="index"
                    :label="item.name"
                    :name="String(item.id)"
                >
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        header-align="center"
                    >
                        <el-table-column
                            prop="fileName"
                            label="文件名称"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="操作"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <a
                                    target="_blank"
                                    :href="scope.row.storageUrl"
                                    style="color: #1890ff"
                                    >查看</a
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <el-dialog
            title="✔完成提交"
            :visible.sync="dialogVisible2"
            width="50%"
            :close-on-click-modal="false"
            v-loading="loading"
        >
            <div style="font-size: 16px; color: black; font-weight: bold">
                签名声明：
            </div>
            <div style="margin: 10px 0; color: #606266; font-size: 14px">
                本人确认，此病例报告表是由我完成的，在我的经验和知识范围内，我已尽可能的确保评估报告的准确性和完整性。通过输入本人的用户密码，并单击【签名】按钮，完成本人电子签名，与本人手写签名具有同等的法律约束力。
            </div>
            <div>
                账户： {{ $store.state.user.nickName }} ({{
                    $store.state.user.name
                }})
            </div>
            <div
                style="
                    display: flex;
                    align-items: center;
                    justify-content: start;
                    margin: 10px 0;
                "
            >
                <div style="width: 45px">密码：</div>
                <el-input
                    style="width: 200px"
                    type="password"
                    v-model="signForm.password"
                    placeholder="请输入内容"
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSignForm"
                    >签 名</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import logoImg from "@/assets/logo/logow.png";
import {
    autograph,
    queryNotCurrentVisit,
    queryCurrentVisit,
    submitCardiotoxicityArbitration,
    visitList,
    getVisitOtherDetailList,
    assessmenting
} from "@/api/assess/task";

export default {
    name: "Post",
    dicts: ["sys_normal_disable"],
    data() {
        return {
            activeName:"",
            visitName: this.$route.query.visitName,
            examineeNo: this.$route.query.examineeNo,
            // 遮罩层
            loading: false,
            checkList: [],
            radio: "",
            textarea: "",
            logoImg,
            dialogVisible1: false,
            dialogVisible2: false,
            input: "",
            signForm: {
                username: this.$store.state.user.name,
                password: "",
            },
            // 【既往心脏毒性独立评估报告小结】表格
            pastTableData: [],
            // 【当前访视心脏毒性独立评估报告小结】表格
            currentTableData: [],
            conclusion: "",
            assessOpinions: "",
            tableData: [],
            // 展示操作结果
            isShow: false,
            visitList: [],
        };
    },
    created() {
        this.getData();
    },
    methods: {
        async getData() {
            this.queryCurrentVisit();
            this.getQueryNotCurrentVisit();
        },
        // 待评估设置为评估中
        postAssessmenting(){
            assessmenting({assessJobId: this.$route.query.assessJobId})
        },
        async queryCurrentVisit() {
            // 当前访视心脏毒性独立评估报告小结
            const response = await queryCurrentVisit({
                projectId: JSON.parse(localStorage["chooseProject"]).id,
                examineeId: this.$route.query.examineeId,
                assessJobId: this.$route.query.assessJobId,
            });
            if (response.code === 200) {
                this.currentTableData = response.data;
                this.activeName = String(response.data.list[0].visitId);

              // 获取访视列表
              this._getVisitListByExamineeId();
                this.getVisitOtherDetailList({
                    examineeId: this.$route.query.examineeId,
                    visitId: response.data.list[0].visitId,
                    visitFile: "2",
                });
                if (response.data.status === "1") {
                    this.conclusion = response.data.globalIrNo;
                    this.assessOpinions = response.data.assessOpinions;
                    this.isShow = response.data.status === "1";
                }else if(response.data.status === "0"||response.data.status === "2"){
                  this.postAssessmenting();
                }
            }
        },
        // 既往心脏毒性独立评估报告小结】
        async getQueryNotCurrentVisit() {
            const response = await queryNotCurrentVisit({
                projectId: JSON.parse(localStorage["chooseProject"]).id,
                examineeId: this.$route.query.examineeId,
                assessJobId: this.$route.query.assessJobId,
            });
            if (response.code === 200) {
                this.pastTableData = response.data;
            }
        },
        // 文件列表切换tab
        handleClick(v) {
            this.getVisitOtherDetailList({
                examineeId: this.$route.query.examineeId,
                visitId: v.name,
                visitFile: "2",
            });
        },
        showSignDialog() {
            if (!this.conclusion) {
                this.$message.error("请评估者选择同意的评估结论");
                return;
            }
            this.dialogVisible2 = true;
        },
        async submitSignForm() {
            const response = await autograph(this.signForm);
            if (response.code === 200) {
                await this.submit();
                this.$message.success(response.msg);
                this.dialogVisible2 = false;
                this.isShow = true;
            }
        },
        async submit() {
            const conclusion =
                this.conclusion === "1"
                    ? {
                          cardiotoxicityAssessJobIndependentResultId:
                              this.currentTableData.list[0].assessJobId,
                          irNo: this.currentTableData.list[0].irNo,
                      }
                    : {
                          cardiotoxicityAssessJobIndependentResultId:
                              this.currentTableData.list[0].assessJobId2,
                          irNo: this.currentTableData.list[0].irNo2,
                      };
            const response = await submitCardiotoxicityArbitration({
                ...conclusion,
                assessJobId: this.$route.query.assessJobId, //评估任务id
                standard: this.$route.query.standardList, //评估标准
                assessOpinions: this.assessOpinions,
            });
            if (response.code === 200) {
                this.queryCurrentVisit();
            }
        },
        // 获取访视列表
        _getVisitListByExamineeId() {
            visitList({
                examineeId: Number(this.$route.query.examineeId),
                projectId: JSON.parse(localStorage["chooseProject"]).id,
            }).then((res) => {
              for(var i=0;i<res.rows.length;i++){
                if(this.currentTableData.list[0].visitId===res.rows[i].id){
                  this.visitList =  res.rows.slice(0,i+1)
                  break;
                }
              }
                if (this.visitList.length > 0) {
                    //PDF文件列表-第一个
                    this.getVisitOtherDetailList({
                        examineeId: this.$route.query.examineeId,
                        visitId: this.visitList[0].id,
                        visitFile: "2",
                    });
                }
            });
        },
        //获取心脏毒性评估页面文件列表
        getVisitOtherDetailList(obj) {
            getVisitOtherDetailList(obj).then((res) => {
                this.tableData = res.data;
            });
        },
    },
};
</script>

<style>
.el-radio__input.is-disabled.is-checked .el-radio__inner{
    border-color: #323e52;
    background: #323e52;
}
.el-radio__input.is-disabled + span.el-radio__label{
    color: #323e52;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label{
    color: #323e52;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color: #323e52;
    border-color: #323e52;
}
.my-label {
    background: red;
}

.my-content {
    background: #fde2e2;
}

.sign-status {
    font-weight: bold;
    color: red;
    padding: 5px;
    border: 2px solid red;
}
</style>
