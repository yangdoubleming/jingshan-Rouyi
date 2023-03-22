<template>
    <div>
        <!-- 上传详情 -->
        <UploadData :visitId="visitId" :examineId="examineId" :buttonName="buttonName"/>
        <!-- 数据描述 -->
        <DataDesc :visitId="visitId" :examineId="examineId" :buttonName="buttonName"/>
    </div>
  </template>
  
  <script>
  
  
  import UploadData from "./components/Upload";
  import DataDesc from "./components/DataDesc";
  
  export default {
    props: ["visitId", "examineId", "buttonName"],
    components: {
      UploadData,
      DataDesc
    },
    data() {
      return {
        
      };
    },
    watch: {
      
    },
    mounted() {
    },
    methods: {
      
    },
  };
  </script>
  
  <style>
  .my-show-pic {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    height: 100%;
  }
  </style>