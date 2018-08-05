<template>
  <div class="cell-contents cell-hero" v-bind:style="cellStyles">

  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  name: 'Hero',
  extends: 'Cell',
  props: {
    x : Number,
    y : Number
  },
  data: function(){
    return {
      health : 100, //should be linked to centralized data store
      cellStyles : {
      }
    }
  },
  mounted : function(){
    this.$eventHub.$on('move', this.move );
  },
  methods: {
      move : function(dir){
          this.$emit('move-hero', { x : this.x, y : this.y, dir : dir } );
      }
  }
}
</script>

<style>
.cell .cell-contents.cell-hero{
   background-color:green;
}
</style>
