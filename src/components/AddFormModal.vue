<template>
<transition name="modal">
  <div class="add-form-modal-mask">
    <div class="add-form-modal-wrapper">
      <div class="add-form-modal-container">

        <div v-if=erroResponse class="text-red"><p>{{erroResponse}}</p></div>

        <div class="ui form loginForm">

          <h2 class="text-center">Add Form</h2>

          <div class="input-group">
            <label>Name</label>
            <input class="form-control span6" name="formName" placeholder="Enter form name" type="textarea" v-model="formName" />
          </div>

          <div class="input-group">
            <div class="form-group">
              <label>Upload your files</label>
              <dropzone id="mainDropzone" url="/" v-on:vdropzone-file-added="fileAdded" v-on:vdropzone-removed-file="fileRemoved" />
            </div>
          </div>

          <p>&nbsp;</p>
          <p>&nbsp;</p>

          <div class="text-center col-md-3 col-sm-offset-4 add-form-button">
            <button class="button-center btn btn-primary btn-lg add-form-button" @click="addForm">&nbsp;Add&nbsp;&nbsp;&nbsp;</button>
          </div>

          <div class="text-center col-md-3 col-sm-offset-1 add-form-button">
            <button class="button-center btn btn-primary btn-lg add-form-button" @click="$emit('close')">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import Dropzone from 'vue2-dropzone'

Dropzone.props.autoProcessQueue = {
  type: Boolean,
  required: false,
  default: function () {
    return false
  }
}

export default {
  name: 'AddFormModal',
  components: {
    Dropzone
  },
  data: function () {
    return {
    }
  },
  methods: {
    addForm: function (event) {
      this.$parent.$store.commit('ADD_ITEM', {
        id: uuid(),
        name: this.formName,
        date: new Date().toString()
      })
      this.$emit('close')
    },
    fileAdded: function (event) {

    },
    fileRemoved: function (event) {

    }
  },
  computed: {
    store: function () {
      return this.$parent.$store
    },
    items: function () {
      return this.store.getters.items
    }
  }
}
</script>


<style scoped>
@import url('~dropzone/dist/dropzone.css');
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

.add-form-button {
  width: 90px
}

.add-form-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.add-form-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.add-form-modal-container {
  width: 650px;
  height: 650px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.add-form-modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.add-form-modal-body {
  margin: 20px 0;
}


/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.add-form-modal-enter {
  opacity: 0;
}

.add-form-modal-leave-active {
  opacity: 0;
}

.add-form-modal-enter .add-form-modal-container,
.add-form-modal-leave-active .add-form-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}

.input-group input {
  height: 4em;
}

.vue-dropzone {
  width: 600px;
  height: 300px;
}
</style>
