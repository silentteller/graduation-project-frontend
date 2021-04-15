<template>
  <!-- <div id="rectRuleChart"></div> -->
  <!-- <div class="BaseChart">
    <el-scrollbar style="height: 100%">
      <div id="rectRuleChart" ref="chart"></div>
    </el-scrollbar>
  </div> -->
  <div class="BaseChart">
    <el-scrollbar style="height: 100%">
      <div id="rectRuleChart" ref="chart" @click="openDialog()"></div>
    </el-scrollbar>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <div id="rectRuleChart2" ref="chart2"></div>
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
      selList: [],
      ruleData: [],
      predictData: [],
      fmin: [],
      fmax: [],
      featureList: [],
      featureImportant: [],
      data: [],
    };
  },
  mounted() {
    //this.draw();
    this.$Bus.$on("sendSelPathData", (data) => {
      this.selList = data.selList;
      this.ruleData = data.ruleData;
      this.predictData = data.predictData;
      this.fmin = data.fmin;
      this.fmax = data.fmax;
      this.featureList = data.featureList;
      this.featureImportant = data.featureImportant;
      this.data = data.data;
      this.draw("rectRuleChart", "chart");
    });
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.$nextTick((_) => {
        this.draw("rectRuleChart2", "chart2");
      });
    },
    draw(id, ref) {
      const rectHeight = 10;
      const rectWidth = 40;
      const driftX = 20;
      const driftY = 20;
      // 基于准备好的dom，初始化echarts实例
      var width = 500; //画布的宽度
      var height = (this.selList.length + 8) * rectHeight + driftY; //画布的高度
      //d3.select("svg").remove();
      //d3.select("svg").remove();
      $(`#${id}`).empty();
      var svg = d3
        .select(`#${id}`) //选择文档中的body元素
        .append("svg") //添加一个svg元素
        .attr("width", width) //设定宽度
        .attr("height", height); //设定高度
      //左偏移，长度
      let selList = JSON.parse(JSON.stringify(this.selList));
      let ruleData = JSON.parse(JSON.stringify(this.ruleData));
      let predictData = JSON.parse(JSON.stringify(this.predictData));
      let fmin = JSON.parse(JSON.stringify(this.fmin));
      let fmax = JSON.parse(JSON.stringify(this.fmax));
      let featureList = JSON.parse(JSON.stringify(this.featureList));
      let featureNumber = fmin.length;
      let selectNumber = selList.length;
      let matrix = new Array(featureNumber * selectNumber);
      let predictMatrix = new Array(selectNumber);
      let featureMatrix = new Array(featureNumber);
      let featureImportant = JSON.parse(JSON.stringify(this.featureImportant));
      let data = this.data;

      var featureUse = [];
      for (var i = 0; i < featureNumber; ++i) {
        featureUse.push([0, 0]);
      }
      var dataset = [];
      //[[0,1,x,y,predict],[0,3,x,y],[1,2,x,y]]
      for (var i = 0; i < ruleData.length; ++i) {
        for (var j = 0; j < featureNumber; ++j) {
          var temp = [];
          if (ruleData[i][j] != null) {
            if (predictData[i][1] >= 0.5) {
              featureUse[j][1]++;
            } else {
              featureUse[j][0]++;
            }
            temp.push(i);
            temp.push(j);
            //规格化处理
            temp.push(
              ((ruleData[i][j][0] - fmin[j]) / (fmax[j] - fmin[j])) * rectWidth
            );
            temp.push(
              ((ruleData[i][j][1] - ruleData[i][j][0]) / (fmax[j] - fmin[j])) *
                rectWidth
            );
            temp.push(predictData[i][1]);
            dataset.push(temp);
          }
        }
      }
      //特征使用占比矩形
      svg
        .append("g")
        .selectAll()
        .data(featureMatrix)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return i * rectWidth + driftX * 3;
        }) //每个矩形的起始x坐标
        .attr("y", function (d, i) {
          return 0;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return rectWidth;
        })
        .attr("height", rectHeight / 2) //每个矩形的高度
        .attr("stroke", "black")
        .attr("fill-opacity", 0)
        .attr("stroke-width", "1");

      svg
        .append("g")
        .selectAll()
        .data(featureUse)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return i * rectWidth + driftX * 3;
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return 10;
        })
        .attr("width", function (d, i) {
          //每个矩形的宽度
          return (d[0] / (d[0] + d[1])) * rectWidth;
        })
        .attr("height", rectHeight / 2) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d) {
          //"#F08080" : "#00BFFF";
          return "#F08080";
        });
      svg
        .append("g")
        .selectAll()
        .data(featureUse)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return (
            i * rectWidth + driftX * 3 + (d[0] / (d[0] + d[1])) * rectWidth
          );
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return 10;
        })
        .attr("width", function (d, i) {
          //每个矩形的宽度
          return (d[1] / (d[0] + d[1])) * rectWidth;
        })
        .attr("height", rectHeight / 2) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d) {
          //"#F08080" : "#00BFFF";
          return "#00BFFF";
        });
      //特征预测对比占比矩形
      svg
        .append("g")
        .selectAll()
        .data(featureMatrix)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return i * rectWidth + driftX * 3;
        }) //每个矩形的起始x坐标
        .attr("y", function (d, i) {
          return 10;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return rectWidth;
        })
        .attr("height", rectHeight / 2) //每个矩形的高度
        .attr("stroke", "black")
        .attr("fill-opacity", 0)
        .attr("stroke-width", "1");

      svg
        .append("g")
        .selectAll()
        .data(featureUse)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return i * rectWidth + driftX * 3;
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return 0;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return ((d[0] + d[1]) / selectNumber) * rectWidth;
        })
        .attr("height", rectHeight / 2) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d) {
          return "#8e8e8e";
        });
      //
      svg
        .append("g")
        .selectAll()
        .data(matrix)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return (i % featureNumber) * rectWidth + driftX * 3;
        }) //每个矩形的起始x坐标
        .attr("y", function (d, i) {
          return parseInt(i / featureNumber) * rectHeight + driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return rectWidth;
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("stroke", "black")
        .attr("fill-opacity", 0)
        .attr("stroke-width", "1");
      svg
        .append("g")
        .selectAll()
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return rectWidth * d[1] + driftX * 3 + d[2];
        }) //每个矩形的起始x坐标
        .attr("y", function (d) {
          return d[0] * rectHeight + driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return d[3];
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d) {
          return d[4] < 0.5 ? "#F08080" : "#00BFFF";
        });
      svg
        .append("g")
        .selectAll()
        .data(selList)
        .enter()
        .append("text")
        .text(function (d) {
          return "path " + d;
        })
        .attr("font-size", 8)
        .attr("x", function (d, i) {
          return driftX / 2;
        })
        .attr("y", function (d, i) {
          return i * rectHeight + driftY * 1.5;
        });
      svg
        .append("g")
        .selectAll()
        .data(featureList)
        .enter()
        .append("text")
        .text(function (d, i) {
          return d + " | " + data[i];
        })
        .attr("font-size", 8)
        .attr("x", function (d, i) {
          return rectWidth * i + driftX * 3;
        })
        .attr("y", function (d, i) {
          return rectHeight * (selectNumber + 1) + driftY;
        })
        .attr("transform", function (d, i) {
          return (
            "rotate(15, " +
            (rectWidth * i + driftX * 3) +
            " " +
            (rectHeight * (selectNumber + 1) + driftY) +
            ")"
          );
        });
      svg
        .append("g")
        .selectAll()
        .data(data)
        .enter()
        .append("line") //making a line for legend
        .attr("x1", function (d, i) {
          return (
            ((d - fmin[i]) / (fmax[i] - fmin[i])) * rectWidth +
            rectWidth * i +
            driftX * 3
          );
        })
        .attr("x2", function (d, i) {
          return (
            ((d - fmin[i]) / (fmax[i] - fmin[i])) * rectWidth +
            rectWidth * i +
            driftX * 3
          );
        })
        .attr("y1", driftY)
        .attr("y2", rectHeight * selectNumber + driftY * 1.5)
        .style("stroke-dasharray", "5,5") //dashed array for line
        .style("stroke", "gray");
      //预测结果矩形
      svg
        .append("g")
        .selectAll()
        .data(predictMatrix)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return featureNumber * rectWidth + driftX * 4;
        }) //每个矩形的起始x坐标
        .attr("y", function (d, i) {
          return i * rectHeight + driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return rectWidth;
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("stroke", "black")
        .attr("fill-opacity", 0)
        .attr("stroke-width", "1");
      svg
        .append("g")
        .selectAll()
        .data(predictData)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return featureNumber * rectWidth + driftX * 4;
        }) //每个矩形的起始x坐标
        .attr("y", function (d, i) {
          return i * rectHeight + driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return d[0] * rectWidth;
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d, i) {
          return "#F08080";
        });
      svg
        .append("g")
        .selectAll()
        .data(predictData)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return featureNumber * rectWidth + driftX * 4 + d[0] * rectWidth;
        }) //每个矩形的起始x坐标
        .attr("y", function (d, i) {
          return i * rectHeight + driftY;
        })
        .attr("width", function (d) {
          //每个矩形的宽度
          return d[1] * rectWidth;
        })
        .attr("height", rectHeight) //每个矩形的高度
        .attr("fill-opacity", 0.5)
        .attr("fill", function (d, i) {
          return "#00BFFF";
        });
    },
  },
};
</script>

<style>
#rectRuleChart {
  width: 100%;
  height: 100%;
}

#rectRuleChart2 {
  overflow-x: auto;
  height: 1000px;
  width: 500px;
}
</style>