<template>
  <div class="BaseChart" ref="chart"></div>
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
      featureImportance: [],
      mdiFeatureImportance: [],
    };
  },
  mounted() {
    this.$Bus.$on("sendData", (data) => {
      this.featureList = data.featureList;
      this.featureImportance = data.featureImportance;
      this.mdiFeatureImportance = data.mdiFeatureImportance;
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
      let featureList = JSON.parse(JSON.stringify(this.featureList));
      let featureImportance = JSON.parse(
        JSON.stringify(this.featureImportance)
      );
      let mdiFeatureImportance = JSON.parse(
        JSON.stringify(this.mdiFeatureImportance)
      );
      for (var i = 0; i < featureImportance.length; ++i) {
        featureImportance[i] *= 10;
      }
      // 绘制图表
      const colors = [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
      ];
      var option = {
        title: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: featureList,
        },
        series: [
          {
            // name: '2011年',
            type: "bar",
            data: mdiFeatureImportance,
            //data: featureImportance,
            itemStyle: {
              color: function (params) {
                return colors[params.dataIndex];
              },
            },
          },
        ],
      };
      myChart.setOption(option, true);
      //   myChart.resize({
      //     height: index * (top + height),
      //   });
    },
  },
};
</script>

