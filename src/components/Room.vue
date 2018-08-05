<template>
  <div class="cell-contents cell-room" v-bind:style="cellStyles">

  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  name: 'Room',
  extends: 'Cell',
  data: function(){
    return {
      cellStyles : {
      }
    }
  }
}
</script>

<style>
.cell .cell-contents.cell-room{
   background-color:#eee;
}
</style>
