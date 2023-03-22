echo "确定是否重新安装环境? 重新安装会删除相关依赖, 确定的话请直接按回车,否则请直接退出"
@pause

:: 删除缓存
call yarn cache clean

:: 删除node_modules
call rd /s node_modules

:: 删除package-lock.json
call del yarn.lock
 
:: 重新安装
:: call yarn install

@pause