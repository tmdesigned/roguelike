<template>
  <div class="cell-contents" :data-occupied="cellType" v-bind:style="cellStyles">

  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cellType: String,
    x : Number,
    y : Number
  },
  data: function(){
    return {
      cellStyles : {
      }
    }
  }
}
</script>

<style>
.cell{
   display:table-cell;
   flex: 1 1 0px;
}

.cell .cell-contents{
  padding:1px;
  background-color: #444;
  
}
.cell-contents:before{
  content: "";
  display: block;
  padding-top: 100%;
}

</style>
