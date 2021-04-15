<template>
  <div class="BaseChart layLeftBottom">
    <el-scrollbar style="height: 100%; padding-bottom: 4px">
      <input v-model="id" />
      <button type="button" v-on:click="search()">search</button>
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(value, key, index) in data[0]">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in data" v-on:click="test(key, $event)">
            <td v-for="(value, key) in value">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
  </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
export default {
  data() {
    return {
      id: 0,
      data: [],
    };
  },
  mounted() {
    this.$Bus.$on("sendSelData", (data) => {
      this.data = data.data;
    });
  },
  methods: {
    test: function (key, event) {
      //点击选取的数据，发送索引号
      //console.log(this.data[key]["id"]);
      axios
        .get("http://127.0.0.1:8000/getPath/" + "?id=" + this.data[key]["id"])
        .then((resp) => {
          this.$Bus.$emit("sendPathData", {
            result: [this.data[key]["predict0"], this.data[key]["predict1"]],
            data: resp.data,
            //'prediction': prediction, 'bias': bias, 'contributions': contributions
          });
          // this.$Bus.$emit("sendExample", {
          //   data: this.data[key],
          // });
          // this.$Bus.$emit("sendPdpData", {
          //   data: resp.data,
          //   //data: JSON.parse(JSON.stringify(resp.data)),
          // });
        });
    },
    search() {
      let id = this.id;
      let data = this.data;
      for (var i = 0; i < data.length; ++i) {
        if (id == data[i]["id"]) {
          var temp = [];
          temp.push(data[i]);
          this.data = temp;
          break;
        }
      }
      console.log(this.data);
    },
  },
};
</script>
<style>
/* table tbody {
  display: block;
  height: 300px;
  width: 300px;
  overflow-y: scroll;
}
table thead {
  width: calc(100% - 1em);
}
table thead th {
  background: #ccc;
}
table tbody td {
  width: 100px;
  text-align: center;
  border-color: #ccc;
} */
.table {
  width: 100%;
  border-color: #ccc;
}
.table.tr {
  line-height: 30px;
  border-color: #ccc;
}
.table.th,
.table.td {
  text-align: center;
  border-color: #ccc;
}
table tr:nth-child(odd) {
  background: #ccc;
}
.layLeftBottom .el-scrollbar__wrap {
  overflow-x: auto !important;
}
</style>