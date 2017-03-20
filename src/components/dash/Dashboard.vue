<template>
  <section class='content'>
    <div id='app'>

      <div class='row form-group'>
        <dropzone id='mainDropzone' url='/' v-on:vdropzone-file-added='fileAdded' v-on:vdropzone-removed-file='fileRemoved'>
        </dropzone>
      </div>

      <div class='row form-group'>
        <div class='input-group'>
          <span class='input-group-addon'>$</span>
          <input placeholder='public key' type='text' class='form-control' id='publicKey' name='publicKey' v-model='publicKey'>
        </div>
      </div>

      <div class='row form-group'>
        <div class='text-center'>
            <button class='btn btn-primary btn-lg' v-on:click='generate($event)'>Generate</button>
            <button class='btn btn-primary btn-lg' v-on:click='reset($event)'>Reset</button>
        </div>
      </div>

      <div class='row text-center' v-if='resultReady'>
        <div class='col-md-6 col-md-offset-3'>
          <div class='info-box bg-aqua'>
            <span class='info-box-icon'><i class='ion-ios-chatbubble-outline'></i></span>
            <div class='info-box-content'>
              <span class='info-box-text'>Payment Base</span>
              <span class='info-box-number'>{{ paymentBase }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import crypto from 'crypto'

Dropzone.props.autoProcessQueue = {
  type: Boolean,
  required: false,
  default: function () {
    return false
  }
}

export default {
  name: 'MainApp',
  components: {
    Dropzone
  },
  data: function () {
    return {
      publicKey: '',
      paymentBase: '',
      resultReady: true,
      fileSignatures: []
    }
  },
  methods: {
    reset: function (event) {
      this.resultReady = false
      this.publicKey = ''
      this.fileSignatures = []
      this.paymentBase = ''
      //  TODO:: clear dropzone
    },
    generate: function (event) {
      // now we have access to the native event
      if (event) event.preventDefault()

      console.log(this.publicKey)
      console.log(this.fileSignatures)

      this.paymentBase = 'foooo'
    },
    fileAdded: function (file) {
      const that = this
      that.fileSignatures[file.name] = {
        status: 'initial'
      }
      const fileReader = new window.FileReader()
      const hash = crypto.createHash('sha512')
      fileReader.onload = function (e) {
        that.fileSignatures[file.name] = {
          status: 'loaded'
        }

        hash.update(e.target.result, 'utf8')
        const signature = hash.digest('hex')
        that.fileSignatures[file.name] = {
          status: 'digested',
          signature: signature
        }

        console.log(that.fileSignatures)
      }
      // this.fileSignatures = event
      fileReader.readAsText(file)
    },
    fileRemoved: function (file, error, xhr) {
      delete this.fileSignatures[file.name]
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
