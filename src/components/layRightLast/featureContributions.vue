<template>
  <!-- <div id="rectRuleChart"></div> -->
  <div class="BaseChart">
    <el-scrollbar style="height: 100%; padding-bottom: 4px">
      <div
        id="featureContributionsChart"
        ref="chart"
        @click="openDialog()"
      ></div>
    </el-scrollbar>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="90%">
      <div id="featureContributionsChart2" ref="chart2"></div>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import echarts from "echarts";
export default {
  name: "hello",
  props: {
    // data: Array,
  },
  data() {
    return {
      dialogVisible: false,
      predictData: [],
      fmin: [],
      fmax: [],
      featureList: [],
      featureImportant: [],
      data: [],
      base: [],
      contributions: [],
    };
  },
  mounted() {
    this.$Bus.$on("sendPathData", (data) => {
      //'prediction': prediction.tolist(), 'bias': bias.tolist(), 'contributions'
      this.predictData = data.data.prediction;
      this.base = data.data.bias;
      this.contributions = data.data.contributions;
      this.featureList = data.data.data;
      this.draw("featureContributionsChart", "chart");
    });
    this.$Bus.$on("sendFixPathData", (data) => {
      this.predictData = data.prediction;
      this.base = data.bias;
      this.contributions = data.contributions;
      this.featureList = data.data;
      this.draw("featureContributionsChart", "chart");
    });
    //this.draw();
    // this.$Bus.$on("sendSelPathData", (data) => {
    //   this.selList = data.selList;
    //   this.ruleData = data.ruleData;
    //   this.predictData = data.predictData;
    //   this.fmin = data.fmin;
    //   this.fmax = data.fmax;
    //   this.featureList = data.featureList;
    //   this.featureImportant = data.featureImportant;
    //   this.data = data.data;
    //   this.draw();
    // });
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.$nextTick((_) => {
        this.draw("featureContributionsChart2", "chart2");
      });
    },
    draw(id, ref) {
      let predictData = JSON.parse(JSON.stringify(this.predictData));
      let base = JSON.parse(JSON.stringify(this.base));
      let contributions = JSON.parse(JSON.stringify(this.contributions));
      let featureList = JSON.parse(JSON.stringify(this.featureList));
      // 基于准备好的dom，初始化echarts实例
      let width = 2000; //画布的宽度
      let height = this.$refs[ref].clientHeight - 10; //画布的高度
      //d3.select("svg").remove();
      //d3.select("svg").remove();
      $(`#${id}`).empty();
      var svg = d3
        .select(`#${id}`) //选择文档中的body元素
        .append("svg") //添加一个svg元素
        .attr("width", width) //设定宽度
        .attr("height", height); //设定高度
      //"#F08080", "#00BFFF"
      let leftTranslate = 500;
      let y = 40;
      let gap = 4;
      var xScale = d3.scale.linear().domain([0, 1]).range([0, 500]);
      var axis = d3.svg.axis().scale(xScale).orient("bottom");
      var gAxis = svg
        .append("g")
        .attr("height", 50)
        .attr("transform", "translate(" + leftTranslate + "," + y + ")");
      gAxis.attr("class", "axis");
      axis(gAxis);
      var predict = predictData[0][1].toFixed(2);
      var bias = base[0][1].toFixed(2);
      //特征值
      var feature = featureList;
      //var feature = [4, 15, 2, 3556, 5, 3, 3, 2, 29];
      //特征名
      //var list = ["aaaaa", "bbbbbbbbbbbbbbbb", "cc", "dd-ddddd", "ee-e"];
      var list = [
        "Account Balance",
        "Duration of Credit (month)",
        "Payment Status of Previous Credit",
        "Credit Amount",
        "Value Savings/Stocks",
        "Length of current employment",
        "Instalment per cent",
        "Duration in Current address",
        "Age (years)",
      ];
      //贡献值
      //var data = [0.35, 0.22, 0.15, 0.1, 0.05, -0.2, -0.1, -0.023, -0.003];
      var data = [];
      for (var i = 0; i < contributions[0].length; ++i) {
        data.push(contributions[0][i][1]);
      }
      var dataset1 = [
        [15, 10, 80, 85],
        [90, 85, 105, 110],
      ];
      var dataset2 = [
        [200, 205, 150, 145],
        [300, 305, 210, 205],
      ];

      var pos = [];
      var neg = [];
      // console.log(pos);
      // console.log(neg);
      for (var i = 0; i < data.length; ++i) {
        if (data[i] > 0) {
          pos.push([list[i], data[i], feature[i]]);
        } else {
          neg.push([list[i], data[i], feature[i]]);
        }
      }

      pos.sort(function (a, b) {
        return b[1] - a[1];
      });
      neg.sort(function (a, b) {
        return a[1] - b[1];
      });
      // 箭头数据标注顺序，对应左右两个
      // 2________3         3________2
      //  \       \         /       /
      //   \1      \4      /4      /1
      //   /       /       \       \
      //  /_______/         \_______\
      // 起点位置从predict开始计算，向两边开始计算。
      // 宽度就是2-3/1-4的距离，由贡献值映射
      //right
      var rightData = [];
      var leftData = [];
      var start = xScale(predict) + leftTranslate;
      var rightFlag = start;
      for (var i = 0; i < pos.length; ++i) {
        var w = xScale(pos[i][1]);
        rightData.push([
          rightFlag - w,
          rightFlag - gap - w,
          rightFlag - gap,
          rightFlag,
        ]);
        rightFlag = rightFlag - gap - w;
      }
      var leftFlag = start;
      for (var i = 0; i < neg.length; ++i) {
        var w = xScale(Math.abs(neg[i][1]));
        leftData.push([
          leftFlag + w,
          leftFlag + gap + w,
          leftFlag + gap,
          leftFlag,
        ]);
        leftFlag = leftFlag + gap + w;
      }
      var high = 20 + y;
      var low = 40 + y;
      var areaPath = d3.svg
        .area()
        .x(function (d, i) {
          return d;
        })
        .y0(function (d, i) {
          if (i == 0) {
            return (high + low) / 2;
          } else if (i == 1) {
            return low;
          } else if (i == 2) {
            return low;
          } else {
            return (high + low) / 2;
          }
        })
        .y1(function (d, i) {
          if (i == 0) {
            return (high + low) / 2;
          } else if (i == 1) {
            return high;
          } else if (i == 2) {
            return high;
          } else {
            return (high + low) / 2;
          }
        });
      for (var i = 0; i < rightData.length; ++i) {
        svg
          .append("g")
          .append("path")
          .attr("d", areaPath(rightData[i]))
          // .attr('stroke', 'black')
          // .attr('stroke-width', "1px")
          .attr("fill", "#00BFFF");
      }

      d3.svg
        .area()
        .x(function (d, i) {
          return d;
        })
        .y0(function (d, i) {
          if (i == 0) {
            return (high + low) / 2;
          } else if (i == 1) {
            return low;
          } else if (i == 2) {
            return low;
          } else {
            return (high + low) / 2;
          }
        })
        .y1(function (d, i) {
          if (i == 0) {
            return (high + low) / 2;
          } else if (i == 1) {
            return high;
          } else if (i == 2) {
            return high;
          } else {
            return (high + low) / 2;
          }
        });
      for (var i = 0; i < leftData.length; ++i) {
        svg
          .append("g")
          .append("path")
          .attr("d", areaPath(leftData[i]))
          // .attr('stroke', 'black')
          // .attr('stroke-width', "1px")
          .attr("fill", "#F08080");
      }
      //填充文字

      var rightText = start;
      var leftText = start;
      svg
        .append("g")
        .selectAll()
        .data(pos)
        .enter()
        .append("text")
        .text(function (d) {
          if (ref === "chart") {
            var temp = d[0].trim().split(/\s+/);
            var str = "";
            for (var i = 0; i < temp.length; ++i) {
              str += temp[i].charAt(0);
            }
            return str + " = " + d[2];
          } else {
            return d[0] + " = " + d[2];
          }
        })
        .attr("font-size", 10)
        .attr("x", function (d) {
          if (ref === "chart") {
            var temp = d[0].trim().split(/\s+/);
            var str = "";
            for (var i = 0; i < temp.length; ++i) {
              str += temp[i].charAt(0);
            }
            var t = str + " = " + d[2];
            rightText = rightText - t.length * 6;
            return rightText;
          } else {
            var t = d[0] + " = " + d[2];
            rightText = rightText - t.length * 6;
            return rightText;
          }
        })
        .attr("y", low * 1.5)
        .attr("fill", "#00BFFF");
      svg
        .append("g")
        .selectAll()
        .data(neg)
        .enter()
        .append("text")
        .text(function (d) {
          if (ref === "chart") {
            var temp = d[0].trim().split(/\s+/);
            var str = "";
            for (var i = 0; i < temp.length; ++i) {
              str += temp[i].charAt(0);
            }
            return str + " = " + d[2];
          } else {
            return d[0] + " = " + d[2];
          }
        })
        .attr("font-size", 10)
        .attr("x", function (d) {
          if (ref === "chart") {
            var temp = d[0].trim().split(/\s+/);
            var str = "";
            for (var i = 0; i < temp.length; ++i) {
              str += temp[i].charAt(0);
            }
            var t = str + " = " + d[2];
            leftText = leftText + t.length * 6;
            return leftText - t.length * 6;
          } else {
            var t = d[0] + " = " + d[2];
            leftText = leftText + t.length * 6;
            return leftText - t.length * 6;
          }
        })
        .attr("y", low * 1.5)
        .attr("fill", "#F08080");
      var line1 = [];
      var line2 = [];
      //绘制分割线
      svg
        .append("g")
        .selectAll()
        .data(data)
        .enter()
        .append("line") //making a line for legend
        .attr("x1", start)
        .attr("x2", start)
        .attr("y1", low)
        .attr("y2", low * 1.5)
        .style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "black");
      rightText = start;
      svg
        .append("g")
        .selectAll()
        .data(pos)
        .enter()
        .append("line") //making a line for legend
        .attr("x1", function (d, i) {
          return rightData[i][1];
        })
        .attr("x2", function (d, i) {
          if (ref == "chart") {
            var temp = d[0].trim().split(/\s+/);
            var str = "";
            for (var i = 0; i < temp.length; ++i) {
              str += temp[i].charAt(0);
            }
            var t = str + " = " + d[2];
            //2 后面的数字为了线和文字分开些
            rightText = rightText - t.length * 6 - 1;
            line1.push(rightText);
            return rightText;
          } else {
            var t = d[0] + " = " + d[2];
            //2 后面的数字为了线和文字分开些
            rightText = rightText - t.length * 6 - 2;
            line1.push(rightText);
            return rightText;
          }
        })
        .attr("y1", low)
        .attr("y2", low * 1.3)
        //.style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "#00BFFF");
      leftText = start;
      svg
        .append("g")
        .selectAll()
        .data(neg)
        .enter()
        .append("line") //making a line for legend
        .attr("x1", function (d, i) {
          return leftData[i][1];
        })
        .attr("x2", function (d, i) {
          if (ref === "chart") {
            var temp = d[0].trim().split(/\s+/);
            var str = "";
            for (var i = 0; i < temp.length; ++i) {
              str += temp[i].charAt(0);
            }
            var t = str + " = " + d[2];
            leftText = leftText + t.length * 6 + 0;
            line2.push(leftText);
            return leftText;
          } else {
            var t = d[0] + " = " + d[2];
            leftText = leftText + t.length * 6 - 2;
            line2.push(leftText);
            return leftText;
          }
        })
        .attr("y1", low)
        .attr("y2", low * 1.3)
        //.style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "#F08080");

      //绘制竖线
      rightText = start;
      svg
        .append("g")
        .selectAll()
        .data(pos)
        .enter()
        .append("line") //making a line for legend
        .attr("x1", function (d, i) {
          return line1[i];
        })
        .attr("x2", function (d, i) {
          return line1[i];
        })
        .attr("y1", low * 1.3)
        .attr("y2", low * 1.5)
        //.style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "#00BFFF");
      leftText = start;
      svg
        .append("g")
        .selectAll()
        .data(line2)
        .enter()
        .append("line") //making a line for legend
        .attr("x1", function (d, i) {
          return line2[i];
        })
        .attr("x2", function (d, i) {
          return line2[i];
        })
        .attr("y1", low * 1.3)
        .attr("y2", low * 1.5)
        //.style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "#F08080");

      //绘制base he predict num
      svg
        .append("text") //making a line for legend
        .attr("x", xScale(bias) + leftTranslate)
        .attr("y", y * 0.6)
        .text("base=" + bias)
        .attr("font-size", 10);
      //.style("stroke-dasharray", "5,5") //dashed array for line
      //.style("stroke", "black");
      svg
        //.append("g")
        // .selectAll()
        // .data(pos)
        // .enter()
        .append("line") //making a line for legend
        .attr("x1", xScale(bias) + leftTranslate)
        .attr("x2", xScale(bias) + leftTranslate)
        .attr("y1", y)
        .attr("y2", y + 10)
        //.style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "black");

      svg
        .append("text") //making a line for legend
        .attr("x", xScale(predict) + leftTranslate)
        .attr("y", y * 0.8)
        .text("result=" + predict)
        .attr("font-size", 10);
      //.style("stroke-dasharray", "5,5") //dashed array for line
      //.style("stroke", "black");
      svg
        //.append("g")
        // .selectAll()
        // .data(pos)
        // .enter()
        .append("line") //making a line for legend
        .attr("x1", xScale(predict) + leftTranslate)
        .attr("x2", xScale(predict) + leftTranslate)
        .attr("y1", y)
        .attr("y2", y + 10)
        //.style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "black");
    },
  },
};
</script>

<style>
.axis path,
.axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: sans-serif;
  font-size: 11px;
}
.el-scrollbar__wrap {
  overflow-x: auto;
}
#featureContributionsChart {
  overflow-x: auto;
  height: 100%;
  width: 100%;
}
#featureContributionsChart2 {
  overflow-x: auto;
  height: 300px;
  width: 100%;
}
</style>