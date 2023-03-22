import request from '@/utils/request'

// 1.项目分页查询
export function listPost(params) {
    return request({
        url: '/center/getUserCenterJoins',
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

// 新增医院
export function hospitalAdd(data) {
    return request({
        url: '/hospital/add',
        method: 'post',
        data: data
    })
}

// 医院列表
export function hospitalList(params) {
    return request({
        url: '/hospital/list',
        method: 'get',
        params
    })
}

//创建中心
export function centerAddPost(data) {
    return request({
        url: '/center/add',
        method: 'post',
        data: data
    })
}

//移除中心
export function deleteCenterByIds(params) {
    return request({
        url: '/center/delCenterByIds',
        method: 'put',
        params
    })
}

//中心编辑
export function centerEditPost(data) {
    return request({
        url: '/center/edit',
        method: 'put',
        data
    })
}

// 中心列表
export function centerList(params) {
    return request({
        url: '/center/list',
        method: 'get',
        params
    })
}

// 中心用户状态(禁/启用)
export function setUserCenterStatus(params) {
    return request({
        url: '/center/setCenterStatus',
        method: 'put',
        params
    })
}
