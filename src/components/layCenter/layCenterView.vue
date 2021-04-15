<template>
  <div class="BaseChart">
    <el-scrollbar style="height: 100%">
      <div class="BaseChart" ref="chart"></div>
    </el-scrollbar>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "hello",
  props: {
    // data: Array,
    // pdpData: Array,
  },
  data() {
    return {
      data: [],
      pdpData: [],
      featureList: [],
      featureListMin: [],
      featureListMax: [],
    };
  },
  mounted() {
    this.$Bus.$on("sendData", (data) => {
      this.data = data.data;
      this.featureList = data.featureList;
      this.featureListMin = data.featureListMin;
      this.featureListMax = data.featureListMax;
    });
    this.$Bus.$on("sendPdpData", (data) => {
      this.pdpData = data.data;
      this.drawLine();
    });
    this.$Bus.$on("sendSelData", (data) => {
      this.data = data.data;
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.chart);
      const width = this.$refs.chart.offsetWidth - 80;
      //const width = this.$refs.chart.offsetWidth - 8;
      const height = 80;
      const top = 40;

      var data = this.data;
      //JSON.parse(JSON.stringify(that.runlogData));
      let pdpData = JSON.parse(JSON.stringify(this.pdpData));
      let feature = JSON.parse(JSON.stringify(this.featureList));
      let featureListMin = JSON.parse(JSON.stringify(this.featureListMin));
      let featureListMax = JSON.parse(JSON.stringify(this.featureListMax));
      //特征
      // var feature = [
      //   "age",
      //   "alone",
      //   "class",
      //   "embark_town",
      //   "fare",
      //   "n_siblings_spouses",
      //   "parch",
      // ];
      //bin数量
      var binNum = 10;
      //存储特征和其值映射，绘制特征分布视图
      var map = {};
      //存储特征和其pdp相关值
      var pdpMap = {};
      var pdpMatrix = {};
      //特征分布计算
      for (var i = 0; i < feature.length; ++i) {
        var myMap = {};
        for (var j = 0; j < data.length; ++j) {
          //console.log(data[j][feature[i]]);
          if (myMap[data[j][feature[i]]]) {
            myMap[data[j][feature[i]]] += 1;
          } else {
            myMap[data[j][feature[i]]] = 1;
          }
        }
        //数量大于bin值，重新划分bin统计
        if (featureListMax[i] - featureListMin[i] > binNum) {
          var arr = Object.keys(myMap);
          var min = parseInt(Math.min(...arr));
          var max = parseInt(Math.max(...arr));
          var cha = parseInt((max - min) / binNum);
          var a = new Array(10).fill(0);
          for (let key in myMap) {
            //console.log(key + "---" + obj[key]);
            if (parseInt(key) == max) {
              a[binNum - 1] += parseInt(myMap[key]);
            } else {
              a[parseInt(key / cha)] += parseInt(myMap[key]);
            }
          }
          var newMap = {};
          var start = min;
          for (var k = 1; k < binNum; ++k) {
            newMap[start + "-" + (min + k * cha)] = a[k - 1];
            start = min + k * cha;
          }
          newMap[start + "-" + max] = a[binNum - 1];
          myMap = newMap;
        }
        map[feature[i]] = myMap;
      }
      //pdp数据计算
      for (var i = 0; i < pdpData.length; ++i) {
        var temp = {};
        var arr = [];
        for (var j = 0; j < pdpData[i]["axes"].length; ++j) {
          temp[pdpData[i]["axes"][j]] = pdpData[i]["pdp"][j];
          arr.push([pdpData[i]["axes"][j], pdpData[i]["pdp"][j]]);
        }
        pdpMap[pdpData[i]["name"]] = temp;
        pdpMatrix[pdpData[i]["name"]] = arr;
      }
      // 绘制图表
      var option1 = {
        //title: [],
        //legend: {},
        tooltip: {},
        grid: [],
        xAxis: [],
        yAxis: [],
        series: [],
      };
      let index = 0;
      for (var i = 0; i < feature.length; ++i) {
        // option1.title.push({
        //   text: feature[i],
        // });
        //pdp视图
        option1.grid.push({
          top: 20 + top * index + index * height,
          left: 50,
          width: width,
          height: height,
        });
        if (pdpMatrix[feature[i]].length > binNum) {
          //debugger;
          option1.xAxis.push({
            type: "value",
            // data: Object.keys(pdpMap[feature[i]]),
            //data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
            gridIndex: index,
          });
          option1.series.push({
            xAxisIndex: index,
            yAxisIndex: index,
            name: feature[i],
            symbol: "none",
            type: "line",
            data: pdpMatrix[feature[i]],
            //data: Object.values(pdpMap[feature[i]]),
          });
          option1.yAxis.push({
            name: feature[i],
            gridIndex: index,
            nameLocation: "start",
            nameGap: 20,
            nameTextStyle: {
              fontSize: 10,
            },
            //type: "value",
          });
        } else {
          option1.xAxis.push({
            //type: "value",
            data: Object.keys(pdpMap[feature[i]]),
            //data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
            gridIndex: index,
          });
          option1.series.push({
            xAxisIndex: index,
            yAxisIndex: index,
            name: feature[i],
            type: "line",
            //data: [5, 20, 36, 10, 10, 20],
            data: Object.values(pdpMap[feature[i]]),
          });
          option1.yAxis.push({
            name: feature[i],
            gridIndex: index,
            nameLocation: "start",
            nameGap: 20,
            nameTextStyle: {
              fontSize: 10,
            },
            //type: "value",
          });
        }
        index++;
        //特征分布视图
        option1.grid.push({
          top: 20 + top * index + index * height,
          left: 50,
          width: width,
          height: height,
        });
        option1.xAxis.push({
          data: Object.keys(map[feature[i]]),
          gridIndex: index,
        });
        option1.series.push({
          xAxisIndex: index,
          yAxisIndex: index,
          name: feature[i],
          type: "bar",
          data: Object.values(map[feature[i]]),
        });
        option1.yAxis.push({
          gridIndex: index,
        });
        index++;
      }
      myChart.setOption(option1, true);
      myChart.resize({
        height: index * (top + height) + 50,
      });
    },
  },
};
</script>

