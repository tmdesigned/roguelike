<template>
  <div id="app" class="container">
    <div class="controls"> 
        <div>Height: <input v-model="heightOfGrid" /></div>
        <div>Width: <input v-model="widthOfGrid" /></div>
        <div>Min Room Size: <input v-model="minRoomDimension" /></div>
        <div>Max # Rooms: <input v-model="maxRooms" /></div>
        <button v-on:click="update">Generate</button>
          <button v-on:click="addMonster">Add Monster</button></div>

    
    <div class="canvas">
        <div class="row" v-for="row in rows">
          <div class="cell" v-for="cell in row">
              <div class="cell-contents" :data-occupied="cell.occupied"></div>
          </div>
        </div>
    </div>
    <!-- closes #app -->
  </div>
</template>

<script>
import {MapNode} from './MapNode.class.js'

export default {
  name: 'app', 
  data: function(){
    return {
     widthOfGrid : 100,
     heightOfGrid : 100,
     minRoomDimension: 15,
     currentRooms : { number : 0 }, //object so as to share by ref through recursive funcs
     maxRooms: 25,
     hallwayWidth : 3,
     master : {},
     tree : {},
     rows : [],
     samples : [] 
    };
  },
  created : function(){
    this.init(); 
  },
  methods: {
     init : function(){
        this.rows = [];
        for ( var i = 0; i < this.heightOfGrid; i++ ){
           this.rows.push([]);
           for ( var l = 0; l < this.widthOfGrid; l++ ){
              this.rows[i].push({ occupied:false });
           }
        }
     },
     update : function(){
       this.init();
       this.minRoomDimension = parseInt( this.minRoomDimension );
       this.currentRooms = { number : 0 };
       this.maxRooms = parseInt( this.maxRooms );
       this.master = new MapNode( 0, 0, this.widthOfGrid, this.heightOfGrid, null );
       this.master.split( true, this.minRoomDimension, this.currentRooms, this.maxRooms );
       this.markRooms( this.master );
       this.markConnections( this.master ); 
     },
     markConnections : function( node ){
        for ( let child of node.children ){
           this.markConnections( child );
        }
        this.markConnection( node );
     },
     markRooms : function ( node ){
        if( node.children.length < 1 ){
           this.markRoom( node.innerX1, node.innerY1, node.innerX2, node.innerY2 );
           return;
        }
        for( let child of node.children ){
           this.markRooms( child );
        }
     },
     addMonster : function(){
        var options = this.findAllByType( "room" );
        var choice = options[ randInt( 0, options.length - 1 ) ];
        this.rows[ choice.x].splice( choice.y, 1, { "occupied" : "monster" });
       // this.rows[ choice.x ][ choice.y ] = { "occupied" : "monster" }
     },
     markRoom : function( x1, y1, x2, y2 ){
       for( var i = x1; i < x2; i++ ){
          for( var j = y1; j < y2; j++){
             this.rows[i][j] = {occupied:"room" };
          }
       } 
     },
     markConnection : function( node ){
       for( let connection of node.connections ){
          let passage = this.findPassage( node, connection );
          //console.log('Passage found: ',passage);
          this.markRoom( passage.x1, passage.y1, passage.x2, passage.y2 );
       } 
     },
     findAllByType : function( type ){
        var output = [];
         for ( var i = 0; i < this.heightOfGrid; i++ ){
           for ( var l = 0; l < this.widthOfGrid; l++ ){
              if( this.rows[i][l].hasOwnProperty('occupied') &&
                this.rows[i][l].occupied == type ){
                 output.push( { x: i, y: l } );
              }
           }
        }
        return output;
     },
     findHallwaysInArrays : function( a, b ){
        var passages = [];
        var sequential = 0;
        var sequentialSet = [];
        for( let i = 0; i < a.length; i++ ){
             if ( b.indexOf( a[i] ) != -1 ){
                sequential++;
                sequentialSet.push( a[i] );
             }else{
                sequential = 0;
                sequentialSet = [];
             }
           if( sequential >= this.hallwayWidth ){
              passages.push( sequentialSet );
              sequential = 0;
              sequentialSet = [];
           }
        }
        return passages;
     },
     findOccupiedRow: function ( start, end, crossStart, crossEnd, column ){
        //find any row/column with at least one occupied cell within bounding box
        //note its x1, x2, y1, y2 format
       var occupied = [];
       for( let i = start; i < end; i++ ){
          let occupiedRow = false;
          for( let j = crossStart; j < crossEnd; j++ ){
              let cell = column ? this.rows[j][i] : this.rows[i][j];
              if( cell.occupied ){
                 occupiedRow = true;
              }
          }
          if( occupiedRow ){
             occupied.push( i );
          }
       }
       return occupied;
     },
     findCompletelyOccupiedRow: function ( start, end, crossStart, crossEnd, column ){
        //find any row/column with EVERY occupied cell within bounding box
        //note its x1, x2, y1, y2 format
       var occupied = [];
       for( let i = start; i < end; i++ ){
          let occupiedRow = true;
          for( let j = crossStart; j < crossEnd; j++ ){
              let cell = column ? this.rows[j][i] : this.rows[i][j];
              if( !cell.occupied ){
                 occupiedRow = false;
              }
          }
          if( occupiedRow ){
             occupied.push( i );
          }
       }
       return occupied;
     },
     findPassage : function( a, b ) {
        
        //find all occupied x,y on a,b
        //find sequential group of 3 that they share
        //connect those 3
        
        let occupiedXInA = this.findOccupiedRow( a.x1, a.x2, a.y1, a.y2, false );
        let occupiedYInA = this.findOccupiedRow( a.y1, a.y2, a.x1, a.x2, true );
        let occupiedXInB = this.findOccupiedRow( b.x1, b.x2, b.y1, b.y2, false );
        let occupiedYInB = this.findOccupiedRow( b.y1, b.y2, b.x1, b.x2, true );
        let xHallways = this.findHallwaysInArrays( occupiedXInA, occupiedXInB );
        let yHallways = this.findHallwaysInArrays( occupiedYInA, occupiedYInB );
        if( xHallways.length ){
           let passage = xHallways[ randInt( 0, xHallways.length - 1 ) ];
           let boundsA = this.findCompletelyOccupiedRow( a.y1, a.y2, passage[0], passage[ passage.length - 1 ], true );
           let boundsB = this.findCompletelyOccupiedRow( b.y1, b.y2, passage[0], passage[ passage.length - 1 ], true );
           return { x1:  passage[0], y1: boundsA[boundsA.length - 1], x2 : passage[ passage.length - 1], y2: boundsB[0] };
        }else if( yHallways.length ) {
           let passage = yHallways[ randInt( 0, yHallways.length - 1 ) ];
           let boundsA = this.findCompletelyOccupiedRow( a.x1, a.x2,  passage[0], passage[ passage.length - 1 ], false );
           let boundsB = this.findCompletelyOccupiedRow( b.x1, b.x2, passage[0], passage[ passage.length - 1 ], false );
           return { x1 : boundsA[ boundsA.length - 1 ], y1 : passage[0], x2 : boundsB[ 0 ] , y2: passage[ passage.length - 1 ] };         
        }else{
           return false;
        }
     },
     distance : function(a,b){
       var dx = a[0] - b[0],
           dy = a[1] - b[1];
       return Math.sqrt(dx * dx + dy * dy);
     }
  }
}

function randInt(min,max){
  let r = Math.floor(Math.random()*(max-min+1)+min);
  return r;
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

.row{
   display:table-row;
   background-color:#eee;
}
.row:nth-child(even){
   background-color:#ddd;
}
.cell{
   display:table-cell;
}
.cell .cell-contents{
   padding:4px;
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
