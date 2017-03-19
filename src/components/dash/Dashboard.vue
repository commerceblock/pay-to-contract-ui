<template>
  <div id='app'>

    <div class='form-group'>
      <dropzone id='mainDropzone' url='/' v-on:vdropzone-file-added='fileAdded'></dropzone>
    </div>

    <form class=''>
      <input type='hidden' v-model='filePath'>

      <div class='input-group form-group'>
        <span class='input-group-addon'>$</span>
        <input placeholder='public key' type='text' class='form-control' id='publicKey' name='publicKey' v-model='publicKey'>
      </div>

      <div class='text-center form-group'>
        <button type='submit' class='btn btn-primary btn-lg'  v-on:click='generate($event)'>Generate</button>
      </div>

    </form>

  </div>
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

  // function readFile(file) {
  //   var fr = new FileReader();
  //   fr.onload = (e) => {
  //     // e.target.result should contain the text
  //     console.log("===>", e)
  //   }
  //   fr.readAsText(file)
  // }

  Dropzone.props.useCustomDropzoneOptions = {
    type: Boolean,
    required: false,
    default: function () {
      return false
    }
  }

  Dropzone.props.dropzoneOptions = {
    accept: function (file, done) {
      if (file.name === 'justinbieber.jpg') {
        done('Naha, you don\'t.')
      } else {
        done()
      }
    }
  }

  console.log(Dropzone.methods)

  export default {
    name: 'MainApp',
    components: {
      Dropzone
    },
    data () {
      return {
        publicKey: ''
      }
    },
    methods: {
      generate: function (event) {
        // now we have access to the native event
        if (event) event.preventDefault()
        console.log(this.publicKey)
        console.log(this.filePath)
      },
      fileAdded: function (event) {
        console.log(event)
        this.filePath = event
      }
    }
  }

  // Dropzone.options.mainDropzone.accept = function (file, done) {
  //   console.log('fooooo', file)
  //   done()
  // }
</script>

<style scoped>
  @import url('~dropzone/dist/dropzone.css');
  @import 'https://fonts.googleapis.com/css?family=Roboto';
</style>
