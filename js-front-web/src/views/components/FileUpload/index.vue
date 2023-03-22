<template>
  <div>
      <el-upload action="" :before-upload="() => { return false }" ref="ossUpload" v-model="fileList"
          :multiple="false" :limit="1" :on-change="handleFileChange" :auto-upload="false" list-type="picture-card">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
              <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                      <i class="el-icon-zoom-in"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                      <i class="el-icon-download"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                  </span>
              </span>
          </div>
      </el-upload>
      <el-dialog class="image-preview" :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
  </div>
</template>

<script>
import { put } from '@/utils/oss.js';

export default {
  model: {
      prop: 'fileList',
      event: 'updateFileList'
  },
  props:['savePath'],
  data() {
      return {
          dialogImageUrl: '',
          dialogVisible: false,
          disabled: false,
          fileList: [],
      };
  },
  computed: {

  },
  watch: {

  },
  methods: {
      async handleFileChange(file, fileList) {
          this.fileList = []
          this.fileList.push(file)
          let ossRes = await put(file)
          this.fileList[0].oss = ossRes
          this.$emit('updateFileList', this.fileList)
      },
      handleRemove(file) {
          this.$refs.ossUpload.clearFiles()
      },
      handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
      },
      //todo: 添加图片预览时，点击可以下载。
      handleDownload(file) {
          console.log(file);
      },
  },
  created() {

  }
};
</script>

<style scoped>
.image-preview {
    text-align: center;
    overflow: hidden;
}
</style>
