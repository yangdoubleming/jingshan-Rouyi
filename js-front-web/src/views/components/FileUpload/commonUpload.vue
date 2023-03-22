<template>
  <div>
    <el-button type="primary" @click="showDialogUpload">上传</el-button>
    <el-dialog :visible.sync="dialogUpload" width="500px" :title="title" append-to-body style="text-align: center;overflow: hidden;">
      <el-upload action="#" ref="ossUpload" :auto-upload="false" :before-upload="handleBeforeUpload" multiple :before-close="handleClose"
        :limit="limit" :on-change="handleFileChange" :on-exceed="onExceed" list-type="picture-card">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
          </span>
        </div>
      </el-upload>
      <el-button type="primary" @click="submit" style="margin-top: 30px;width: 120px;">确认</el-button>
    </el-dialog>
    <el-dialog class="image-preview" :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { put } from '@/utils/oss.js';

export default {
  props: {
    title: {
      type: String,
      default: '请上传文件',
    },
    // 数量限制
    limit: {
      type: Number,
      default: 1,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5000,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      dialogUpload: false,
      disabled: false,
      fileList: [],
      realFileList: []
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      console.log(11333311,this.fileType)
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
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      return true;
    },
    submit(){
      this.$emit('updateFileList', this.fileList)
      this.handleClose()
    },
    showDialogUpload() {
      this.fileList = []
      this.dialogUpload = true
    },
    async handleFileChange(file, fileList) {
      let ossRes = await put(file)
      ossRes.uid = file.uid
      this.fileList.push(ossRes)
    },
    handleClose(){
      if(this.fileList.length>0){
        this.$refs.ossUpload.clearFiles()
      }
      this.dialogUpload = false
    },
    onExceed(){
      this.$message.error(`最多只能上传${this.limit}张`)
    },

    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid != file.uid)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
  created() {

  }
};
</script>

<style scoped>
.image-preview {}
</style>
