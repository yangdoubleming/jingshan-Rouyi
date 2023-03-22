import request from '@/utils/request'

// 评估任务管理列表
export function listPost(params) {
  return request({
    url: '/assess/job/taskList',
    method: 'get',
    params
  })
}

// 独立评估任务列表
export function listPostIndependent(params) {
  return request({
    url: '/assess/jobIndependent/list',
    method: 'get',
    params
  })
}

// 创建独立评估任务详情
export function getCreateAssessDetails(params) {
  return request({
    url: '/assess/jobIndependent/getCreateAssessDetails',
    method: 'get',
    params
  })
}

// 创建全局评估任务详情
export function getCreateAssessGlobalDetails(params) {
  return request({
    url: '/assess/jobGlobal/getCreateAssessGlobalDetails',
    method: 'get',
    params
  })
}

// 数据重传下的访视相关数据
export function getAssessDataFallbackDetails(params) {
  return request({
    url: '/assess/jobIndependent/getAssessDataFallbackDetails',
    method: 'get',
    params
  })
}

// 评估数据回传
export function setAssessDataFallback(data) {
  return request({
    url: '/assess/jobIndependent/setAssessDataFallback',
    method: 'post',
    data
  })
}

// 独立评估任务创建
export function assessJobIndependentAdd(data) {
  return request({
    url: '/assess/jobIndependent/add',
    method: 'post',
    data
  })
}

// 独立评估任务列表
export function listJobGlobalList(params) {
  return request({
    url: '/assess/jobGlobal/list',
    method: 'get',
    params
  })
}

// 仲裁评估任务列表
export function listJobArbitrateList(params) {
  return request({
    url: '/assess/jobArbitrate/list',
    method: 'get',
    params
  })
}

// 全局评估任务创建
export function assessJobGlobalAdd(data) {
  return request({
    url: '/assess/jobGlobal/add',
    method: 'post',
    data
  })
}

// 完成提交[基线期]
export function independentSubmit(data) {
  return request({
    url: '/cardiotoxicity/independent/submit',
    method: 'post',
    data
  })
}

// 签名
export function autograph(data) {
  return request({
    url: '/autograph',
    method: 'post',
    data
  })
}

// 独立评估任务id获取详情
export function jobIndependentInfo(assessJobId) {
  return request({
    url: `/assess/jobIndependent/${assessJobId}`,
    method: 'get'
  })
}

// 获取心脏毒性独立评估任务结果[基线期]详细信息
export function jobIndependentDetails(assessJobId) {
  return request({
    url: `/cardiotoxicity/independent/${assessJobId}`,
    method: 'get'
  })
}

// 独立评估任务id获取详情
export function getVisitOtherDetailList(data) {
  return request({
    url: `/file/other/getVisitOtherDetailList`,
    method: 'post',
    data
  })
}

// 当前访视心脏毒性独立评估报告小结
export function queryCurrentVisit(params) {
  return request({
    url: `/cardiotoxicity/arbitration/queryCurrentVisit`,
    method: 'get',
    params
  })
}

// 修改是否加急状态
export function setJsAssessJobIsUrgen(params) {
  return request({
    url: `/assess/job/setJsAssessJobIsUrgent`,
    method: 'put',
    params
  })
}

// 评估任务评估人修改
export function setAssessEvaluatorId(params) {
  return request({
    url: `/assess/job/setAssessEvaluatorId`,
    method: 'put',
    params
  })
}

// 评估关联访视评估人详情
export function getAssessExamineeVisitDetails(params) {
  return request({
    url: `/assess/job/getAssessExamineeVisitDetails`,
    method: 'get',
    params
  })
}

// 独立评估撤回
export function setAssessValid(params) {
  return request({
    url: `/assess/job/setAssessValid`,
    method: 'put',
    params
  })
}

// 根据受试者查访视集合
export function getVisitListByExamineeId(params) {
  return request({
    url: `/visit/getVisitListByExamineeId`,
    method: 'get',
    params
  })
}

// 根据受试者查访视集合
export function visitList(params) {
  return request({
    url: `/visit/list`,
    method: 'get',
    params
  })
}

// 既往心脏毒性独立评估报告小结
export function queryNotCurrentVisit(params) {
  return request({
    url: `/cardiotoxicity/arbitration/queryNotCurrentVisit`,
    method: 'get',
    params
  })
}

// 完成提交[裁定评估]
export function submitCardiotoxicityArbitration(data) {
  return request({
    url: `/cardiotoxicity/arbitration/submit`,
    method: 'post',
    data
  })
}

// 获取比对记录
export function queryVisitRecord(params) {
  return request({
    url: `/assess/jobArbitrate/queryVisitRecord`,
    method: 'get',
    params
  })
}

// 评估任务列表点击【评估】按钮，调此接口
export function assessmenting(data) {
  return request({
    url: `/assess/job/assessmenting`,
    method: 'post',
    data
  })
}

// 访视-独立评估病例报告
export function getIndependentReport(params) {
  return request({
    url: `/assess/jobIndependent/getIndependentReport`,
    method: 'get',
    params
  })
}

// 获取访视-病灶状态&病灶评估类型信息
export function getLesionAssessStatusList() {
  return request({
    url: `/assess/jobIndependent/getLesionAssessStatusList`,
    method: 'get'
  })
}

// 获取访视-疗效评估列表
export function getCurativeEffectStatusList() {
  return request({
    url: `/assess/jobIndependent/getCurativeEffectStatusList`,
    method: 'get'
  })
}
// 访视-独立评估报告提交
export function setIndependentReport(data) {
  return request({
    url: `/assess/jobIndependent/setIndependentReport`,
    method: 'post',
    data
  })
}

// 全局评估报告
export function getGlobalReport(params) {
  return request({
    url: `/assess/jobGlobal/getGlobalReport`,
    method: 'get',
    params
  })
}

// 全局报告提交
export function setGlobalReport(data) {
  return request({
    url: `/assess/jobGlobal/setGlobalReport`,
    method: 'post',
    data
  })
}

// 仲裁评估报告
export function getGlobalArbitrationReport(params) {
  return request({
    url: `/assess/jobArbitrate/getGlobalArbitrationReport`,
    method: 'get',
    params
  })
}

// 仲裁评估报告提交
export function setGlobalArbitrationReport(data) {
  return request({
    url: `/assess/jobArbitrate/setGlobalArbitrationReport`,
    method: 'post',
    data
  })
}
