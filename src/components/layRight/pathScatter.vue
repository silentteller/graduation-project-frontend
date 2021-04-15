<template>
  <!-- <div class="BaseChart">
    <el-scrollbar style="height: 100%">
      <div class="BaseChart" ref="chart"></div>
    </el-scrollbar>
  </div> -->
  <div style="width: 100%; height: 100%; position: relative">
    <div
      id="pathScatterChart"
      style="width: 100%; height: 100%; z-index: 99; position: absolute"
    ></div>
    <div style="z-index: 999; float: left; position: absolute">
      <div id="barScatter" style="height: 10%">
        <!-- <span>{{ result[0] }},{{ result[1] }}</span> -->
      </div>
    </div>
  </div>
  <!-- <div id="pathScatterChart"></div> -->
</template>

<script>
import echarts from "echarts";
import $ from "jquery";
export default {
  name: "hello",
  props: {
    // data: Array,
  },
  data() {
    return {
      //result: [0.1, 0.9],
      predict: [],
      data: [],
    };
  },
  mounted() {
    this.$Bus.$on("sendPathData", (data) => {
      this.data = data.data;
      this.predict = data.data.predict;
      this.drawLine();
      this.draw();
    });
  },
  methods: {
    draw() {
      const rectWidth = 50;
      const rectHeight = 20;
      const driftX = 50;
      const driftY = 10;
      let predict = JSON.parse(JSON.stringify(this.predict));
      var num_0 = 0,
        num_1 = 0;
      for (var i = 0; i < predict.length; ++i) {
        //console.log(predict[0]);
        if (predict[i][0] > 0.5) {
          num_0++;
        } else {
          num_1++;
        }
      }
      console.log(num_0, num_1);
      var result = [num_0 / (num_0 + num_1), num_1 / (num_0 + num_1)];
      var resultText = [num_0, num_1];
      // var result = [0.9, 0.1];
      // var resultText = [9, 1];
      var width = 150; //画布的宽度
      var height = 40; //画布的高度
      $("#barScatter").empty();
      //d3.select("svg").remove();
      var svg = d3
        .select("#barScatter") //选择文档中的body元素
        .append("svg") //添加一个svg元素
        .attr("width", width) //设定宽度
        .attr("height", height); //设定高度
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
        .data(resultText)
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
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("pathScatterChart"));
      let data = JSON.parse(JSON.stringify(this.data));
      console.log(data);
      //var data = this.data;
      var pData = [];
      for (var i = 0; i < data["array"].length; ++i) {
        var temp = [];
        temp.push(data["array"][i][0]);
        temp.push(data["array"][i][1]);
        temp.push(data["predict"][i][1]);
        pData.push(temp);
      }
      var option = null;
      option = {
        brush: {
          throttleType: "debounce",
          throttleDelay: 100,
          // inBrush: {
          //   opacity: 1,
          // },
        },
        grid: {
          width: 250,
          height: 250,
        },
        visualMap: {
          min: 0,
          max: 1,
          dimension: 2,
          orient: "vertical",
          right: 10,
          top: "center",
          text: ["1", "0"],
          calculable: true,
          inRange: {
            color: ["#F08080", "#00BFFF"],
          },
        },
        xAxis: {},
        yAxis: {},
        series: [
          {
            symbolSize: 5,
            data: pData,
            type: "scatter",
          },
        ],
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
      myChart.on("brushSelected", (params) => {
        var sellist = params.batch[0].selected[0].dataIndex;
        var selRuleData = [];
        var predictData = [];
        for (var i = 0; i < sellist.length; ++i) {
          selRuleData.push(data["rule"][sellist[i]]);
          predictData.push(data["predict"][sellist[i]]);
        }
        this.$Bus.$emit("sendSelPathData", {
          featureList: data["featureList"],
          selList: sellist,
          ruleData: selRuleData,
          predictData: predictData,
          fmin: data["fmin"],
          fmax: data["fmax"],
          featureImportant: data["featureImportant"],
          data: data["data"],
        });
      });
    },
  },
};
</script>

<style>
#pathScatterChart {
  width: 100%;
  height: 100%;
}
</style>