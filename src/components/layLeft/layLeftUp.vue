<template>
  <div id="menu">
    <span>data</span>
    <select v-model="selected">
      <option>titan</option>
      <option>german</option>
    </select>
    <p>
      <span>tn</span>
      <input v-model="treeNum" />
      <span>td</span>
      <input v-model="treeDeep" />
      <button type="button" @click="getData()">start</button>
    </p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    // data: Array,
    // pdpData: Array,
  },
  data() {
    return {
      selected: "",
      treeNum: "",
      treeDeep: "",
    };
  },
  mounted() {},
  methods: {
    getData() {
      this.$Bus.$emit("openLoad");
      axios
        .get(
          "http://127.0.0.1:8000/getData/" +
            "?name=" +
            this.selected +
            "&treeNum=" +
            this.treeNum +
            "&treeDeep=" +
            this.treeDeep
        )
        .then((resp) => {
          //整体数据
          //this.$emit("sendData", resp.data);
          this.$Bus.$emit("sendData", {
            data: resp.data.data,
            featureList: resp.data.featureList,
            featureImportance: resp.data.featureImportance,
            mdiFeatureImportance: resp.data.mdiFeatureImportance,
            featureListMin: resp.data.featureListMin,
            featureListMax: resp.data.featureListMax,
            auc: resp.data.auc,
            confusionMatrix: resp.data.confusionMatrix,
          });
          this.$Bus.$emit("closeLoad");
          //部分依赖的数据
          axios
            .get("http://127.0.0.1:8000/getFeature/")
            .then((resp) => {
              this.$Bus.$emit("sendPdpData", {
                data: resp.data,
                //data: JSON.parse(JSON.stringify(resp.data)),
              });
            })
            .catch((res) => {
              this.$Bus.$emit("closeLoad");
            });
          //特征重要度数据
        })
        .catch((res) => {
          this.$Bus.$emit("closeLoad");
        });
    },
  },
};
</script>

<style>
#menu {
  /* margin-top: 0px; */
  margin: 2px 2px 2px 2px;
}
select {
  width: 180px;
  height: 20px;
}
input {
  width: 80px;
  margin-left: 2px;
  margin-right: 2px;
}
</style>