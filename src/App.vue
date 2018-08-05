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
  }
}
</script>

<style>
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
