<template>
  <!-- <div class="BaseChart">
    <el-scrollbar style="height: 100%">
      <div class="BaseChart" ref="chart"></div>
    </el-scrollbar>
  </div> -->
  <div style="width: 100%; height: 100%; position: relative">
    <div
      ref="chart"
      style="width: 100%; height: 100%; position: relative z-index: 99; position: absolute"
    ></div>
    <div style="z-index: 999; float: left; position: absolute">
      <div id="barDataScatter" style="height: 10%">
        <!-- <span>{{ result[0] }},{{ result[1] }}</span> -->
      </div>
    </div>
  </div>
  <!-- <div
      id="pathScatterChart"
      style="width: 100%; height: 100%; z-index: 99; position: absolute"
    ></div> -->
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
      data: [],
      auc: 0,
      confusionMatrix: [],
    };
  },
  mounted() {
    //this.drawLine();
    this.$Bus.$on("sendData", (data) => {
      this.data = data.data;
      this.auc = data.auc;
      this.confusionMatrix = data.confusionMatrix;
      this.drawLine();
      this.draw();
    });
  },
  methods: {
    draw() {
      const rectWidth = 150;
      const rectHeight = 20;
      const driftX = 10;
      const driftY = 10;
      let matrix = JSON.parse(JSON.stringify(this.confusionMatrix));
      let auc = this.auc;
      console.log(auc);
      var result = [matrix[0][0], matrix[1][0], matrix[1][1], matrix[0][1]];
      var sum = 0;
      for (var i = 0; i < result.length; ++i) {
        sum += result[i];
      }
      var resultText = [0, 1];
      // var result = [0.9, 0.1];
      // var resultText = [9, 1];
      var width = 200; //画布的宽度
      var height = 50; //画布的高度
      $("#barDataScatter").empty();
      //d3.select("svg").remove();
      var start = driftX;
      var svg = d3
        .select("#barDataScatter") //选择文档中的body元素
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
          start += (d / sum) * rectWidth;
          return start - (d / sum) * rectWidth;
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return (rectWidth * d) / sum;
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("fill-opacity", function (d, i) {
          if (i % 2 == 0) {
            return 1;
          } else {
            return 0.5;
          }
        })
        .attr("fill", function (d, i) {
          return i < 2 ? "#F08080" : "#00BFFF";
        });
      svg
        .append("text")
        .text(function (d) {
          return "AUC: " + auc.toFixed(3);
        })
        .attr("x", function (d, i) {
          return driftX;
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return driftY + rectHeight + 10;
        })
        .attr("font-size", 10);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.chart);
      let data = JSON.parse(JSON.stringify(this.data));
      //var data = this.data;
      var siteData = [];
      for (var i = 0; i < data.length; ++i) {
        var temp = [];
        temp.push(data[i]["x"]);
        temp.push(data[i]["y"]);
        temp.push(data[i]["predict1"]);
        siteData.push(temp);
      }
      myChart.setOption({
        brush: {
          throttleType: "debounce",
          throttleDelay: 100,
          // inBrush: {
          //   opacity: 1,
          // },
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
        xAxis: {
          // min: -30,
          // max: 30,
          // interval: 20,
        },
        yAxis: {
          // min: -50,
          // max: 50,
          // interval: 20,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
            showDataShadow: false,
          },
          {
            type: "inside",
            orient: "vertical",
          },
          {
            type: "slider",
            orient: "vertical",
            showDataShadow: false,
          },
        ],
        series: [
          {
            symbolSize: 5,
            data: siteData,
            type: "scatter",
          },
        ],
      });
      myChart.on("brushSelected", (params) => {
        var sellist = params.batch[0].selected[0].dataIndex;
        var selData = [];
        for (var i = 0; i < sellist.length; ++i) {
          selData.push(data[sellist[i]]);
        }
        this.$Bus.$emit("sendSelData", {
          data: selData,
        });
      });
    },
  },
};
</script>