<template>
  <div class="cell-contents cell-rock" >

  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  name: 'Rock',
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
.cell .cell-contents.cell-rock{
   background-color:darkred;
}
</style>
