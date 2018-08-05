<template>
  <div class="cell-contents" :data-occupied="cellType" v-bind:style="cellStyles">

  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: {
  },
  data: function(){
    return {
      health : 100
    }
  },
  methods :{
      move : function( dir ){
          $emit( 'move', [-1,0] );
        //   switch( dir ){
        //       case 'up' :
                
        //   }
      }
  }
}
</script>

<style>

</style>
