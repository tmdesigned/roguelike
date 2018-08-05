<template>
  <div id="app" class="container">
    <div class="controls"> 
        <div>Height: <input v-model="heightOfGrid" /></div>
        <div>Width: <input v-model="widthOfGrid" /></div>
        <div>Min Room Size: <input v-model="minRoomDimension" /></div>
        <div>Max # Rooms: <input v-model="maxRooms" /></div>
        <div>Hallway Width: <input v-model="hallwayWidth" /></div>

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
      hallwayWidth : 3
    }
  },
  components: {
    Dungeon
  },
  mounted : function(){
    window.addEventListener('keydown', (e) => {
      console.log('h');
      this.handleKey(e);
    });
  },
  methods: {
    handleKey : function( e ){

      switch( e.keyCode ){
        case 38 :
          this.$eventHub.$emit('move', 'up' );
          break;
        case 40 :
          this.$eventHub.$emit('move', 'down' );
          break;
        case 37 :
          this.$eventHub.$emit('move', 'left' );
          break;
        case 39 :
          this.$eventHub.$emit('move', 'right' );
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







</style>
