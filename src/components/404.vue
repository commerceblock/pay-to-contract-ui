<template>
  <div class="container container-table">
    <div class="row vertical-10p">
      <div class="container">
        <img src="/static/img/logo.png" class="center-block logo">
        <div class="text-center col-sm-6 col-sm-offset-3">
          <h1>You are lost.</h1>
          <h4>This page doesn't exist.</h4>
          <router-link to="/">Take me home.</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'NotFound'
  }
</script>

<style>
html, body, .container-table {
  height: 100%;
  background-color: #282B30 !important;
}
.container-table {
    display: table;
    color: white;
}
.vertical-10p {
  padding-top: 10%;
}
</style>
