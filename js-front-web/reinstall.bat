echo "ȷ���Ƿ����°�װ����? ���°�װ��ɾ���������, ȷ���Ļ���ֱ�Ӱ��س�,������ֱ���˳�"
@pause

:: ɾ������
call npm cache clean --force

:: ɾ��node_modules
call rd rd /s /q node_modules

:: ɾ��package-lock.json
call del /f /s /q package-lock.json
 
:: ���°�װ
call npm install

@pause