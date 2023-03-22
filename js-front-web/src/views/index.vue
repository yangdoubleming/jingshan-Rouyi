<template>
  <div class="dashboard-editor-container">
    <div class="content">
        <div style="text-align:center">
          <h3>热烈欢迎您使用景杉智慧医疗平台</h3>
        </div>
    </div>
<!--    <div class="up-box">-->
<!--      <div class="content">-->
<!--        <div class="left">-->
<!--          <div class="up">-->
<!--            <div class="word">724</div>-->
<!--            <div class="num">已创建受试者总数</div>-->
<!--          </div>-->
<!--          <div class="down">-->
<!--            <div class="word">1724</div>-->
<!--            <div class="num">预估受试者总数</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="right">-->
<!--          <el-progress type="circle" :percentage="25" :width="100" :stroke-width="10" color="#909399"></el-progress>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="content">-->
<!--        <div class="left">-->
<!--          <div class="up">-->
<!--            <div class="word">2900</div>-->
<!--            <div class="num">已上传访视总数</div>-->
<!--          </div>-->
<!--          <div class="down">-->
<!--            <div class="word">7000</div>-->
<!--            <div class="num">预估访视总数</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="right">-->
<!--          <el-progress type="circle" :percentage="67" :width="100" :stroke-width="10"></el-progress>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="content">-->
<!--        <div class="left">-->
<!--          <div class="up">-->
<!--            <div class="word">50</div>-->
<!--            <div class="num">待审核总数</div>-->
<!--          </div>-->
<!--          <div class="down">-->
<!--            <div class="word">2000</div>-->
<!--            <div class="num">已审核总数</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="right">-->
<!--          <el-progress type="circle" :percentage="33" :width="100" :stroke-width="10" color="#67C23A"></el-progress>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="content">-->
<!--        <div class="left">-->
<!--          <div class="up">-->
<!--            <div class="word">200</div>-->
<!--            <div class="num">待关闭质疑总数</div>-->
<!--          </div>-->
<!--          <div class="down">-->
<!--            <div class="word">800</div>-->
<!--            <div class="num">已关闭质疑总数</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="right">-->
<!--          <el-progress type="circle" :percentage="26" :width="100" :stroke-width="10" color="#F56C6C"></el-progress>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <line-chart :chart-data="lineChartData" />-->
<!--    </el-row>-->

<!--    <el-row :gutter="32">-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <raddar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <pie-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <bar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
    }
  },
  mounted(){

  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .up-box{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .content{
      width:22%;
      height: 120px;
      border: 1px solid red;
      font-weight: 700;
      background: #fff;
      -webkit-box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
      box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
      border-color: rgba(0,0,0,.05);
      display: flex;
      align-items: center;
      justify-content: space-around;
      .down{
        margin-top: 10px;
      }
      .num{
        color: rgba(0,0,0,.45);
        font-size: 14px;
      }
      .word{
        font-size: 16px;
        color: #666;
      }
    }
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
