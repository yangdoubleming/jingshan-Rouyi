<template>
  <div>
    <!-- 访视信息配置 -->
    <VisitInfoConfig :activeName="activeName" />
    <!-- 访视计划配置 -->
    <VisitPlanConfig :activeName="activeName" />
    <!-- 上传需求配置 -->
    <UploadRequirementConfig :activeName="activeName" />
    <!-- 数据描述配置 -->
    <DataDescConfig :activeName="activeName"  />
    <!-- 数据描述逻辑配置 -->
    <!-- <DataDescLogicConfig /> -->
  </div>
</template>

<script>
import VisitInfoConfig from './components/VisitInfoConfig'
import VisitPlanConfig from './components/VisitPlanConfig'
import UploadRequirementConfig from './components/UploadRequirementConfig'
import DataDescConfig from './components/DataDescConfig'
// import DataDescLogicConfig from './components/DataDescLogicConfig'
export default {
  components: {
    VisitInfoConfig,
    VisitPlanConfig,
    UploadRequirementConfig,
    DataDescConfig,
    // DataDescLogicConfig
  },
  props: ['activeName']
}
</script>

<style scoped>

</style>
