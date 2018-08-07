<template>
  <div class="cell-contents cell-exit" >

  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  name: 'Exit',
  extends: 'Cell',
  props: {
    x : Number,
    y : Number
  },
  methods: {

  }
}
</script>

<style>
.cell .cell-contents.cell-exit{
   background-color:blue;
}
</style>
