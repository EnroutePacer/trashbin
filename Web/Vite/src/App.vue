
<template>
  <div>
    <h2>{{ title }}</h2>
    <button @click="fetchData">请求后端</button>
    <p v-if="msg">后端返回：{{ msg }}</p>
  </div>
  <div>
    <h2>{{ se_title }}</h2>
    <button @click="chackaccount">查看登录状态</button>
    <p v-if="lg">后端返回：{{lg}}</p>
  </div>
  <div>
    <h2>{{ se_title }}</h2>
    <button @click="clearall">清空记录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Vue + FastAPI ",
      msg: "",
      lg: ""
    }
  },
  methods: {
    async fetchData() {
      const res = await fetch("http://127.0.0.1:8000/api/hello")
      const data = await res.json()
      this.msg = data.message
    },
    async chackaccount(){
      const res = await fetch("http://127.0.0.1:8000/user/login")
      const data = await res.json()
      this.lg = data.message
    },
    clearall(){
      this.lg = ""
      this.msg = ""
    }
  }
}
</script>

<style scoped>
h2 {
  color: #42b983;
}
</style>