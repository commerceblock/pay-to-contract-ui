<template>
<section class='content'>

  <addformmodal v-if="showAddFormModal" @close="showAddFormModal = false" />

  <div class="row center-block">
    <h2>Saved Forms</h2>
    <div class="col-md-12">
      <div class="box">
        <div class="box-header">
            <!-- <h3 class="box-title">Striped Full Width Table</h3> -->
          <button class='btn btn-primary' v-on:click='showAddFormModal = true'>Add <i class="fa fa-plus"></i></button>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <div class="dataTables_wrapper form-inline dt-bootstrap" id="example1_wrapper">

            <div class="row">
              <div class="col-sm-12 table-responsive">
                <table aria-describedby="example1_info" role="grid" id="example1" class="table table-bordered table-striped dataTable">
                  <thead>
                    <tr role="row">
                      <th aria-label="#: activate to sort column descending" aria-sort="ascending" style="width: 167px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting_asc">#</th>
                      <th aria-label="Name: activate to sort column descending" aria-sort="ascending" style="width: 167px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting_asc">Name</th>
                      <th aria-label="Date: activate to sort column ascending" style="width: 207px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Date</th>
                      <th aria-label="Actions: activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :class="index % 2 == 0 ? 'even' : 'odd'" role="row">
                      <td>{{ index+1 }}.</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.date }}</td>
                      <td>
                       <a><i class="fa fa-user"></i></a>
                       <a><i class="fa fa-pencil"></i></a>
                       <a><i class="fa fa-times"></i></a>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="1" rowspan="1">Name</th>
                      <th colspan="1" rowspan="1">Date</th>
                      <th colspan="1" rowspan="1">Actions</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <!-- /.box-body -->
        </div>
      </div>
    </div>
  </div>

</section>
</template>

<script>
import AddFormModal from './AddFormModal.vue'

export default {
  name: 'MainApp',
  components: {
    addformmodal: AddFormModal
  },
  data: function () {
    return {
      showAddFormModal: false
    }
  },
  methods: {
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
@import 'https://fonts.googleapis.com/css?family=Roboto';
</style>
