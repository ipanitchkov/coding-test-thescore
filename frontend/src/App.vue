<template>
  <Players/>
</template>

<script>
import Players from './components/Players.vue'

export default {
  name: 'App',
  components: {
    Players
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
