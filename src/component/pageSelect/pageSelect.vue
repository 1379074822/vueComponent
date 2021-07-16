<template>
  <el-select
    v-model="bindValue"
    :placeholder="placeholder"
    :clearable="true"
    refs="mySelect"
    :reserve-keyword="true"
    filterable
    v-on="$listeners"
    :filter-method="filter"
    @change="fun"
    @focus="funx"
    @blur="funb"
    @visible-change="hidden"
    :disabled="disabled"
  >
    <el-option
      v-for="item in optionfen"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      placeholder="请输入"
    >
    </el-option>
    <div style="bottom: -10px">
      <el-pagination
        small
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-size="pageSize"
        layout="prev,next,->,total"
        prev-text="上一页"
        next-text="下一页"
        :total="options.length"
      >
      </el-pagination>
    </div>
  </el-select>

</template>

<script>
  import PinyinMatch from 'pinyin-match';

  export default {
    name: "pageSelect",
    data() {
      return {
        options: [],  //总数据
        options1: [],  //搜索的数据
        optionfen: [],  //当前页码的数据
        // value1: "",  //输入框的值
        currentpage: 1,   //当前页码
        // pageSize: 6,   //每页展示的条数
        val: "",
      };
    },
    props: {
      //向父组件传递数据
      funName: {
        type: String,
        require: true,
      },

      label: {
        type: String,
        default: "label"
      },
      placeholder: {
        type: String,
        default: "请选择"
      },

      value: {
        type: String,
        default: "value"
      },
      bindValue: {
        type: [String, Number],
        require: true
      },
      disabled: {
        type: Boolean,
      },
      pageSize: {
        type: Number,
        default: 6
      },
      //接收返回值
      renderingAllKeys: {
        type: Array,
        require: true,
      },
    },
    computed: {},
    mounted() {
      console.log("pageselect show !!!")
      if (this.bindValue) {
        this.funx()
      }
    },

    methods: {
      //分页的实现,currentpage 为页码，每页展示的数据为10（可自行更改pageSize）条，分别是在总数据options中
      //下标从(currentpage -1)*10开始的十条数据
      handleCurrentChange(val) {
        this.optionfen = [];
        this.currentpage = val;
        let start = (val - 1) * this.pageSize;
        let end = Number(start) + Number(this.pageSize);
        //此处需要判断如果计算的结束下标大于总数据的长度，则需要修改结束下标
        if (end > this.options.length) {
          end = this.options.length;
        }
        for (let i = start; i < end; i++) {
          //将取到的数据展示在页面
          this.optionfen.push(this.options[i]);
        }
      },
      // clearFun() {
      //   this.$emit(`dealFunction`, {});
      // },
      //选择数据后将相关数据发送给父组件
      fun() {
        let arr = [];
        this.val = this.bindValue;
        console.log("check", this.val)
        for (let j in this.optionfen) {
          if (this.bindValue == this.optionfen[j].value) {
            arr.push(this.optionfen[j]);
          }
        }
        if(arr.length>0)
          this.$emit(`dealFunction`, arr[0]);
      },
      // 获得焦点
      //获得焦点的时候跳转到当前value所在的页码
      funx() {
        this.val = this.bindValue;
        var fir = null;
        let flag = false;
        if (this.bindValue) {
          for (let i = 0; i < this.renderingAllKeys.length; i++) {
            if (this.renderingAllKeys[i].value == this.bindValue) {
              fir = this.options[i];
              this.options.splice(i, 1);
            }
          }
          this.options.unshift(fir)
        }

        //如果没有就默认展示第一页
        if (!flag) {
          this.currentpage = 1;
          this.handleCurrentChange(1);
        }
      },
      // 失去焦点
      //前面每次操作都将输入框内的value值存储一份到val中，就是为了防止用户搜索的时候中途关闭选择框，这个时候输入框显示的就是
      //用户输入一半的value值，加上这层逻辑就可以在用户输入的数据在总数据中不存在的时候(也就是无效数据)，关闭选择框
      //之后让输入框依旧显示上一次的正确value值
      funb() {
        this.bindValue = this.val;

      },
      hidden(bool) {
        // 隐藏select列表
        if (!bool) {
          //关闭select下拉框的时候重置页码及数据,并移除事件监听
          this.optionfen = [];
          this.options = this.options1;
          let start = 0;
          let end = Number(start) + Number(this.pageSize);
          if (end > this.options1.length) {
            end = this.options1.length;
          }
          for (let i = start; i < end; i++) {
            this.optionfen.push(this.options1[i]);
          }
          // 移除mousedown事件监听
          removeEventListener("mousedown", function () {
          }, false);
        } else {
          // 打开select列表
          // 增加mousedown事件监听  当点击分页时移除输入框的默认事件 ，让他不会失去焦点（blur),如果不加，就会
          //出现当用户点击分页之后，输入框会失去焦点，这个时候如果用户需要输入数据进行搜索就需要删除输入框的值再输入，体验不好。
          //（elementUI下拉框的默认样式，当可搜索时点击输入框可直接输入，不需要删除上次数据）
          document.addEventListener(
            "mousedown",
            function (e) {
              // console.log(e)
              if (
                e.target.tagName === "LI" ||
                (e.target.tagName == "I" && e.target.localName == "i")
              ) {
                e.preventDefault();
              }
            },
            false
          );
          this.funx();
        }
      },
      //搜索方法,将符合的数据存入options中，并分页展示
      filter(val) {
        this.optionfen = [];
        // this.bindValue = val;
        let arr = [];
        let value = val.toLowerCase();
        for (let i in this.options1) {
          if (PinyinMatch.match(this.options1[i].label, value) || !value) {
            arr.push(this.options1[i]);
          }
          // if (this.options1[i].label.toLowerCase().indexOf(value) >= 0) {
          //
          // }
        }
        this.options = arr;
        this.handleCurrentChange(1);
      },
    },
    //监听来自父组件的数据，当数据更新时，重置展示
    watch: {
      bindValue: {
        handler() {
          this.funx()
        },
        deep: true,
        immediate: true
      },
      renderingAllKeys: {
        //深度监听，可监听到对象、数组的变化
        immediate: true,
        handler(newV) {
          if (this.renderingAllKeys.length > 0) {
            for (let i = 0; i < this.renderingAllKeys.length; i++) {
              var obj = this.renderingAllKeys[i];
              obj.label = obj[this.label];
              obj.value = obj[this.value];
            }
            this.options1 = this.renderingAllKeys;
            this.options = this.renderingAllKeys;
            this.optionfen = []
            this.currentpage = 1  //标记重置
            let start = (this.currentpage - 1) * this.pageSize
            let end = Number(start) + Number(this.pageSize)
            if (end > this.options1.length) {
              end = this.options1.length
            }


            for (let i = start; i < end; i++) {
              this.optionfen.push(this.options1[i])
            }
            // this.bindValue = this.renderingAllKeys[0].label;  //指标重置
            // this.val = this.renderingAllKeys[0].label;  //指标重置
            // this.fun()
          } else {
            this.options1 = []
            this.options = []
            this.optionfen = []
            this.bindValue = ""
          }
        },
        deep: false,
      },
    },
  };

</script>
