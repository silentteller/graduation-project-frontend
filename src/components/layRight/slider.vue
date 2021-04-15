<template>
  <div class="BaseChart">
    <el-scrollbar style="height: 100%">
      <div class="BaseChart">
        <p>
          <div id="bar" style="height: 10%">
            <!-- <span>{{ result[0] }},{{ result[1] }}</span> -->
          </div>
            <button type="button" @click="getData()">rePredict</button>
        </p>
        <span v-for="(value, key, index) in featureList">
          <span>{{ value }}</span>
          <el-slider
            v-model="param[value]"
            :min="paramMin[value]"
            :max="paramMax[value]"
          >
          </el-slider>
        </span>
        <!-- <span>
          <span>sex</span>
          <el-slider v-model="sex" :min="this.sex_min" :max="this.sex_max">
          </el-slider>
        </span>
        <span>age</span>
        <el-slider v-model="age" :min="this.age_min" :max="this.age_max">
        </el-slider>
        <span>n_siblings_spouses</span>
        <el-slider
          v-model="n_siblings_spouses"
          :min="this.n_siblings_spouses_min"
          :max="this.n_siblings_spouses_max"
        >
        </el-slider>
        <span>parch</span>
        <el-slider v-model="parch" :min="this.parch_min" :max="this.parch_max">
        </el-slider>
        <span>fare</span>
        <el-slider v-model="fare" :min="this.fare_min" :max="this.fare_max">
        </el-slider>
        <span>class</span>
        <el-slider
          v-model="class_number"
          :min="this.class_number_min"
          :max="this.class_number_max"
        >
        </el-slider>
        <span>embark_town</span>
        <el-slider
          v-model="embark_town"
          :min="this.embark_town_min"
          :max="this.embark_town_max"
        >
        </el-slider>
        <span>alone</span>
        <el-slider v-model="alone" :min="this.alone_min" :max="this.alone_max">
        </el-slider> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
export default {
  data() {
    return {
      //sex	age	n_siblings_spouses	parch	fare	class	embark_town	alone
      fmin: [],
      fmax: [],
      data: [],
      featureList: [],
      result: [],
      param: {},
      paramMin: {},
      paramMax: {},
    };
  },
  mounted() {
    this.$Bus.$on("sendPathData", (data) => {
      this.featureList = data.data["featureList"];
      this.fmin = data.data["fmin"];
      this.fmax = data.data["fmax"];
      this.data = data.data["data"];
      this.result = data.result;
      let featureList = this.featureList;
      for (var i = 0; i < featureList.length; ++i) {
        this.paramMin[featureList[i]] = this.fmin[i];
        this.paramMax[featureList[i]] = this.fmax[i];
        this.$set(this.param, featureList[i], this.data[i]);
        //this.param[featureList[i]] = this.data[i];
      }
      this.draw();
    });
  },
  methods: {
    draw() {
      const rectWidth = 200;
      const rectHeight = 20;
      const driftX = 50;
      const driftY = 10;
      var width = 300; //画布的宽度
      var height = 40; //画布的高度
      $("#bar").empty();
      //d3.select("svg").remove();
      var svg = d3
        .select("#bar") //选择文档中的body元素
        .append("svg") //添加一个svg元素
        .attr("width", width) //设定宽度
        .attr("height", height); //设定高度
      var p0 = parseFloat(this.result[0]);
      var p1 = 1 - p0;
      var result = [p0.toFixed(2), p1.toFixed(2)];
      svg
        .append("g")
        .selectAll()
        .data(result)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          if (i == 0) return driftX;
          else return driftX + result[i - 1] * rectWidth;
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return rectWidth * d;
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d, i) {
          return i == 0 ? "#F08080" : "#00BFFF";
        });
      svg
        .append("g")
        .selectAll()
        .data(result)
        .enter()
        .append("text")
        .text(function (d) {
          return d;
        })
        .attr("x", function (d, i) {
          if (i == 0) return driftX / 2;
          else return driftX * 1.2 + rectWidth;
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return driftY + rectHeight / 2;
        })
        .attr("font-size", 10);
    },
    getData() {
      axios
        .get("http://127.0.0.1:8000/rePredict/", {
          //params参数必写 , 如果没有参数传{}也可以
          params: this.param,
        })
        .then((resp) => {
          this.result = resp.data["result"];
          this.$Bus.$emit("sendFixPathData", {
            //featureList: resp.data["featureList"],
            ruleData: resp.data["rule"],
            predictData: resp.data["predict"],
            data: resp.data["data"],
            //this.predictData = data.data.prediction;
            // this.base = data.data.bias;
            // this.contributions = data.data.contributions;
            // this.featureList = data.data.data;
            prediction: resp.data["prediction"],
            bias: resp.data["bias"],
            contributions: resp.data["contributions"],
            featureList: resp.data["data"],
          });
          this.draw();
        });
      //   let params = {
      //     username: "awq", //开始时间
      //     pwd: "1234566", //结束时间
      //     threshold: "75", //过滤
      //   };
      //   axios.post("http://127.0.0.1:8000/rePredict/", params).then((resp) => {
      //     console.log(resp);
      //   });
    },
  },
};
</script>