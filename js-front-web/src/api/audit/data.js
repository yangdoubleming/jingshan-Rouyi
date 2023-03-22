import request from '@/utils/request'

// 质控列表
export function getDataExamineList(params) {
  return request({
    url: '/dataExamine/list',
    method: 'get',
    params
  })
}

// 质疑详情
export function getVisitQuestionDetails(params) {
  return request({
    url: '/dataExamine/getVisitQuestionDetails',
    method: 'get',
    params
  })
}

// 获取质控状态列表
export function getExamineStatusList(params) {
  return request({
    url: '/dataExamine/getExamineStatusList',
    method: 'get',
    params
  })
}

// 获取质控详情
export function getExamineVisitDetails(params) {
  return request({
    url: '/dataExamine/getExamineVisitDetails',
    method: 'get',
    params
  })
}

// 获取质控详情
export function setExamineVisitStatus(data) {
  return request({
    url: '/dataExamine/setExamineVisitStatus',
    method: 'post',
    data
  })
}

// 访视详情其他文件列表
export function getVisitOtherListNew(params) {
  return request({
    url: '/file/other/getVisitOtherListNew',
    method: 'get',
    params
  })
}


// 根据质控获取图片列表
export function getVisitImageFiles(params) {
  return request({
    url: '/dataExamine/getVisitImageFiles',
    method: 'get',
    params
  })
}

// PDF文件列表
export function getVisitPdfFiles(params) {
  return request({
    url: '/dataExamine/getVisitPdfFiles',
    method: 'get',
    params
  })
}

// 视频文件列表
export function getVisitVideoFiles(params) {
  return request({
    url: '/dataExamine/getVisitVideoFiles',
    method: 'get',
    params
  })
}

// 删除图片
export function removeVisitImageFiles(params) {
  return request({
    url: '/dataExamine/removeVisitImageFiles',
    method: 'put',
    params
  })
}

// 删除PDF文件
export function removeVisitPdfFile(params) {
  return request({
    url: '/dataExamine/removeVisitPdfFile',
    method: 'put',
    params
  })
}

// 删除视频文件
export function removeVisitVideoFile(params) {
  return request({
    url: '/dataExamine/removeVisitVideoFile',
    method: 'put',
    params
  })
}

// 获取当前访视质控配置(传ProjectId)
export function dataManualAudit(params) {
  return request({
    url: '/dataExamine/dataManualAudit',
    method: 'get',
    params
  })
}

// 质控加急
export function dataExamineExpedited(params) {
  return request({
    url: '/dataExamine/dataExamineExpedited',
    method: 'put',
    params
  })
}

// 质控取消加急
export function dataExamineCancelExpedited(params) {
  return request({
    url: '/dataExamine/dataExamineCancelExpedited',
    method: 'put',
    params
  })
}

// DICOM-数据描述列表
export function getVisitDicomDataDescList(params) {
  return request({
    url: '/dataExamine/getVisitDicomDataDescList',
    method: 'get',
    params
  })
}

// DICOM-获取项目下数据描述动态配置字段（用于创建数据描述）
export function getDicomDescCfgByProjectId(params) {
  return request({
    url: '/dataExamine/getDicomDescCfgByProjectId',
    method: 'get',
    params
  })
}

// 上传详情DICOM-新增数据描述
export function dicomDescAdd(data) {
  return request({
    url: '/desc/add',
    method: 'post',
    data
  })
}

// 上传详情DICOM-获取数据描述详情
export function getVisitDicomDataDescById(params) {
  return request({
    url: '/dataExamine/getVisitDicomDataDescById',
    method: 'get',
    params
  })
}

// 上传详情DICOM-编辑数据描述
export function dicomDescEdit(data) {
  return request({
    url: '/desc/edit',
    method: 'post',
    data
  })
}

// 数据描述-删除dicom
export function dicomBatchRemove(data) {
  return request({
    url: '/desc/batchRemove',
    method: 'post',
    data
  })
}

// 上传详情-删除dicom
export function uploadDicomBatchRemove(data) {
  return request({
    url: '/file/dicomStudy/batchRemove',
    method: 'post',
    data
  })
}

// 质控审核通过或不通过
export function oneQualityControlAudit(data) {
  return request({
    url: '/dataExamine/oneQualityControlAudit',
    method: 'put',
    data
  })
}

// 获取质控记录
export function queryQualityControlRecord(params) {
  return request({
    url: '/dataExamine/queryQualityControlRecord',
    method: 'get',
    params
  })
}

// 更新访视日期（首次检查日期）
export function getUpdateActualVisitDate(data) {
  return request({
    url: '/visit/updateActualVisitDate',
    method: 'post',
    data
  })
}

// 质疑类型列表
export function getQuestionCategoryList(data) {
  return request({
    url: '/visitQuestion/questionCategoryList',
    method: 'get',
    data
  })
}

// 质疑详情
export function getQuestionDetail(params) {
  return request({
    url: '/visitQuestion/details',
    method: 'get',
    params
  })
}

// 质疑创建
export function addQuestion(data) {
  return request({
    url: '/visitQuestion/add',
    method: 'post',
    data
  })
}

// 质疑回复
export function addVisitAnswer(data) {
  return request({
    url: '/visitQuestion/addVisitAnswer',
    method: 'post',
    data
  })
}

// 质疑关闭开启
export function setVisitQuestionStatus(data) {
  return request({
    url: '/visitQuestion/setVisitQuestionStatus',
    method: 'post',
    data
  })
}

// 质疑列表
export function getQuestionList(params) {
  return request({
    url: '/visitQuestion/list',
    method: 'get',
    params
  })
}

// 质疑新增-批量
export function addQuestionBacth(data) {
  return request({
    url: '/visitQuestion/addBath',
    method: 'post',
    data
  })
}
