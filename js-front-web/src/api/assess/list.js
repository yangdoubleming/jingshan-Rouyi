import request from '@/utils/request'

// 查询评估任务列表
export function listJob(query) {
  return request({
    url: '/assess/job/list',
    method: 'get',
    params: query
  })
}

// 查询评估任务详细
export function getJob(id) {
  return request({
    url: '/assess/job/' + id,
    method: 'get'
  })
}

// 新增评估任务
export function addJob(data) {
  return request({
    url: '/assess/job',
    method: 'post',
    data: data
  })
}

// 修改评估任务
export function updateJob(data) {
  return request({
    url: '/assess/job',
    method: 'put',
    data: data
  })
}

// 删除评估任务
export function delJob(id) {
  return request({
    url: '/assess/job/' + id,
    method: 'delete'
  })
}

// 基线-独立评估病例报告(如果是已评估的，则是查看评估)
export function getIndependentFirstReport(params) {
  return request({
    url: `/assess/jobIndependent/getIndependentFirstReport`,
    method: 'get',
    params
  })
}

// 基线-独立评估报告提交
export function setIndependentFirstReport(data) {
  return request({
    url: '/assess/jobIndependent/setIndependentFirstReport',
    method: 'post',
    data
  })
}

