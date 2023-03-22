import request from '@/utils/request'

// 受试者列表
export function listPost(params) {
  return request({
    url: '/examinee/list',
    method: 'get',
    params
  })
}

// 新增受试者
export function addPost(data) {
  return request({
    url: '/examinee/add',
    method: 'post',
    data
  })
}

// 修改受试者状态
export function updateStatus(data) {
  return request({
    url: '/examinee/updateStatus',
    method: 'post',
    data
  })
}

// 根据受试者id获取详情
export function examineeDetails(id) {
  return request({
    url: `/examinee/${id}`,
    method: 'get'
  })
}

// 访视列表
export function listVisitAndPlanVisit(data) {
  return request({
    url: '/visit/listVisitAndPlanVisit',
    method: 'post',
    data
  })
}

// 访视详情DICOM文件列表
export function getVisitDicomList(params) {
  return request({
    url: `/file/dicom/getVisitDicomList`,
    method: 'get',
    params
  })
}

// 访视详情其他文件列表
export function getVisitOtherList(params) {
  return request({
    url: `/file/other/getVisitFileTypeList`,
    method: 'get',
    params
  })
}

// 根据访视id获取访视详情
export function visitDetails(id) {
  return request({
    url: `/visit/${id}`,
    method: 'get'
  })
}

// 重置访视
export function resetVisit(data) {
  return request({
    url: '/visit/resetVisit',
    method: 'post',
    data
  })
}

// 新增计划外访视
export function addOutsidePlan(data) {
  return request({
    url: '/visit/addOutsidePlan',
    method: 'post',
    data
  })
}

// 新增计划外访视
export function updateVisit(data) {
  return request({
    url: '/visit/update',
    method: 'put',
    data
  })
}

// 修改访视信息
export function updateCfg(data) {
  return request({
    url: '/visit/updateCfg',
    method: 'post',
    data
  })
}

// 访视dicom文件信息上传
export function batchInsertJsVisitFileDicom(data) {
  return request({
    url: '/file/dicom/batchInsertJsVisitFileDicom',
    method: 'post',
    data
  })
}

// 访视其它文件信息上传
export function batchInsertJsVisitFileOther(data) {
  return request({
    url: '/file/other/batchInsertJsVisitFileOther',
    method: 'post',
    data
  })
}

// 删除某检查方式DICOM文件
export function deleteVisitDicomByInspectionMethod(params) {
  return request({
    url: `/file/dicom/deleteVisitDicomByInspectionMethod`,
    method: 'get',
    params
  })
}

// 删除某类型其他文件
export function deleteVisitOtherByType(params) {
  return request({
    url: `/file/other/deleteVisitOtherByType`,
    method: 'get',
    params
  })
}

// 重置访视
export function visitAdd(data) {
  return request({
    url: '/visit/add',
    method: 'post',
    data
  })
}

// 修改受试者详情（配置的信息）
export function examineeUpdateCfg(data) {
  return request({
    url: '/examinee/updateCfg',
    method: 'post',
    data
  })
}

// 访视dicom文件信息上传
export function batchInsertJsVisitFileDicomFront(data) {
  return request({
    url: '/file/dicom/batchInsertJsVisitFileDicom',
    method: 'post',
    data
  })
}

// 访视dicom文件信息上传
export function batchInsertJsVisitFileOtherFront(data) {
  return request({
    url: '/file/other/batchInsertJsVisitFileOther',
    method: 'post',
    data
  })
}

// 访视完成提交
export function finishSubmit(data) {
  return request({
    url: '/visit/finishSubmit',
    method: 'post',
    data
  })
}

// 批量校验访视下dicom文件MD5是否已存在
export function batchCheckJsVisitFileDicom(data) {
  return request({
    url: '/file/dicom/batchCheckJsVisitFileDicom',
    method: 'post',
    data
  })
}

// 批量校验访视下其他文件MD5是否已存在
export function batchCheckJsVisitFileOther(data) {
  return request({
    url: '/file/other/batchCheckJsVisitFileOther',
    method: 'post',
    data
  })
}

// 上传详情Dicom列表
export function dicomStudyList(params) {
  return request({
    url: `/file/dicomStudy/list`,
    method: 'get',
    params
  })
}
