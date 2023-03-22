import request from '@/utils/request'

// 客户列表
export function listPost(params) {
    return request({
        url: '/customer/list',
        method: 'get',
        params
    })
}

// 新增客户
export function listAdd(data) {
    return request({
        url: '/customer/add',
        method: 'post',
        data: data
    })
}

// 项目列表导出
export function projectExport(data) {
    return request({
        url: '/project/export',
        method: 'post',
        data: data
    })
}

// 修改客户
export function updatePost(data) {
    return request({
        url: '/customer/edit',
        method: 'post',
        data: data
    })
}

// 项目客户状态
export function setCustomerStatus(data) {
    return request({
        url: '/customer/setCustomerStatus',
        method: 'put',
        params: data
    })
}