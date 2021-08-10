
<template>


   <el-table
     v-bind="$attrs"
     v-on="$listeners"
     border
     @current-change="changeChoose"
   >
     <el-table-column  width="32" :resizable="resizable">
       <template slot-scope="scope">
         <el-radio v-model="checkValue" :label="scope.row[radioKey]">
           {{""}}
         </el-radio>
       </template>
     </el-table-column>

    <slot></slot>
   </el-table>

</template>

<script>
  export default {
    name: "radioTable",
    data() {
      return {
        options: [],  //总数据
        resizable:false
      };
    },
    props: {
      radioKey: {
        type:[Number,String],
        default:"id"
      },
      checkValue:{
        type:[Number,String,Object]
      }

    },
    computed:{

    },
    mounted() {

    },
    methods: {
      changeChoose(val){
        this.checkValue=val[this.radioKey]
        this.$emit("update:checkValue",this.checkValue)
      },
    },
    //监听来自父组件的数据，当数据更新时，重置展示
    watch: {}
  };

</script>
