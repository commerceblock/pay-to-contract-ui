<template>

  <div class="wrapper">

    <loginmodal v-if="showLoginModal" @close="showLoginModal = false" />

    <header class="main-header">
      <a href="/" class="logo">
        <!-- mini logo for sidebar mini 40x50 pixels -->
        <span class="logo-mini"><img src="/static/img/logo_sm.png" alt="Logo" class="img-responsive center-block"></span>
        <!-- logo for regular state and mobile devices -->
        <div class="container logo-lg">
          <div class="pull-left info">CommerceBlock</div>
        </div>
      </a>

      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>

        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav logout-button">
            <button type="button" class="btn btn-default" v-on:click="signout">
              <span class="fa fa-sign-out"></span> Log out
            </button>
          </ul>
        </div>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">

      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">

        <!-- Sidebar user panel (optional) -->
        <div class="user-panel">
          <div class="pull-left image">

          </div>
          <div class="pull-left info">
            <div><p class="white">Status</p></div>
            <a href="javascript:;"><i class="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <ul class="sidebar-menu">
          <li class="header">TOOLS</li>
          <li class="active pageLink" v-on:click="toggleMenu"><router-link to="/"><i class="fa fa-paperclip"></i><span class="page">Create Contract</span></router-link></li>
          <li class="pageLink" v-on:click="toggleMenu"><router-link to="/fulfill"><i class="fa fa-file-text-o"></i><span class="page">Fulfill Contract</span></router-link></li>
          <li class="pageLink" v-on:click="toggleMenu"><router-link to="/redeem"><i class="fa fa-bitcoin"></i><span class="page">Redeem Contract</span></router-link></li>
        </ul>
        <!-- /.sidebar-menu -->
      </section>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name.toUpperCase() }}
          <small>{{ $route.meta.description }}</small>
        </h1>
      </section>

      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->

    <!-- Main Footer -->
    <footer class="main-footer">
      <strong>Copyright &copy; {{year}} <a href="javascript:;">CommerceBlock</a>.</strong> All rights reserved.
    </footer>
  </div>
  <!-- ./wrapper -->
</template>

<script>
import LoginModal from './LoginModal.vue'
import _ from 'lodash'

export default {
  name: 'Home',
  components: {
    loginmodal: LoginModal
  },
  data: function () {
    return {
      section: 'Home',
      showLoginModal: true
    }
  },
  computed: {
    store: function () {
      return this.$parent.$store
    },
    state: function () {
      return this.store.state
    },
    year: function () {
      var y = new Date()
      return y.getFullYear()
    }
  },
  methods: {
    toggleMenu: function (event) {
      // remove active from li
      window.$('li.pageLink').removeClass('active')

      // Add it to the item that was clicked
      event.toElement.parentElement.className = 'pageLink active'
    },
    signout: function () {
      // reset childs
      _.forEach(this.$children, (child) => {
        if (child.reset) {
          child.reset()
        }
      })
      // reset store
      this.store.commit('RESET')
      this.showLoginModal = true
    }
  },
  mounted: function () {
    // Page is ready. Let's load our functions!
  }
}
</script>

<style>
.user-panel {
  height: 4em;
}
hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}

.logout-button {
  margin-top: 5px;
  margin-right: 5px;
}
</style>
