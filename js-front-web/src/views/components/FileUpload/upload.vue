<template>
  <div class="upload-file">
    <div class="my-btn-box" :style="{ left: leftpx + 'px' }">
      <el-button
        v-show="leftpx !== 0 && fileList.length > 0"
        type="primary"
        @click="getAllFileMd5"
        >文件数 {{ fileList.length
        }}<span v-show="fileList.length > 0">，开始上传</span></el-button
      >
      <el-button v-show="leftpx !== 0 && fileList.length > 0" @click="endUpload"
        >取消</el-button
      >
      <el-button v-show="leftpx === 0" type="text" :loading="true">{{
        uploadTips
      }}</el-button>
    </div>
    <el-upload
      multiple
      :auto-upload="false"
      action="#"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :file-list="fileList"
      :data="dataObj"
      name="files"
      :on-change="uploadChange"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :show-file-list="false"
      class="upload-file-uploader"
      ref="fileUpload"
    >
      <div v-show="leftpx !== 0">
        <el-button icon="el-icon-plus" slot="trigger" @click="initFolder"
          >选取文件</el-button
        >
        <el-button icon="el-icon-plus" slot="trigger" @click="initFolder('folder')"
          >选取文件夹</el-button
        >
      </div>
    </el-upload>
  </div>
</template>

<script>
import { uploadMedia } from "@/utils/md5Batch";
import { formatDateForUpload } from "@/utils";
import md5 from "js-md5";
import OSS from "ali-oss";
import {
  batchInsertJsVisitFileOtherFront,
  batchInsertJsVisitFileDicomFront,
  batchCheckJsVisitFileDicom,
  batchCheckJsVisitFileOther,
} from "@/api/image/tester";

export const enumStepOfUpload = {
  //上传步骤，0,未上传;1,MD5文件20%;2.校验MD5去重5%;3.上传中70%;4.完成文件同步到后端5%
  NOT_START: {index:0,offset:0,val:0},
  MD5_FILE:  {index:1,offset:0,val:0.2},
  CHECK_FILE:{index:2,offset:20,val:0.05},
  UPLOADING: {index:3,offset:25,val:0.7},
  SYN_TO_BACKEND: {index:4,offset:95,val:0.05},
  MAX_NUM : {index:4,offset:100,val:1}
};

export const enumUpload = {
  UPLOAD_RETRY_COUNT : 5 ,//重试五次
  SYN_TO_BACKEND_PER_STUDY_NUM: 100,
};

export default {
  name: "FileUpload",
  props: {
    // 数量限制
    limit: {
      type: Number,
      default: 10000000,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5000000000,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => [],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    examineeId: { type: String },
    centerId: { type: String },
    visitId: { type: Number },
    visitFile: { type: String },
    uploadType: {
      type: String,
      default: "file",
    },
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      fileList: [],
      dataObj: {
        examineeId: this.examineeId,
        visitId: this.visitId,
        visitFiles: [],
      },
      fileTypeText: {
        1: "image",
        2: "pdf",
        3: "video",
        5: "dicom",
      },
      stepOfUpload:enumStepOfUpload.NOT_START,//上传步骤，0,未上传;1,MD5文件20%;2.校验MD5去重5%;3.上传中70%;4.完成文件同步到后端5%
      percentage: 0,
      uploadedCount: 0,
      checkpoint: null,
      client: null,
      filename: "",
      nowLength: 0,
      synedToBackendIndex:0 ,//synchronized
      cancel: false,
      btnName: "选取文件",
      leftpx: 268,
      myInterval: "",
      md5VisitFiles: [],
      nowMd5Index: 0,
      uploadTips: "文件正在上传中",
      // 重复的文件数
      repeatNum: 0,
      // 成功的文件数
      successNum: 0,
      // 失败的文件数
      failNum: 0,
      // 已上传的文件
      deletedFileList: [],
    };
  },
  watch: {
    visitId: {
      handler(nv) {
        this.dataObj.visitId = nv;
      },
      immediate: true,
      deep: true,
    },
    examineeId: {
      handler(nv) {
        this.dataObj.examineeId = nv;
      },
      immediate: true,
      deep: true,
    },
    visitFile: {
      handler(nv) {
        this.dataObj.visitFile = nv;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  created() {
    this.client = new OSS({
      region: process.env.VUE_APP_REGION,
      accessKeyId: process.env.VUE_APP_ACCESSKEYID,
      accessKeySecret: process.env.VUE_APP_ACCESSKEYSECRET,
      bucket: process.env.VUE_APP_BUCKET,
      secure: true,
    });
  },
  mounted() {
    this.$nextTick(function () {
      this.$on("init", function () {
        this.init();
      });
      this.$on("cancelUpload", function () {
        this.cancelUpload();
      });
      this.$on("goOnUpload", function () {
        this.goOnUpload();
      });
    });
  },
  methods: {
    // 文件上传-初始化数据
    initFolder(type) {
      this.nowLength = 0;
      this.synedToBackendIndex = 0;
      this.percentage = 0;
      this.stepOfUpload = enumStepOfUpload.NOT_START;
      this.uploadedCount = 0;
      // 给父表格传值
      this.$emit("getUploadData", {
        num: this.fileList.length,
        repeatNum: 0,
        successNum: 0,
        failNum: 0,
        process: 0,
        id: this.visitFile,
        status: "等待上传",
      });
      if(type && type=='folder'){
        this.$refs.fileUpload.$children[0].$refs.input.webkitdirectory = true;
      }else{
        this.$refs.fileUpload.$children[0].$refs.input.webkitdirectory = false;
      }
    },
    // 状态初始化
    init() {
      this.nowLength = 0;
      this.synedToBackendIndex = 0;
      this.percentage = 0;
      this.stepOfUpload = enumStepOfUpload.NOT_START;
      this.uploadedCount = 0;
      this.fileList = [];
    },
    // 监控上传文件列表
    uploadChange(file, fileList) {
      this.fileList = fileList;
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      if (!this.visitId) {
        this.$message.warning("请先选择一个访视");
        return false;
      }
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      // 校检文件类型
      if (this.fileType && this.fileType.length > 0) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$modal.msgError(
            `有文件类型不正确, 请上传${this.fileType.join("/")}格式文件!`
          );
          // 不支持的文件类型给提示，但是程序继续运行
          return true;
        }
      }
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传失败，请重试");
      this.$modal.closeLoading();
    },
    submitUpload() {
      // 开始上传
      this.stepOfUpload= enumStepOfUpload.UPLOADING;
      this.uploadTips = "文件正在上传中";
      this.beginUpload(this.fileList[0]);
    },
    // 获取文件MD5
    async getAllFileMd5() {
      if (this.fileList.length == 0 || this.cancel) {
        return;
      }
      this.stepOfUpload = enumStepOfUpload.MD5_FILE;
      this.percentage = this.stepOfUpload.offset+this.stepOfUpload.val*((this.nowMd5Index * 100) / this.fileList.length);
      this.uploadTips = "文件正在加载中"; //"文件正在上传中" ;
      this.$emit("getUploadData", {
        num: this.fileList.length,
        repeatNum: 0,
        successNum: 0,
        failNum: 0,
        process: Number(this.percentage.toFixed(2)),
        id: this.visitFile,
        status: "文件正在加载中",
      });
      this.leftpx = 0;
      let fileMd5 = await uploadMedia(this.fileList[this.nowMd5Index].raw);

      if (this.fileList[this.nowMd5Index].raw.webkitRelativePath
        && this.fileList[this.nowMd5Index].raw.webkitRelativePath.length > 0) {
        fileMd5 = md5(this.fileList[this.nowMd5Index].raw.webkitRelativePath+fileMd5);
      } else {
        fileMd5 = md5(this.fileList[this.nowMd5Index].name+fileMd5);
      }
      this.md5VisitFiles.push({ fileMd5: fileMd5 });
      this.fileList[this.nowMd5Index].fileMd5 = fileMd5;
      if (this.nowMd5Index == this.fileList.length - 1) {
        this.stepOfUpload = enumStepOfUpload.CHECK_FILE;
        this.percentage = this.stepOfUpload.offset ;
        this.$emit("getUploadData", {
          num: this.fileList.length,
          repeatNum: 0,
          successNum: 0,
          failNum: 0,
          process: Number(this.percentage.toFixed(2)),
          id: this.visitFile,
          status: "文件正在加载中",
        });
        // 已获取所有文件MD5, 校验文件MD5是否已存在
        this.checkAllFileMd5();
        this.nowMd5Index = 0;
        this.stepOfUpload= enumStepOfUpload.UPLOADING;
        this.percentage = this.stepOfUpload.offset ;
        this.$emit("getUploadData", {
          num: this.fileList.length,
          repeatNum: this.repeatNum,
          successNum: 0,
          failNum: 0,
          process: Number(this.percentage.toFixed(2)),
          id: this.visitFile,
          status: "文件正在加载中",
        });
      } else {
        this.nowMd5Index = this.nowMd5Index + 1;
        this.getAllFileMd5();
      }
    },
    async checkAllFileMd5() {
      // 校验文件MD5是否已存在
      let checkObj = "";
      if (this.visitFile == "5") {
        checkObj = batchCheckJsVisitFileDicom;
      } else {
        checkObj = batchCheckJsVisitFileOther;
      }
      this.uploadTips = "文件正在校验中"; //"文件正在上传中" ;
      this.stepOfUpload = enumStepOfUpload.CHECK_FILE;
      this.$emit("getUploadData", {
        num: this.fileList.length,
        repeatNum: this.repeatNum,
        successNum: 0,
        failNum: 0,
        process: Number(this.stepOfUpload.offset.toFixed(2)), //Number((this.nowMd5Index/this.fileList.length).toFixed(2)),
        id: this.visitFile,
        status: "文件正在加载中",
      });

      let fileNum = 0;
      await checkObj({
        examineeId: this.examineeId,
        visitId: this.visitId,
        visitFiles: this.md5VisitFiles,
      }).then((res) => {
        this.fileList.forEach((item) => {
          fileNum++;
          this.$emit("getUploadData", {
            num: this.fileList.length,
            repeatNum: this.repeatNum,
            successNum: 0,
            failNum: 0,
            process: Number(
              (this.stepOfUpload.offset+this.stepOfUpload.val*((fileNum * 100) / this.fileList.length)).toFixed(2)
            ),
            id: this.visitFile,
            status: "文件校验中",
          });
          res.data.forEach((ele) => {
            if (ele.fileMd5 == item.fileMd5) {
              item.fileStatus = ele.delFlag;
              item.fileUrl = ele.storageUrl;
            }
          });
        });

        this.stepOfUpload = enumStepOfUpload.UPLOADING ;
        this.$emit("getUploadData", {
          num: this.fileList.length,
          repeatNum: this.repeatNum,
          successNum: 0,
          failNum: 0,
          process: Number(this.stepOfUpload.offset.toFixed(2)),
          id: this.visitFile,
          status: "文件正在加载中",
        });
        console.log(111111,this.fileList[0])
        console.log(111111,this.fileList[0].fileStatus)
        //文件重复的个数
        this.repeatNum = this.fileList.filter(
          (x) => {
            // 查找是否有不支持的文件类型，如有，则列为重复文件，不上传oss
            if (this.fileType && this.fileType.length > 0) {
              this.fileType.some((type) => {
                if(x.raw && x.raw.name && x.raw.name.indexOf(type)===-1){
                  x.fileStatus = '0'
                }
              })
            }
            return x.fileStatus == "0"||x.fileStatus == "2"
          }
        ).length;
        // 已删除的数组
        this.deletedFileList =
          this.fileList.filter((x) => x.fileStatus == "2") || [];
        // 已删除的数组替换文件url
        if (this.deletedFileList.length > 0) {
          this.deletedFileList.forEach((y) => {
            let filename = y.name;
            if (
              y.raw.webkitRelativePath &&
              y.raw.webkitRelativePath.length > 0
            ) {
              filename = md5(
                new Date().getTime() + "_" + y.raw.webkitRelativePath
              );
            } else {
              filename = md5(new Date().getTime() + "_" + filename);
            }
            this.dataObj.visitFiles.push({
              fileUrl: y.fileUrl,
              fileMd5: y.fileMd5,
              fileName: filename,
            });
          });
        }
        // 实际需上传的文件数组
        this.fileList = this.fileList.filter(
          (x) => x.fileStatus != "0" && x.fileStatus != "2"
        );
        if (this.repeatNum > 0) {
          this.$message.warning(
            `重复文件或者不支持格式的文件数量共${this.repeatNum},实际此次上传${this.fileList.length}个文件`
          );
        }
        //将已经删除的文件先同步到服务器端
        if (this.dataObj.visitFiles.length>0) {
          this.uploadPartFileToBack() ;
        }

        // 开始上传
        this.submitUpload();
        this.md5VisitFiles = [];
      });
    },
    // 文件存放路径
    getFileStoreAddress(filename) {
      // 项目ID
      let projectId = JSON.parse(localStorage["chooseProject"]).id;
      // 中心ID
      let centerId = this.centerId;
      // 受试者ID
      let examineeId = this.examineeId;
      // 访视ID
      let visitId = this.visitId;
      // 存放地址
      let address = `s/${
        this.fileTypeText[this.visitFile]
      }/${projectId}/${centerId}/${examineeId}/${visitId}/${filename}`;
      return address;
    },
    // 单文件上传
    async ossUpload(filename, file) {
      this.stepOfUpload = enumStepOfUpload.UPLOADING ;//上传步骤，0,未上传;1,MD5文件20%;2.校验MD5去重5%;3.上传中70%;4.完成文件同步到后端5%
      this.uploadTips = "文件正在上传中，请耐心等待";
      let _this = this;
      // 断点续传
      //TODO:临时断点续传方案，重试5次，5次仍然失败就需从头全部重传
      _this.checkpoint = null; //TODO:暂时方案，未考虑持久化断点续传问题，后期开启关闭浏览器后断点续传

      // 重试五次。
      for (let retryCount = 0; retryCount < enumUpload.UPLOAD_RETRY_COUNT; retryCount++) {
        try {
          if (!this.cancel) {
            let key = this.getFileStoreAddress(filename);
            let result = await _this.client.multipartUpload(key, file.raw, {
              checkpoint: _this.checkpoint,
              progress: async function (percentage, checkpoint) {
                _this.percentage = _this.stepOfUpload.offset+_this.stepOfUpload.val*(((_this.uploadedCount + percentage) * 100) / _this.fileList.length);
                _this.checkpoint = checkpoint;
                _this.$emit("getUploadData", {
                  num: _this.fileList.length,
                  repeatNum: _this.repeatNum,
                  successNum: _this.nowLength,
                  failNum: _this.failNum,
                  process: Number(_this.percentage.toFixed(2)),
                  id: _this.visitFile,
                  status: "取消上传",
                });
              },
              partSize: 500 * 1024, //设置分片大小
              timeout: 120000, //设置超时时间
            });
            //计算进度条-成功个数
            //this.percentage = this.percentage + (100 / this.fileList.length)
            this.uploadedCount++;
            this.percentage = this.stepOfUpload.offset+this.stepOfUpload.val*((this.uploadedCount * 100) / this.fileList.length);
            // 获取文件的MD5值
            let len = result.name.split("/").length;
            this.dataObj.visitFiles.push({
              fileUrl: result.res.requestUrls[0].split("?")[0],
              fileMd5: this.file.fileMd5,
              fileName: result.name.split("/")[len - 1],
            });
            // 给父表格传值
            this.$emit("getUploadData", {
              num: this.fileList.length,
              repeatNum: this.repeatNum,
              successNum: this.nowLength,
              failNum: this.failNum,
              process: Number(this.percentage.toFixed(2)),
              id: this.visitFile,
              status: "取消上传",
            });
            break; // 跳出当前循环。
          }
        } catch (e) {
          //console.warn("upload file(%d/%d) to oss failure(%o), automatic retry to upload, ",
	  //           this.nowLength,this.fileList.length, e);
          console.log("upload file(%d/%d) to oss failure(%s), automatic retry to upload, ",
             this.nowLength,this.fileList.length, e.code);

          // 捕获取消上传
          if (this.cancel || (this.client && this.client.isCancel())) {
            this.$emit("getUploadData", {
              num: this.fileList.length,
              repeatNum: this.repeatNum,
              successNum: this.nowLength,
              failNum: this.failNum,
              process: Number(this.percentage.toFixed(2)),
              id: this.visitFile,
              status: "取消成功",
            });
            return;
          }
          // 捕获超时异常。
          if (e.code === "ConnectionTimeoutError") {
            if (retryCount < enumUpload.UPLOAD_RETRY_COUNT) {
              this.$emit("getUploadData", {
                num: this.fileList.length,
                repeatNum: this.repeatNum,
                successNum: this.nowLength,
                failNum: this.failNum,
                process: Number(this.percentage.toFixed(2)),
                id: this.visitFile,
                status: "网络异常，正在自动重试",
              });
            } else {
              //break 重试结束，
              this.$emit("getUploadData", {
                num: this.fileList.length,
                repeatNum: this.repeatNum,
                successNum: this.nowLength,
                failNum: this.failNum,
                process: Number(this.percentage.toFixed(2)),
                id: this.visitFile,
                status: "网络异常，稍后再试",
              });
            }
            //断网续传
          } else if (e.code === "RequestError") {
            // 暂停上传
            this.pauseUpload();
            this.$message.error("网络异常，上传暂停");
            this.$emit("getUploadData", {
              num: this.fileList.length,
              repeatNum: this.repeatNum,
              successNum: this.nowLength,
              failNum: this.failNum,
              process: Number(this.percentage.toFixed(2)),
              id: this.visitFile,
              status: "网络异常，稍后再试",
            });
          }
          //上传失败
          if(retryCount == enumUpload.UPLOAD_RETRY_COUNT-1){
            this.failNum++;
          }
        }// end of catch(e)
      }//end of for (let retryCount = 0; retryCount < retryCountMax; retryCount++) {
      this.nowLength = this.nowLength + 1;
      // 上传OSS完成
      if (this.nowLength == this.fileList.length) {
        // 批量传给后台
        this.uploadAllFileToBack();//全量重传一遍
      } else {
        if (this.dataObj.visitFiles.length>0
          && this.synedToBackendIndex+enumUpload.SYN_TO_BACKEND_PER_STUDY_NUM <= this.dataObj.visitFiles.length) {
          this.uploadPartFileToBack();
        }
        //未上传完，继续传下一个
        if (!this.cancel) {
          this.beginUpload(this.fileList[this.nowLength]);
        } else {
          this.nowLength = this.nowLength - 1;
        }
      }
    },
    // 批量传给后台
    async uploadPartFileToBack() {
      if (this.synedToBackendIndex>=this.dataObj.visitFiles.length) {
        return ;//已经全部同步过了
      }

      let uploadObj = "";
      if (this.visitFile == "5") {
        uploadObj = batchInsertJsVisitFileDicomFront;
      } else {
        uploadObj = batchInsertJsVisitFileOtherFront;
      }

      let tmpDataObj = {
        examineeId: this.dataObj.examineeId,
        visitId: this.dataObj.visitId,
        visitFile: this.dataObj.visitFile,
        visitFiles: this.dataObj.visitFiles.slice(this.synedToBackendIndex),
      }
      let synedNewIdx = this.dataObj.visitFiles.length ;
      uploadObj(tmpDataObj).then((res) => {
        this.synedToBackendIndex = synedNewIdx ;
      });
    },
    // 批量传给后台
    async uploadAllFileToBack() {
      // 全量上传URL至后台
      this.synedToBackendIndex = 0 ;//全量从头上传

      this.stepOfUpload= enumStepOfUpload.SYN_TO_BACKEND;
      let uploadObj = "";
      if (this.visitFile == "5") {
        uploadObj = batchInsertJsVisitFileDicomFront;
      } else {
        uploadObj = batchInsertJsVisitFileOtherFront;
      }
      this.uploadTips = "文件即将上传完成，正在校验中，请耐心等待";
      uploadObj(this.dataObj).then((res) => {
        // 还原状态
        this.reSetData();
      });
    },
    reSetData() {
      if (this.cancel) {
        this.cancel = false;
        this.$message.success("取消成功，部分已上传");
        // 给父表格传值
        this.$emit("getUploadData", {
          num: 0,
          repeatNum: 0,
          successNum: 0,
          failNum: 0,
          process: 0,//Number(this.percentage.toFixed(2)),
          id: this.visitFile,
          status: "取消成功",
        });
      } else {
        this.$message.success("上传成功");
        // 给父表格传值
        this.$emit("getUploadData", {
          num: this.fileList.length,
          repeatNum: this.repeatNum,
          successNum: this.fileList.length - this.failNum,
          failNum: this.failNum,
          process: 100,
          id: this.visitFile,
          status: "上传完毕",
        });
      }
      // 还原状态
      this.leftpx = 268;
      this.checkpoint = "";
      this.nowLength = 0;
      this.synedToBackendIndex = 0;
      this.nowMd5Index = 0
      this.dataObj.visitFiles = [];
      this.fileList = [];
      this.$emit("closeDia");
      this.percentage = 0;
      this.stepOfUpload = enumStepOfUpload.NOT_START;
      this.uploadedCount = 0;
      this.uploadTips = "文件正在准备中，请耐心等待";
    },
    // 取消选中文件
    endUpload() {
      this.init();
    },
    // 取消上传
    cancelUpload() {
      this.cancel = true;
      this.client.cancel();
      // 批量传给后台
      this.uploadAllFileToBack();
    },
    // 开始上传
    beginUpload(file) {
      if (file) {
        //有文件
        let filename = file.name;
        if (
          file.raw.webkitRelativePath &&
          file.raw.webkitRelativePath.length > 0
        ) {
          filename = md5(
            new Date().getTime() + "_" + file.raw.webkitRelativePath
          );
        } else {
          filename = md5(new Date().getTime() + "_" + filename);
        }

        this.filename = filename;
        this.file = file;
        if (this.handleBeforeUpload(file.raw) && !this.cancel) {
          this.leftpx = 0;
          this.ossUpload(filename, file);
        }
      } else {
        //没有可上传的文件
        // 批量传给后台
        this.uploadAllFileToBack();
      }
    },
    // 暂停上传
    pauseUpload() {
      this.client.cancel();
      this.cancel = true;
      this.keepAlive();
    },
    // 继续上传
    goOnUpload() {
      this.cancel = false;
      this.beginUpload(this.file);
      // 清除定时器
      clearInterval(this.myInterval);
    },
    // 定时调后台接口
    keepAlive() {
      const _this = this;
      this.myInterval = setInterval(function () {
        _this.goOnUpload();
      }, 10000); // 10秒钟一次
    },
  },
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
  margin: 30px 0;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}

.upload-file {
  position: relative;
}

.my-btn-box {
  position: absolute;
  top: -1px;
  left: 280px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.my-btn {
  width: 180px;
  height: 36px;
  border: 1px solid #323e52;
  display: inline-block;
  border-radius: 4px;
  line-height: 36px;
  margin-left: 15px;

  text-align: center;

  cursor: pointer;
}
</style>
