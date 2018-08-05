<template>
  <div class="cell-contents" :data-occupied="cellType" v-bind:style="cellStyles">

  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cellType: String,
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
  
}
.cell-contents:before{
  content: "";
  display: block;
  padding-top: 100%;
}
.cell:nth-child(even) .cell-contents{
   background-color:#ccc;
}
.cell .cell-contents[data-occupied="room"]{
   background-color:blue !important;
}

.cell .cell-contents[data-occupied="hero"]{
   background-color:green !important;
}

.cell .cell-contents[data-occupied="monster"]{
   background-color:red !important;
}

.cell .cell-contents[data-occupied="treasure"]{
   background-color:yellow !important;
}
</style>
