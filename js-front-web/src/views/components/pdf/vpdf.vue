/***
   pdf viewer, based component vue-pdf
   J Song | jing_song@dowedu.com

//configuration information
props:
    src : string,the url of pdf file
    //zoombtn: ,enable/disable zoom feature
    //pageturnbtn: ,enable/disable the page-turn feature
events:
    loaded: (page),trigger this event when the loading one page of the pdf is complete.
    goto-page: (dst-pagenum,cur-pagenum), trigger this event before jumping to the new page.
***/
<template>
  <div class="pdf-all-container">
    <div class="tool-container">

      <el-button size="small" @click="prevPage" :disabled="curPageNum==1" icon="el-icon-arrow-left">上一页</el-button>
      <span class="pageNum">
          第<el-select v-model="curPageNum" @change="gotoPage" filterable placeholder="请选择页码"
                     style="width:60px;">
              <el-option v-for="i in pagesTotal" :key="i" :label="i" :value="i"/>
          </el-select>页
           / 共{{ pagesTotal }}页
        </span>
      <el-button size="small" @click="nextPage" :disabled="curPageNum==pagesTotal" icon="el-icon-arrow-right">下一页</el-button>

      <!-- :disabled="scalePercentage>0" -->
      <el-button size="small" @click="zoomIn()" icon="el-icon-zoom-in">放大</el-button>
      <el-select v-model="scaleText" @change="zoomPdf" style="width:80px;" placeholder="请选择放大缩小比例">
        <el-option key="20" label="20%" value="20"/>
        <el-option key="50" label="50%" value="50"/>
        <el-option key="70" label="70%" value="70"/>
        <el-option key="100" label="100%" value="100"/>
        <el-option key="150" label="150%" value="150"/>
        <el-option key="200" label="200%" value="200"/>
        <el-option key="300" label="300%" value="300"/>
        <el-option key="500" label="500%" value="500"/>
        <el-option key="1000" label="1000%" value="1000"/>
      </el-select>
      <el-button size="small" @click="zoomOut()" :disabled="scalePercentage<10" icon="el-icon-zoom-out">缩小</el-button>
      <el-button size="small" @click="scaleToOriginal()" icon="el-icon-d-caret" >原始尺寸</el-button>
      <el-button size="small" @click="fitToWidth()" icon="el-icon-d-caret" >适合宽度</el-button>
      <el-button size="small" @click="fitToHeight()" icon="el-icon-d-caret" >适合高度</el-button>
      <el-button size="small" @click="antiClockwise()" icon="el-icon-refresh-left">逆时针</el-button>
      <el-button size="small" @click="loadPdf(src)">刷新</el-button>



<!--      &lt;!&ndash;      <div class="page">&ndash;&gt;-->
<!--      &lt;!&ndash;        <span class="pageNum">{{ curPageNum }}/{{ pageCount }}</span>&ndash;&gt;-->
<!--      &lt;!&ndash; scaleSize=$event &ndash;&gt;

-->
<!--      <span v-show="loadedRatio > 0 && loadedRatio < 100"-->
<!--        style="float: right; color: #999; margin-right: 50px; display: inline-block"-->
<!--      >{{ loadedRatio }}%</span>-->
<!--      <span class="pageNum" style="z-index:9999;">{{ curPageNum }}/{{waitGotoPageNum}}/{{ pagesTotal }}</span>-->
<!--      <span class="pageNum" style="z-index:9999;">-->
<!--        cur:{{ scaleSize.width.toFixed(2) }}:{{ scaleSize.height.toFixed(2) }}-->
<!--        org:{{ pageOrgSize.width.toFixed(2) }}:{{ pageOrgSize.height.toFixed(2) }}-->
<!--      </span>-->
    </div>
<!--
        @num-pages="pagesTotal = $event"
        @page-loaded="curPageNum = $event"
        @link-clicked="curPageNum = $event"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded"

-->
    <div ref="pdfviewer" class="pdf-container">
      <div class="progress" v-show="loadedRatio > 0 && loadedRatio < 100">
        <el-progress :show-text="false" :stroke-width="2" color="#199edb" :percentage="loadedRatio"></el-progress>
      </div>
      <div ref="pdfwnd" v-loading="loading" v-infinite-scroll="handlePrelodePage" @scroll="onScrollPdf" class="pdf-viewer">
      <pdf
        ref="pdf"
        v-for="i in numLoadPages"
        :key="i"
        :src="srcTask"
        :page="i"
        :rotate="pageRotate"
        style="display: inline-block; width: 100%"
        @page-size="handlePagesize"
        @link-clicked="gotoPage"
        @error="handleError"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded"
      /></div>
      <el-empty v-if="loadError" :description="tipsMsgShow" />
    </div>
  </div>
</template>

<script>

import pdf from 'vue-pdf'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js';

export default {
  components: {
    pdf
  },
  name: 'vpdf',
  props: {
    src:{
      type: String,
      default:''
    }
  },
  data() {
    return {
      srcTask: void 0,
      waitGotoPageNum:0,
      waitGotoPageStart:0,
      curPageNum:0,
      pagesTotal: 0,
      numLoadPages: 0,
      pageRotate: 0,
      scalePercentage:100,
      scaleText:"100%",
      scaleSize:{width:0,height:0},
      pageOrgSize:{width:0,height:0},
      loading: false,
      loadError: false,
      loadedRatio: 0,
      tipsMsgShow:"",
      pageInterval:9.44//px,bottom:10+shadow:1
    }
  },
  watch: {
    src: {
      handler: function(val) {
        this.loadPdf(val) ;
      },
      immediate: true
    },
    scalePercentage: {
      handler: function(val) {
        this.scaleText = this.scalePercentage + "%"
      },
      immediate: true
    }
  },
  methods: {
    mounted() {
      console.log("mounted",this)
    },
    loadPdf(val) {
      console.log("load pdf",val)

      if (!val) {
        return
      }
      if (this.srcTask) {
        console.log("destory pre-task-object",this.srcTask)
        this.srcTask.destroy() ;
      }

      this.srcTask = pdf.createLoadingTask(val,CMapReaderFactory)
      this.srcTask.onProgress = (val => {
        let ratio = (val.loaded / val.total) * 100
        if (ratio >= 100) {
          ratio = 100
          this.loading = false
        }
        this.loadedRatio = ratio.toFixed(2)
      })
      this.srcTask.promise.then(pdf => {
          console.log("init pdf:",{ pdf })
          this.curPageNum= 1 ;
          this.pagesTotal = pdf.numPages ;
          this.numLoadPages = pdf.numPages > 4 ? 4 : pdf.numPages;
          this.$emit('loaded', pdf);

          pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            this.pageOrgSize.width = viewport.width ;
            this.pageOrgSize.height = viewport.height ;
            console.log("pdf org size w:h",this.pageOrgSize.width,this.pageOrgSize.height) ;
          })
        })
        .catch(err => {
          this.loadError = true
          console.log(err)
          this.handleError(err)
        })

      //this.$forceUpdate();
      console.log("load pdf success",this,this.$refs.pdf,this.srcTask);
    },
    handleError(err) {
      this.loadError = true
      console.log("handleError:",err);
      this.tipsMsgShow = "文件加载失败，请于刷新重试或与管理员联系";
    },
    //预加载pdf,每4页进行更新
    handlePrelodePage() {
      console.log("handlePrelodePage start:",this.curPageNum,this.numLoadPages,this.pagesTotal) ;

      if (this.numLoadPages >= this.pagesTotal) {
        return
      }
      this.numLoadPages = Math.min(this.numLoadPages + 4 , this.pagesTotal) ;
      console.log("handlePrelodePage end:",this.curPageNum,this.numLoadPages,this.pagesTotal)
    },
    //
    onScrollPdf() {

      let pageNum = 0 ;
      let midlinePos = this.$refs.pdfwnd.scrollTop+this.$refs.pdfwnd.offsetHeight*0.5 ;

      pageNum = (this.scaleSize.height>0)?Math.ceil(midlinePos/(this.scaleSize.height+this.pageInterval)):1;

      this.curPageNum = pageNum ;

      console.log("scroll (dst,cur,go):",pageNum,this.curPageNum,this.gotoPageNum,
        "scrollPos:",this.$refs.pdfwnd.scrollTop,"offsetHeight",this.$refs.pdfwnd.offsetHeight,
        "pageHeight:",Math.ceil(this.scaleSize.height)) ;
    },
    pageLoaded(page) {
      //this.curPageNum = (this.numLoadPages > 4)?(this.numLoadPages-4):1 ;
      if (this.waitGotoPageNum>this.waitGotoPageStart && page>=this.waitGotoPageNum) {

        this.loadedRatio = Math.round((page-this.waitGotoPageStart)*100/(this.waitGotoPageNum-this.waitGotoPageStart)) ;

        console.log("trigger goto-page event:",this.waitGotoPageNum,"at page:",page);
        if (page==this.waitGotoPageNum) {
          let wPageNum = this.waitGotoPageNum ;
          this.waitGotoPageNum = 0 ;
          this.waitGotoPageStart = 0 ;
          this.gotoPage(wPageNum) ;
          this.loadedRatio = 100 ;
        }
      }
      //console.log("pageLoaded:",page,"goto event:",this.waitGotoPageNum)
    },
    //  首页
    gotoPage(pageNum) {//scrollHeight
      console.log("goto page, pageNum:",pageNum,"curPage:",this.curPageNum)
      if (pageNum<2) {
        pageNum = 1 ;
      } else if (pageNum > this.pagesTotal) {
        pageNum = this.pagesTotal ;
      }
      if (pageNum<1){
        return ;
      }

      //TODO:need to waiting for preload pages.
      if (this.numLoadPages<=pageNum && this.numLoadPages<this.pagesTotal) {//send event for preload pages.

        //TODO:need to call asyn-loadPage first,then goto this page.
        //
        this.waitGotoPageNum = pageNum ;
        this.waitGotoPageStart = this.numLoadPages ;
        if (this.loadedRatio==100 && this.numLoadPages<pageNum) {
          this.loadedRatio = 0;//Math.round(100/(this.waitGotoPageNum-this.waitGotoPageStart)) ;
        }
        this.numLoadPages = Math.min(pageNum+4,this.pagesTotal) ;

        console.log("gotoPage:",pageNum,"from:",this.curPageNum," need load page:",this.numLoadPages)
        return ;
      }
      console.log("need gotoPage:",pageNum,"from:",this.curPageNum,"pos:",this.$refs.pdfwnd.scrollTop)

      let top = (pageNum-1)*Math.round(this.scaleSize.height+this.pageInterval) ;
      top = Math.max(top+this.pageInterval,0) ;//deduct this first interval -10
      this.$refs.pdfwnd.scrollTop = top ;

      this.curPageNum = pageNum ;

      console.log("gotoPage:",pageNum,"pos:",top,
        "pageHeight:",this.pageOrgSize.height,"/",this.scaleSize.height)
    },
    prevPage() {//prev screen
      if (this.curPageNum<2) {
        return ;
      }

      this.gotoPage(this.curPageNum-1) ;
/*
      let offsetHeight = (this.$refs.pdfwnd.offsetHeight>this.scaleSize.height)?this.scaleSize.height:this.$refs.pdfwnd.offsetHeight ;
      offsetHeight -= this.pageInterval ;//deduct this first interval -10

      this.curPageNum -- ;

      let scrollTop = Math.max(this.$refs.pdfwnd.scrollTop-offsetHeight,0) ;
      this.$refs.pdfwnd.scrollTop = scrollTop ;

      console.log("prev page:",this.curPageNum,"offset:",offsetHeight,"scrollPos",this.$refs.pdfwnd.scrollTop,this.scaleSize.height)
    */},
    nextPage() {//next screen
      if (this.curPageNum>=this.pagesTotal) {
        return ;
      }
      this.gotoPage(this.curPageNum+1) ;
      /*this.curPageNum ++ ;

      let offsetHeight = (this.$refs.pdfwnd.offsetHeight>this.scaleSize.height)?this.scaleSize.height:this.$refs.pdfwnd.offsetHeight ;
      offsetHeight -= this.pageInterval ; //deduct this first interval -10

      this.$refs.pdfwnd.scrollTop += offsetHeight ;

      console.log("prev page:",this.curPageNum,"offset:",offsetHeight,"scrollPos",this.$refs.pdfwnd.scrollTop,this.scaleSize.height)
    */},
    handlePagesize(w,h,scale) {
      this.scaleSize.width = w ;
      this.scaleSize.height= h ;
      this.scalePercentage = Math.ceil(scale*10)*10;

      /*
      if (this.waitGotoPageNum>this.waitGotoPageStart
        && this.loadedRatio!=100) {
        let curLoadPageNum = 0 ;
        if (this.waitGotoPageNum==curLoadPageNum) {
          let wPageNum = this.waitGotoPageNum ;
          this.waitGotoPageNum = 0 ;
          this.waitGotoPageStart = 0 ;
          this.gotoPage(wPageNum) ;
          this.loadedRatio = 100 ;
        } else {
          this.loadedRatio = Math.round((this.numLoadPages-this.waitGotoPageStart)*100/(this.waitGotoPageNum-this.waitGotoPageStart)) ;
        }
      }*/

      console.log("handlePagesize w,h,scale:",w,h,scale,this.scalePercentage,"%")
    },
    zoomPdf(scalePercentage) {
      scalePercentage = Math.ceil(scalePercentage/10)*10 ;

      if (scalePercentage<10) {
        scalePercentage = 10 ;
      }
      let size = {width:this.pageOrgSize.width, height:this.pageOrgSize.height};
      size.width = Math.ceil(size.width*scalePercentage/100) ;
      size.height= Math.ceil(size.height*scalePercentage/100) ;

      let cw = this.$refs.pdfviewer.clientWidth ;
      let left = (size.width<cw)?(cw-size.width):0 ;

      this.$refs.pdfwnd.style.left   = Math.floor(left/2) + "px" ;
      this.$refs.pdfwnd.style.width = size.width +"px";
      //this.$refs.pdfwnd.style.height = size.height +"px";

      this.scalePercentage = scalePercentage ;

      console.log("zoompdf w:h ",size.width,size.height," scale:",this.scalePercentage,"%")
    },
    //放大
    zoomIn() {
      if(this.scalePercentage >= 1000) return this.$message.warning('已经是最大喽~~')
      this.zoomPdf(this.scalePercentage+10);
    },
    //缩小
    zoomOut() {
      if(this.scale <= 20) return this.$message.warning('已经是最小喽~~')
      this.zoomPdf(this.scalePercentage-10);
    },
    // 原始大小
    scaleToOriginal() {//el-icon-c-scale-to-original
      this.zoomPdf(100);
    },
    fitToWidth() {
      if (this.pageOrgSize.width <= 0) {
        console.log("zoompdf failure, pageOrgSize.width=",this.pageOrgSize.width)
        return ;
      }
      this.zoomPdf(parseInt(this.$refs.pdfviewer.clientWidth*100/this.pageOrgSize.width)) ;

      console.log("zoompdf w: ",this.$refs.pdfviewer.clientWidth," scale:",this.scalePercentage,"%")
    },
    fitToHeight() {
      if (this.pageOrgSize.height <= 0) {
        console.log("zoompdf failure, pageOrgSize.height=",this.pageOrgSize.height)
        return ;
      }
      this.zoomPdf(parseInt(this.$refs.pdfviewer.clientHeight*100/this.pageOrgSize.height)) ;

      console.log("zoompdf h: ",this.$refs.pdfviewer.clientHeight," scale:",this.scalePercentage,"%")
    },
    // 逆时针
    antiClockwise() {
      this.pageRotate -= 90;
    },
  }
}
</script>

<style scoped>
.pdf-all-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: auto;
  position: relative;
}

.tool-container {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  height: 30px;
  //background: pink;
}

.pdf-container {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 40px;
  bottom: 0px;
  overflow: auto;
  padding: 10px 20px;
  border: 1px solid lightgrey;
  justify-content: center;
}
.pdf-viewer {
  position: absolute;
  left: 0px;
  right: 0;
  top: 0px;
  bottom: 0;
  overflow: auto;
  padding: 10px 20px;
  justify-content: center;
}

.progress {
  position: absolute;
  left: 0px;
  top:0px;
  height:50px;
  width: 100%;
}

.pdf-viewer > span {
  box-shadow: 0px 1px 6px #ddd;
  margin-bottom: 10px;
  border-radius: 7px;
}
</style>
