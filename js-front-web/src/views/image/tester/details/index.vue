<template>
  <div class="testDetails">
    <div style="display: flex">
      <div style="width: 70%">
        <el-card
          v-if="nowVisit.status !== '1'"
          class="box-card"
          shadow="always"
          style="margin: 30px auto; width: 96%"
        >
          <el-button type="success" @click="complete">完成提交</el-button>
          <el-button type="primary" @click="operate('reset')"
            >重置当前访视</el-button
          >

          <!-- 暂时隐藏
          <el-button type="primary" @click="operate('cancel')"
            >取消访视</el-button
          >
          <el-button type="primary" @click="operate('eot')">设置EOT</el-button>
          <el-button type="primary">确认入组</el-button>
          -->
        </el-card>
        <el-card
          class="box-card"
          shadow="always"
          style="margin: 30px auto; width: 96%"
        >
          <div slot="header" class="clearfix">
            <span
              style="font-size: 18px; font-weight: bold; padding-right: 30px"
              >{{ testNoName }}：{{ detailsInfo.no }}</span
            ><span
              style="font-size: 18px; font-weight: bold; padding-right: 30px"
            >
              访视：{{ visitDetailsInfo.name }}</span
            >
            <el-descriptions
              class="margin-top"
              title="受试者信息"
              :column="2"
              border
              style="margin: 30px auto; width: 96%"
            >
              <template slot="extra">
                <!-- 修改受试者信息 -->
                <examinee-dialog
                  :now-test-no="nowTestId"
                  :info="detailsInfo"
                  @refresh="getDetails"
                />
              </template>
              <el-descriptions-item>
                <template slot="label"> 中心编号 </template>
                {{ detailsInfo.centerNo }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 状态 </template>
                {{ changeTxt(detailsInfo.screenAssessmentStatus) }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> {{baselineDateName}} </template>
                {{ detailsInfo.baselineDate }}
              </el-descriptions-item>
              <el-descriptions-item
                v-for="item in detailsInfo.infos"
                :key="item.cfgId"
              >
                <template slot="label">
                  {{ item.cfgFieldNameCn }}
                </template>
                {{ item.value }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              class="margin-top"
              title="访视信息"
              :column="3"
              border
              style="margin: 30px auto; width: 96%"
            >
              <template slot="extra">
                <!-- 修改访视者信息 -->
                <visit-dialog
                  :id="nowVisit.id"
                  :is-can-update-info="visitDetailsInfo.isCanUpdateInfo"
                  :infos="visitDetailsInfo.infos"
                  @refresh="visitDetails"
                />
              </template>
              <el-descriptions-item>
                <template slot="label"> 计划访视日期 </template>
                {{ visitDetailsInfo.planVisitDate }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 状态 </template>
                {{ visitDetailsInfo.status == "1" ? "已完成" : "未完成" }}
              </el-descriptions-item>
              <el-descriptions-item
                v-for="item in visitDetailsInfo.infos"
                :key="item.cfgId"
              >
                <template slot="label">
                  {{ item.cfgFieldNameCn }}
                </template>
                {{ item.value }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
        <el-card
          class="box-card"
          shadow="always"
          style="margin: 30px auto; width: 96%"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; font-weight: bold">上传需求</span>
            <el-table
              v-loading="loadingTableData"
              :data="tableData"
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column prop="typeMsg" label="类型" />
              <el-table-column prop="infoTypeList" label="信息" />
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="visitDetailsInfo.status !== '1'"
                    v-hasPermi="['dicom:batchUploadJsVisitFileOther']"
                    :disabled="!nowVisit.id"
                    size="mini"
                    type="text"
                    @click="changeVisitUpload(scope.row)"
                  >
                    上传
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card
          v-loading="loadingVisitOtherList"
          class="box-card"
          shadow="always"
          style="margin: 30px auto; width: 96%"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; font-weight: bold"
              >已上传文件列表</span
            >
            <el-table :data="otherList" style="width: 100%; margin-top: 20px">
              <el-table-column prop="type" label="文件类型">
                <template slot-scope="scope">
                  {{ dataStatusText[scope.row.type] }}
                </template>
              </el-table-column>
              <el-table-column prop="imageNum" label="文件数量" />
              <el-table-column prop="createTime" label="上传完成时间" />
              <el-table-column prop="createBy" label="上传人" />
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    slot="reference"
                    size="mini"
                    type="text"
                    style="display: inline-block; padding-right: 10px"
                    @click="seePic(scope.row)"
                    >预览</el-button
                  >
                  <el-button
                    v-if="nowVisit.status !== '1'"
                    v-hasPermi="['dicom:deleteVisitOtherByType']"
                    size="mini"
                    type="text"
                    @click="handleDelete2(scope.row)"
                  >
                    删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card
          v-loading="loadingVisitDicomList"
          class="box-card"
          shadow="always"
          style="margin: 30px auto; width: 96%"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; font-weight: bold">DICOM文件</span>
            <el-table :data="dicomList" style="width: 100%; margin-top: 20px">
              <el-table-column prop="inspectionMethod" label="检查方式" />
              <el-table-column prop="inspectionTime" label="检查时间" />
              <el-table-column prop="imageNum" label="序列数/图像数">
                <template slot-scope="scope">
                  {{ `${scope.row.serialNumber}/${scope.row.imageNum} ` }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="seeDicom(scope.row)"
                    v-show="false"
                  >
                    预览</el-button
                  >&nbsp;&nbsp;
                  <el-button
                    v-if="
                      nowVisit.status !== '1' &&
                      scope.row.inspectionMethod !== 'DICOM解析中'
                    "
                    v-hasPermi="['dicom:deleteVisitDicomByInspectionMethod']"
                    size="mini"
                    type="text"
                    @click="handleDelete(scope.row)"
                  >
                    删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

      </div>
      <div v-loading="loadingVisitList" style="width: 30%">
        <el-card
          class="box-card"
          shadow="always"
          style="margin: 30px auto; width: 96%"
        >
          <div slot="header" class="clearfix">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
              "
            >
              <router-link to="/image/examinee">
                <el-button type="text"> 返回受试者列表 </el-button>
              </router-link>
              <el-select
                placeholder="请选择受试者"
                filterable
                :value="this.detailsInfo.no"
                @change="changeTester"
              >
                <el-option
                  v-for="item in testList"
                  :key="item.no"
                  :label="item.no"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
              "
            >
              <span style="font-size: 16px; font-weight: bold">访视列表</span>
              <el-button type="primary" @click="planOutOpen = true"
                >添加计划外访视</el-button
              >
            </div>
            <el-table
              ref="visitTable"
              :data="visitList"
              style="width: 100%; margin-top: 20px"
              highlight-current-row
              @current-change="changeVisit"
            >
              <el-table-column prop="name" label="访视名称">
                <template slot-scope="scope">
                  <el-button type="text">{{ scope.row.name }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                  <i
                    v-if="scope.row.status === '1'"
                    class="el-icon-success"
                    style="color: #13ce66"
                  />
                  <i v-else class="el-icon-error" style="color: #f56c6c" />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <i
                    class="el-icon-question"
                    v-if="scope.row.questionReplyStatus === 1"
                    style="color: red; cursor: pointer"
                    @click="openDia(scope.row)"
                  ></i>
                  <i
                    class="el-icon-question"
                    v-else-if="scope.row.questionReplyStatus === 2"
                    style="color: #999; cursor: pointer"
                    @click="openDia(scope.row)"
                  ></i>
                  <i
                    class="el-icon-question"
                    v-else-if="scope.row.questionReplyStatus === 3"
                    style="color: rgb(19, 206, 102); cursor: pointer"
                    @click="openDia(scope.row)"
                  ></i>
                  <span v-else>-</span>
                  <!-- <QueryDialog :sourceId="scope.row.id" :status="scope.row.status" sourceType="1"/> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 重置当前访视 -->
    <el-dialog
      :title="reasonTitle"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="受试者编号" prop="symptom">
          {{ detailsInfo.no }}
        </el-form-item>
        <el-form-item label="访视" prop="planNo">
          {{ visitDetailsInfo.name }}
        </el-form-item>
        <el-form-item :label="reason" prop="remark">
          <el-input v-model="delReason" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetFs">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增计划外访视 -->
    <el-dialog
      title="添加计划外访视"
      :visible.sync="planOutOpen"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="计划外访视名称" prop="fsName">
          <el-input v-model="fsName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="访视日期" prop="actualVisitDate">
          <el-date-picker
            v-model="actualVisitDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPlanOutOpen">确 定</el-button>
        <el-button @click="planOutOpen = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件以及文件夹 -->
    <el-dialog
      title="上传"
      :visible.sync="upload"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
      :before-close="handleClose"
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        "
      >
        <el-tabs
          v-model="activeName"
          type="card"
          :stretch="true"
          style="width: 100%"
          @tab-click="tabClick"
        >
          <el-tab-pane
            v-for="item in tableData"
            :key="item.id"
            :label="item.typeMsg"
            :name="item.type"
          >
            <FileUpload
              :ref="'fileUpload' + item.type"
              :examinee-id="nowTestId"
              :visit-id="nowVisit.id"
              :visit-file="item.type"
              :file-type="item.fileType"
              :centerId="$route.query.centerId"
              @closeDia="_closeDia"
              @getUploadData="_getUploadData"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-table
        :data="tableDataProcess"
        stripe
        style="width: 100%"
        header-align="center"
      >
        <el-table-column prop="type" label="类型" align="center" width="" />
        <el-table-column prop="num" label="有效文件数" align="center" width="" />
        <el-table-column prop="repeatNum" label="文件重复数" align="center" width="" />
        <el-table-column prop="successNum" label="上传成功数" align="center" width="" />
        <el-table-column prop="failNum" label="上传失败数" align="center" width="" />
        <el-table-column prop="process" label="进度" align="center" width="300">
          <template slot-scope="scope">
            <el-progress
              :text-inside="true"
              :stroke-width="15"
              status="success"
              :percentage="scope.row.process > 100 ? 0 : scope.row.process"
            ></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="process" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.status == '取消上传'"
              type="text"
              @click="cancelUpload(scope.row)"
              >{{ scope.row.status }}</el-button
            >
            <el-button
              size="mini"
              v-else-if="scope.row.status == '等待上传'"
              type="text"
              style="color: #606266"
              >{{ scope.row.status }}</el-button
            >
            <el-button
              size="mini"
              type="text"
              v-else-if="scope.row.status == '上传终止，点击继续'"
              @click="goOnUpload(scope.row)"
              style="color: #f56c6c"
              >{{ scope.row.status }}<i class="el-icon-upload2"></i
            ></el-button>
            <el-button
              size="mini"
              v-else-if="scope.row.status == '上传完毕'"
              type="text"
              style="color: #13ce66"
              >{{ scope.row.status }} <i class="el-icon-circle-check"></i
            ></el-button>
            <el-button
              size="mini"
              v-else
              type="text"
              style="color: #606266"
            >{{ scope.row.status }} </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 图片、PDF显示 -->
    <el-dialog
      :title="titleItems"
      :visible.sync="showPicDia"
      width="60%"
      :close-on-click-modal="false"
      append-to-body
      :close-on-press-escape="showFileType != '2'"
      :fullscreen="showFileType == '2'"
    >
      <div class="show-block">
        <el-carousel
          :style="showFileType == '2' ? 'height:100%;' : 'height:520px;'"
          :autoplay="false"
          indicator-position="none"
          arrow="always"
          @change="changeItems"
        >
          <el-carousel-item v-for="item in nowPicItem" :key="item">
            <!--            <a v-show="showFileType == '2'" :href="item" target="_blank" class="blue-link">在新页面中，全屏预览</a>-->
            <div class="my-show-pic">
              <el-image
                v-if="showFileType == '1' || showFileType == '4'"
                :src="item"
                style="height: 500px"
                :preview-src-list="[item]"
                fit="scale-down"
              />

              <vpdf
                v-else-if="showFileType == '2' && useVpdfViewer"
                :src="item"
                style="height: 100%; width: 100%; overflow: hidden"
              />
              <MyPdf
                v-else-if="showFileType == '2'"
                :src="item"
                style="height: 100%; width: 100%; overflow: hidden"
              />

              <video
                v-if="showFileType == '3'"
                :src="item"
                controls
                style="height: 500px"
              />
              <!--              <embed v-else :src="item" style="height:100%;" >-->
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <!-- 质疑详情 -->
    <QuestionDetails
      :visible="detailsDialog"
      :visitId="visitIdDetail"
      @close="closeDia"
    />
  </div>
</template>

<script>
import {
  examineeDetails,
  listVisitAndPlanVisit,
  getVisitDicomList,
  getVisitOtherList,
  visitDetails,
  resetVisit,
  addOutsidePlan,
  listPost,
  visitAdd,
  deleteVisitDicomByInspectionMethod,
  deleteVisitOtherByType,
  finishSubmit,
} from "@/api/image/tester";
import { getVisitUploadCfgList } from "@/api/project/list";
import { getAliasCfgList } from "@/api/project/setting";
import { getRouters } from "@/api/menu";
import FileUpload from "@/views/components/FileUpload/upload";
import MyPdf from "@/views/components/pdf";
import vpdf from "@/views/components/pdf/vpdf";
import VisitDialog from "./components/VisitDialog.vue";
import ExamineeDialog from "./components/ExamineeDialog.vue";
import { testerStatus } from "@/utils/dict/mine";
import QueryDialog from "@/views/components/QueryDialog";
import QuestionDetails from "@/views/components/QuestionDetails/index";
export default {
  components: {
    FileUpload,
    MyPdf,
    vpdf,
    VisitDialog,
    ExamineeDialog,
    QueryDialog,
    QuestionDetails,
  },
  data() {
    return {
      detailsDialog: false,
      visitIdDetail: "",
      // loading
      loadingVisitList: false,
      loadingVisitDicomList: false,
      loadingVisitOtherList: false,
      // 是否显示弹出层
      open: false,
      upload: false,
      showPicDia: false,
      activeName: "0",
      size: "",
      postList: [],
      nullArray: [],
      dataStatusText: {
        // 文件类型：1-图片、2-PDF、3-视频、4-其他
        0: 'DICOM',
        1: "图片",
        2: "PDF",
        3: "视频",
        4: "其他",
      },
      loadingTableData: false,
      tableData: [],
      // 表单参数
      form: {},
      // 弹出层标题
      title: "",
      detailsInfo: {},
      visitDetailsInfo: {},
      visitList: [],
      dicomList: [],
      otherList: [],
      nowVisit: {},
      delReason: "",
      operateType: "",
      reason: "",
      reasonTitle: "",
      fsName: "",
      actualVisitDate: "",
      planOutOpen: false,
      testList: [],
      nowTestId: this.$route.query.id,
      remark2: "",
      weight: "",
      actualVisitDate2: "",
      nowPicItem: [],
      nowDicomItem: [],
      showFileType: "",
      useVpdfViewer: this.$route.query.vpdf,
      titleItems: "",
      tableDataProcess: [
        {
          type: "DICOM",
          id: "5",
          num: 0,
          successNum:0,
          repeatNum:0,
          failNum:0,
          process: 0,
          status: "等待上传",
        },
        {
          type: "图片",
          id: "1",
          num: 0,
          successNum:0,
          repeatNum:0,
          failNum:0,
          process: 0,
          status: "等待上传",
        },
        {
          type: "PDF",
          id: "2",
          num: 0,
          successNum:0,
          repeatNum:0,
          failNum:0,
          process: 0,
          status: "等待上传",
        },
        {
          type: "视频",
          id: "3",
          num: 0,
          successNum:0,
          repeatNum:0,
          failNum:0,
          process: 0,
          status: "等待上传",
        },
      ],
      cacheItem: {},
      myInterval: "",
      fileTypeArray: {
        1: ["jpg", "png", "bmp"], //pic
        2: ["pdf"], //pdf
        3: ["mp4", "mov", "avi"], //video
        5: [], //dicom
      },
      testNoName: "",
      baselineDateName: "",
    };
  },
  watch: {
    '$route' (to, from) {
      // 路由发生变化页面刷新
      this.$router.go(0);
    }
  },
  created() {
    this.getData();
    // 获取受试者名称配置
    this._getAliasCfgList();
  },
  methods: {
    // 获取受试者名称配置
    async _getAliasCfgList() {
      const response = await getAliasCfgList({
        projectId: JSON.parse(localStorage["chooseProject"]).id,
      });
      if (response.code === 200) {
        this.testNoName = response.rows.find(
          (item) => item.sqlField == "no"
        ).nameCn;
        this.baselineDateName = response.rows.find(
          (item) => item.sqlField == "baselineDate"
        ).nameCn;
      }
    },
    // 取消上传
    cancelUpload(item) {
      let current = "fileUpload" + item.id;
      this.$refs[current][0].$emit("cancelUpload");
    },
    //继续上传
    goOnUpload(item) {
      let current = "fileUpload" + item.id;
      this.$refs[current][0].$emit("goOnUpload");
    },
    // 接收上传讯息
    _getUploadData(data) {
      this.tableDataProcess.forEach((item) => {
        if (item.id === data.id) {
          item.num = data.num;
          item.successNum = data.successNum;
          if(data.repeatNum || data.status=='等待上传'){
            item.repeatNum = data.repeatNum;
          }
          item.failNum = data.failNum;
          item.process = data.process;
          item.status = data.status;
        }
      });
    },
    // 切换上传
    tabClick(v) {},
    changeTxt(v) {
      let name = "";
      testerStatus.forEach((item) => {
        if (item.value == v) {
          name = item.name;
        }
      });
      return name;
    },
    //changeItems
    changeItems(v) {
      this.titleItems = `第${v + 1}个文件，共${this.nowPicItem.length}个文件`;
    },
    async getData() {
      this.getUploadRequiredInfos();
      this.getDetails();
      this.getList();
      await this.getListVisitAndPlanVisit();
    },
    seeDicom(item) {
      window.open("http://test.dicom.js.dowe.tech/");
    },
    seePic(item) {
      this.showFileType = item.type;
      this.nowPicItem = item.fileUrlList;
      this.titleItems = `第1个文件，共${this.nowPicItem.length}个文件`;
      this.showPicDia = true;
    },
    handleDelete(item) {
      this.$alert("确认要删除吗", "温馨提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          if (action === "confirm") {
            deleteVisitDicomByInspectionMethod({
              visitId: this.nowVisit.id,
              studyInstanceId: item.studyInstanceId,
            }).then((response) => {
              this.$message.success("删除成功");
              // 其它文件列表
              this.getVisitDicomList();
            });
          }
        },
      });
    },
    handleDelete2(item) {
      this.$alert("确认要删除吗", "温馨提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          if (action === "confirm") {
            deleteVisitOtherByType({
              visitId: this.nowVisit.id,
              type: item.type,
            }).then((response) => {
              this.$message.success("删除成功");
              // 其它文件列表
              this.getVisitOtherList();
            });
          }
        },
      });
    },
    // 关闭上传弹窗
    _closeDia() {
      // DICOM文件列表
      this.getVisitDicomList();
      // 其它文件列表
      this.getVisitOtherList();
      // 清除定时器
      clearInterval(this.myInterval);
    },
    // 上传类型
    changeVisitUpload(item) {
      this.activeName = item.type;
      this.upload = true;
      // 初始化

      this.tableDataProcess.forEach((ele) => {
        let current = "fileUpload" + ele.id;
        let curRef = this.$refs[current] ;
        if (curRef && curRef.length>0) {
          curRef[0].$emit("init");
        } else {
          console.warn("get object ref(%s) falure.%o",current,this.$refs);
        }
      });
      // 保持token不失效
      this.keepAlive();
    },
    // 后台接口
    getRouters() {
      getRouters().then((res) => {});
    },
    // 定时调后台接口
    keepAlive() {
      const _this = this;
      this.myInterval = setInterval(function () {
        _this.getRouters();
      }, 60000 * 3); // 3分钟一次
    },
    // 切换受试者
    changeTester(v) {
      this.nowTestId = v;
      this.$router.push({
        path: "/image/testerDetails",
        query: { id: v },
      });
    },
    /** 查询受试者列表 */
    getList() {
      listPost({
        pageNum: 1,
        pageSize: 1000,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
      }).then((response) => {
        this.testList = response.rows;
      });
    },
    // 新增计划外访视
    addPlanOutOpen() {
      if (!this.fsName) {
        return this.$message.warning(`请输入计划外访视名称`);
      }
      if (!this.actualVisitDate) {
        return this.$message.warning(`请输入访视日期`);
      }
      addOutsidePlan({
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        examineeId: this.nowTestId,
        name: this.fsName,
        actualVisitDate: this.actualVisitDate,
      }).then((response) => {
        this.$message.success(`添加成功`);
        this.getListVisitAndPlanVisit();
        this.planOutOpen = false;
      });
    },
    // 操作
    operate(type) {
      this.operateType = type;
      if (type === "reset") {
        this.reasonTitle = "重置当前访视";
        this.reason = "重置原因";
      }

      if (type === "cancel") {
        this.reasonTitle = "取消访视";
        this.reason = "取消访视原因";
      }

      if (type === "eot") {
        this.reasonTitle = "设置EOT";
        this.reason = "结束治疗原因";
      }

      this.open = true;
    },
    // 获取上传需求信息列表
    async getUploadRequiredInfos() {
      try {
        if (this.loadingTableData) return;
        this.loadingTableData = true;
        const response = await getVisitUploadCfgList({
          projectId: JSON.parse(localStorage["chooseProject"]).id,
          status: 0,
        });
        if (response.code === 200) {
          this.tableData = response.rows || [];
          if (this.tableData.length > 0) {
            this.activeName = this.tableData[0].type;
          }
          let _this = this;
          let saveId = [];
          for (let index = _this.tableData.length - 1; index >= 0; index--) {
            _this.tableDataProcess.filter((item) => {
              if (item.id == _this.tableData[index].type) {
                saveId.push(item);
              }
            });
          }
          this.tableData.forEach((item) => {
            item.fileType = this.fileTypeArray[item.type];
          });
          this.tableDataProcess = saveId;
        }
      } finally {
        this.loadingTableData = false;
      }
    },
    // 重置当前访视
    resetFs() {
      if (!this.delReason) {
        return this.$message.warning(`请输入${this.reason}`);
      }

      if (!this.nowVisit.id) {
        return this.$message.warning(`请选择一个访视`);
      }
      // 重置当前访视
      if (this.operateType === "reset") {
        resetVisit({
          visitId: this.nowVisit.id,
          delReason: this.delReason,
        }).then((response) => {
          if (response.code === 200) {
            this.open = false;
            this.$message.success("重置成功");
            this.delReason = "";
            this.visitDetails();
            this.getVisitDicomList();
            this.getVisitOtherList();
          }
        });
      }
      // 取消访视
      if (this.operateType === "cancel") {
        // resetVisit({ visitId: this.nowVisit.id, delReason: this.delReason }).then((response) => {
        //   this.visitDetailsInfo = response.data
        // });
      }
      // 重置当前设置EOT访视
      if (this.operateType === "eot") {
        // resetVisit({ visitId: this.nowVisit.id, delReason: this.delReason }).then((response) => {
        //   this.visitDetailsInfo = response.data
        // });
      }
    },
    // 点击切换访视
    changeVisit(item) {
      this.nowVisit = item || this.nowVisit;
      // 访视详情
      if (!this.nowVisit.id) {
        visitAdd({
          projectId: JSON.parse(localStorage["chooseProject"]).id,
          planId: this.nowVisit.planId,
          examineeId: this.nowTestId,
        }).then((response) => {
          this.nowVisit.id = response.data;
          this.visitDetails();
          // DICOM文件列表
          this.getVisitDicomList();
          // 其它文件列表
          this.getVisitOtherList();
        });
      } else {
        this.visitDetails();
        // DICOM文件列表visitDetailsInfo
        this.getVisitDicomList();
        // 其它文件列表
        this.getVisitOtherList();
      }
    },
    // 根据访视id获取访视详情
    async visitDetails() {
      if (!this.nowVisit.id) {
        visitAdd({
          projectId: JSON.parse(localStorage["chooseProject"]).id,
          planId: this.nowVisit.planId,
          examineeId: this.nowTestId,
        }).then((response) => {
          this.nowVisit.id = response.data;
          visitDetails(this.nowVisit.id).then((res) => {
            this.visitDetailsInfo = res.data || {};
            this.actualVisitDate2 = this.visitDetailsInfo.actualVisitDate;
            this.weight = this.visitDetailsInfo.weight;
            this.remark2 = this.visitDetailsInfo.remark;
          });
        });
      }

      if (this.nowVisit.id) {
        const response = await visitDetails(this.nowVisit.id);
        if (response.code === 200) {
          this.visitDetailsInfo = response.data || {};
          this.actualVisitDate2 = this.visitDetailsInfo.actualVisitDate;
          this.weight = this.visitDetailsInfo.weight;
          this.remark2 = this.visitDetailsInfo.remark;
        }
      }
    },
    // 其它文件列表
    getVisitOtherList() {
      this.loadingVisitOtherList = true;
      getVisitOtherList({ visitId: this.nowVisit.id }).then((response) => {
        this.loadingVisitOtherList = false;
        this.otherList = response.data;
      });
    },
    // 访视详情DICOM文件列表
    getVisitDicomList() {
      this.loadingVisitDicomList = true;
      getVisitDicomList({ visitId: this.nowVisit.id }).then((response) => {
        this.dicomList = response.data;
        this.loadingVisitDicomList = false;
      });
    },
    // 获取访视列表
    async getListVisitAndPlanVisit(isComplete = false) {
      this.loadingVisitList = true;
      const response = await listVisitAndPlanVisit({
        examineeId: this.nowTestId,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
      });
      this.loadingVisitList = false;
      if (response.code === 200) {
        this.visitList = response.rows;
        this.$nextTick(() => {
          if (isComplete) {
            for (const item of response.rows) {
              if (item.id === this.nowVisit.id) {
                this.$refs["visitTable"].setCurrentRow(item);
                return;
              }
            }
          }
          const isPass = response.rows.every((item) => item.status === "1");
          if (isPass) {
            this.$refs["visitTable"].setCurrentRow(
              response.rows[response.rows.length - 1]
            );
            this.nowVisit = response.rows[response.rows.length - 1];
            return;
          }

          for (let i = 0; i < response.rows.length; i++) {
            const item = response.rows[i];
            if (item.status === "0") {
              this.cacheItem = { ...item };
              this.$refs["visitTable"].setCurrentRow(item);
              this.nowVisit = this.cacheItem;
              return;
            }
          }
        });
      }
    },
    /** 获取受试者信息 */
    getDetails() {
      this.loading = true;
      examineeDetails(this.nowTestId).then((response) => {
        this.detailsInfo = response.data;
        this.loading = false;
      });
    },
    complete() {
      this.$confirm(
        `中心编号：${this.detailsInfo.centerNo}，受试者编号：${this.detailsInfo.no}，访视：${this.visitDetailsInfo.name}`,
        "确认完成提交？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const response = await finishSubmit({
            visitId: this.nowVisit.id,
          });
          if (response.code === 200) {
            this.$message.success(response.msg);
            this.getListVisitAndPlanVisit(true);
          }
        })
        .catch(() => {});
    },
    handleClose(done) {
      if (
        this.tableDataProcess.filter(
          (item) => item.process != 100 && item.process > 0
        ).length > 0
      ) {
        this.$alert("还有文件正在上传，确定关闭吗", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action == "confirm") {
              // 取消所有文件上传
              this.cancelAllUpload();
            }
          },
        });
      } else {
        done();
        this._closeDia();
      }
    },
    // 取消所有文件上传
    cancelAllUpload() {
      this.tableDataProcess
        .filter((item) => item.process > 0)
        .forEach((item) => {
          this.cancelUpload(item);
        });
      this.upload = false;
    },
    // 关闭质疑弹窗
    closeDia() {
      this.visitIdDetail = "";
      this.detailsDialog = false;
    },
    openDia(row) {
      this.visitIdDetail = row.id;
      this.detailsDialog = true;
    },
  },
};
</script>
<style>
.show-block {
  position: relative;
  height: 100%;
}

.blue-link {
  font-size: 14px;
  color: #1890ff;
}

.my-show-pic {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  height: 100%;
}
.el-dialog__header {
  height: 30px;
}
.el-dialog__body {
  height: calc(100% - 30px);
}

/*预览模态框 body 区域高度设置 */
.el-carousel__container {
  height: 100%;
}
.el-carousel__item {
  width: 100%;
}
.el-carousel {
  width: 100%;
}
</style>
