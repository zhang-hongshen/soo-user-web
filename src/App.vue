<template>
    <div id="app">
        <el-container>
            <el-header class="header-container" height="50px">
                <nav-bar/>
            </el-header>
            <el-main class="main-container">
                <router-view v-if="isRouterAlive" :key="key"/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  components: {
    NavBar
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/mixin';

html,body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.body {
  margin: 0;
  padding: 0;
  height: 100%;
}

// ::-webkit-scrollbar {
//   @include scrollbar-color();
// }

// ::-webkit-scrollbar-thumb {
//   @include scrollbar-thumb-background-color();
// }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;



  .header-container {
    padding: 0;
  }

  .main-container {
    padding-top: 20px;
    width: 100%;
    @include first-background-color;

  }
}


</style>


