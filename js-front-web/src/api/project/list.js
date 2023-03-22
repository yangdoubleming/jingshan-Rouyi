import request from '@/utils/request'

// 1.项目分页查询
export function listPost(params) {
  return request({
    url: '/project/list',
    method: 'get',
    params
  })
}

// 1.新增项目
export function listAdd(data) {
  return request({
    url: '/project',
    method: 'post',
    data: data
  })
}

// 1.新增客户
export function customerAdd(data) {
  return request({
    url: '/customer/add',
    method: 'post',
    data: data
  })
}

// 编辑项目
export function projectEdit(data) {
  return request({
    url: '/project/edit',
    method: 'post',
    data: data
  })
}

// 项目经理列表
export function getProjectManagerList(params) {
  return request({
    url: '/project/getProjectManagerList',
    method: 'get',
    params
  })
}

// 项目正式立项
export function setProjectInitiation(data) {
  return request({
    url: '/project/business/setProjectInitiation',
    method: 'post',
    data: data
  })
}

// 受试者信息配置列表
export function getExamineeCfgList(params) {
  return request({
    url: '/examinee/cfg/list',
    method: 'get',
    params
  })
}

// 受试者信息配置创建
export function addExamineeCfg(data) {
  return request({
    url: '/examinee/cfg/add',
    method: 'post',
    data
  })
}

// 受试者信息配置编辑
export function editExamineeCfg(data) {
  return request({
    url: `/examinee/cfg/edit`,
    method: 'post',
    data
  })
}

// 受试者信息配置状态禁/启用
export function setExamineeInfoCfgStatus(data) {
  return request({
    url: '/examinee/cfg/setExamineeInfoCfgStatus',
    method: 'post',
    data
  })
}

// 访视信息配置列表
export function getVisitInfoCfgList(params) {
  return request({
    url: '/visitInfo/cfg/list',
    method: 'get',
    params
  })
}

// 访视信息配置创建
export function addVisitInfoCfg(data) {
  return request({
    url: '/visitInfo/cfg/add',
    method: 'post',
    data
  })
}

// 访视信息配置编辑
export function editVisitInfoCfg(data) {
  return request({
    url: `/visitInfo/cfg/edit`,
    method: 'post',
    data
  })
}

// 访视信息配置状态禁/启用
export function setVisitInfoCfgStatus(params) {
  return request({
    url: '/visitInfo/cfg/setVisitInfoCfgStatus',
    method: 'get',
    params
  })
}

// 创建访视计划
export function addVisitPlan(data) {
  return request({
    url: `/visit/plan/add`,
    method: 'post',
    data
  })
}

// 编辑访视计划
export function editVisitPlan(data) {
  return request({
    url: `/visit/plan/edit`,
    method: 'post',
    data
  })
}

// 访视计划列表
export function getVisitPlanList(params) {
  return request({
    url: `/visit/plan/list`,
    method: 'get',
    params
  })
}

// 访视计划详情
export function getVisitPlanDetail(id) {
  return request({
    url: `/visit/plan/${id}`,
    method: 'get'
  })
}

// 上传需求列表
export function getVisitUploadCfgList(params) {
  return request({
    url: `/visit/cfg/list`,
    method: 'get',
    params
  })
}

// 上传需求列表
export function addVisitUploadCfg(data) {
  return request({
    url: `/visit/cfg/add`,
    method: 'post',
    data
  })
}

// 上传需求列表
export function editVisitUploadCfg(data) {
  return request({
    url: `/visit/cfg/edit`,
    method: 'post',
    data
  })
}

// 访视上传配置状态禁/启用
export function setVisitUploadCfgStatus(params) {
  return request({
    url: '/visit/cfg/setVisitUploadCfgStatus',
    method: 'put',
    params
  })
}

// 获取文件类型列表
export function getUpdateFileType() {
  return request({
    url: '/visit/cfg/getUpdateFileType',
    method: 'get',
  })
}

// 上传需求配置详情
export function getVisitCfgDetail(id) {
  return request({
    url: `/visit/cfg/${id}`,
    method: 'get'
  })
}


// 访视信息配置详情
export function visitInfo(params) {
  return request({
    url: `/visitInfo/cfg/${params.id}`,
    method: 'get',
    params
  })
}

// 受试者信息配置详情
export function examineeInfo(params) {
  return request({
    url: `/examinee/cfg/${params.id}`,
    method: 'get',
    params
  })
}

// 根据字段类型和文件类型，获取字段集合
export function getSourceTableFieldList(params) {
  return request({
    url: `/check/cfg/getSourceTableFieldList`,
    method: 'get',
    params
  })
}

// 一致性核查字段列表
export function getCheckCfgList(params) {
  return request({
    url: `/check/cfg/list`,
    method: 'get',
    params
  })
}

// 新增一致性核查字段
export function addCheckCfgList(data) {
  return request({
    url: `/check/cfg/add`,
    method: 'post',
    data
  })
}

// 修改一致性核查字段
export function editCheckCfgList(data) {
  return request({
    url: `/check/cfg/edit`,
    method: 'post',
    data
  })
}

// 一致性核查字段状态禁/启用
export function setCheckCfgStatus(data) {
  return request({
    url: `/check/cfg/setCheckCfgStatus`,
    method: 'post',
    data
  })
}
