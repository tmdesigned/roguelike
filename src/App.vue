<template>
  <div id="app" class="container">
    <div class="controls"> 
      <div class="d-pad">
        <div class="filler"></div>
        <div><button v-on:click="handleKey({keyCode:38})">UP</button></div>
        <div class="filler"></div>
        <div><button v-on:click="handleKey({keyCode:37})">LEFT</button></div>
        <div class="filler"></div>
        <div><button v-on:click="handleKey({keyCode:39})">RIGHT</button></div>
        <div class="filler"></div>
        <div><button v-on:click="handleKey({keyCode:40})">DOWN</button></div>
        <div class="filler"></div>
      </div>
</div>
    
        <Dungeon v-bind:widthOfGrid="widthOfGrid" v-bind:heightOfGrid="heightOfGrid" v-bind:minRoomDimension="minRoomDimension" v-bind:maxRooms="maxRooms" v-bind:hallwayWidth="hallwayWidth" ></Dungeon>
  
    <!-- closes #app -->
  </div>
</template>

<script>
import Dungeon from './components/Dungeon.vue'

// const store = new Vuex.Store({
//   state: {
//   }
// });


export default {
  name: 'app',
  data: function(){
    return{
      heightOfGrid : 100,
      widthOfGrid : 100,
      minRoomDimension : 15,
      maxRooms : 25,
      hallwayWidth : 3,
      ticks : 0
    }
  },
  components: {
    Dungeon
  },
  mounted : function(){
    window.addEventListener('keydown', (e) => {
      this.handleKey(e);
    });
    this.$eventHub.$on('tick', () => {
      this.ticks++;
    });
  },
  methods: {
    handleKey : function( e ){

      switch( e.keyCode ){
        case 38 :
          this.$eventHub.$emit('move', 'up' );
          this.$eventHub.$emit('tick');
          break;
        case 40 :
          this.$eventHub.$emit('move', 'down' );
          this.$eventHub.$emit('tick');
          break;
        case 37 :
          this.$eventHub.$emit('move', 'left' );
          this.$eventHub.$emit('tick');
          break;
        case 39 :
          this.$eventHub.$emit('move', 'right' );
          this.$eventHub.$emit('tick');
          break;
        default:
          break;
        
      }
    }
  }
}



</script>



<style>

body{
  margin: 0;
  padding: 0;
  background-color: #222;
}

.canvas {
    padding: 5px;
    background-color: #333;
}

.container{
   margin:1em auto;
   max-width:900px;
}

.container .controls{
   display:flex;
   flex-wrap:wrap;
   padding:.5em;
   margin:1em 0;
   background-color:#e5e5e5;
}

.container .controls > *{
   margin:1em;
   flex: 1 0 0px;
}

.d-pad {
    display: flex;
    flex-wrap: wrap;
    max-width: 200px;
}

.d-pad > div {
    flex: 1 0 calc( (100% - 3em) / 3 );
}

.d-pad button {
    width: 100%;
    height: 46px;
    border-radius: 3px;
}





</style>
