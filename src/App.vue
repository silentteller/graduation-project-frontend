<template>
  <div id="app" v-loading="loading">
    <div id="lay-left">
      <div id="lay-left-1">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Control</div>
        </div>
        <layLeftUp></layLeftUp>
      </div>
      <div id="lay-left-2">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Data OverView</div>
        </div>
        <layLeftCenter></layLeftCenter>
      </div>
      <div id="lay-left-3">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Data List</div>
        </div>
        <layLeftBottom></layLeftBottom>
      </div>
    </div>
    <div id="lay-center">
      <div id="lay-center-1">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Feature important</div>
        </div>
        <layCenterFIView />
        <!-- <layCenterView /> -->
      </div>
      <div id="lay-center-2">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Feature OverView</div>
        </div>
        <layCenterView />
      </div>
    </div>
    <div id="lay-right">
      <div id="lay-right-1">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Descision Path OverView</div>
        </div>
        <pathScatter></pathScatter>
      </div>
      <div id="lay-right-2">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Disturbance Table</div>
        </div>
        <slider></slider>
      </div>
    </div>
    <div id="lay-right-last">
      <div id="lay-right-last-1">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Rule Matrix</div>
        </div>
        <rectRule></rectRule>
      </div>
      <div id="lay-right-last-2">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">RePredict Rule Matrix</div>
        </div>
        <fixRectRule></fixRectRule>
      </div>
      <div id="lay-right-last-3">
        <div class="view-title am-panel am-panel-primary">
          <div class="am-panel-hd">Feature contributions</div>
        </div>
        <featureContributions />
      </div>
    </div>
  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
import layLeftCenter from "./components/layLeft/layLeftCenter.vue";
import layLeftUp from "./components/layLeft/layLeftUp.vue";
import layCenterView from "./components/layCenter/layCenterView.vue";
import layCenterFIView from "./components/layCenter/layCenterFIView.vue";
import layLeftBottom from "./components/layLeft/layLeftBottom.vue";
import pathScatter from "./components/layRight/pathScatter.vue";
import slider from "./components/layRight/slider.vue";
import rectRule from "./components/layRightLast/rectRule.vue";
import fixRectRule from "./components/layRightLast/fixRectRule.vue";
import featureContributions from "./components/layRightLast/featureContributions.vue";

export default {
  name: "App",
  data() {
    return {
      loading: false,
    };
  },
  components: {
    // HelloWorld,
    layLeftUp,
    layLeftCenter,
    layLeftBottom,
    layCenterFIView,
    layCenterView,
    pathScatter,
    slider,
    rectRule,
    fixRectRule,
    featureContributions,
  },
  mounted() {
    this.$Bus.$on("openLoad", () => {
      this.loading = true;
    });
    this.$Bus.$on("closeLoad", () => {
      this.loading = false;
    });
  },
  methods: {
    // changeData(params) {
    //   this.data = params;
    // },
    // changePdpData(params) {
    //   this.pdpData = params;
    // },
  },
};
</script>

<style>
/* html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
} */
body {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
.BaseChart {
  height: calc(100% - 25px);
  width: 100%;
}
.el-scrollbar__view {
  padding: 4px;
  height: 100%;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.am-panel-primary {
  border-color: #1d2127;
  height: 25px;
  margin-bottom: 0px;
}

.am-panel-primary > .am-panel-hd {
  background-color: #1d2127;
  border-color: #1d2127;
  height: 25px;
  font-size: 15px;
  color: white;
  padding: 0px 0px 0px 0px;
}
#app {
  width: 100vw;
  height: 100vh;
  /* width: 100%;
  height: 100%; */
  display: flex;
}
#lay-left {
  width: 20%;
  height: 100%;
}
#lay-center {
  width: 25%;
  height: 100%;
}
#lay-right {
  width: 20%;
  height: 100%;
}
#lay-right-last {
  width: 35%;
  height: 100%;
}
#lay-left-1 {
  width: 100%;
  height: 15%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-left-2 {
  /* background-color: rgb(20, 20, 39); */
  width: 100%;
  height: 45%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-left-3 {
  width: 100%;
  height: 40%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-center-1 {
  width: 100%;
  height: 30%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-center-2 {
  width: 100%;
  height: 70%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-right-1 {
  width: 100%;
  height: 50%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-right-2 {
  width: 100%;
  height: 50%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}

/* #lay-right-last {
  border-width: 1px;
  border-color: black;
  border-style: solid;
} */

#lay-right-last-1 {
  width: 100%;
  height: 35%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-right-last-2 {
  width: 100%;
  height: 35%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
#lay-right-last-3 {
  width: 100%;
  height: 30%;
  border-width: 1px;
  border-color: black;
  border-style: solid;
}
</style>
