class MapNode{
   constructor( x1, y1, x2, y2, parent ){
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.innerX1;
      this.innerY1;
      this.innerX2;
      this.innerY2;
      this.children = [];
      this.connections = [];
      this.parent = parent;
   }
}

MapNode.prototype.carveInner = function( minRoomDimension ){
   let deltaY = this.y2 - this.y1;
   let deltaX = this.x2 - this.x1;
   if ( deltaY < minRoomDimension + 4 ){
      this.innerY1 = this.y1;
      this.innerY2 = this.y2;
   }else{
      this.innerY1 = randInt( this.y1, this.y1 + ( .3 * deltaY ) );
      this.innerY2 = randInt( this.y2 - ( .3 * deltaY ), this.y2 );
   }
   if ( deltaX < minRoomDimension + 4 ){
      this.innerX1 = this.x1;
      this.innerX2 = this.x2;
   }else{
      this.innerX1 = randInt( this.x1, this.x1 + ( .3 * deltaX ) );
      this.innerX2 = randInt( this.x2 - ( .3 * deltaX ), this.x2 );
   }
}

MapNode.prototype.connect = function(){
   if( this.parent != null ){
         let thisNode = this;
         let nodes = this.parent.children.filter( function(i){ 
            //filter out this child, can't compare memory due to filter copy
            return !( i.x1 == thisNode.x1 &&
                 i.x2 == thisNode.x2 &&
                 i.y1 == thisNode.y1 &&
                 i.y2 == thisNode.y2 );
         } );
         this.connectToNodes( nodes );
   }
}

MapNode.prototype.connectToNodes = function( nodes ){
   for( node of nodes ){
      if( !this.hasConnection( node ) ){
         this.connections.push( node );
      }
   }
}

MapNode.prototype.hasConnection = function( node ){
   for( connection of this.connections ){
      if ( connection == node ){
         return true;
      }
   }
   return false;
}

MapNode.prototype.split = function( horizontal, minRoomDimension, current, max ){
   horizontal = horizontal || false;
   minRoomDimension = minRoomDimension || 10;
   current = current || { number : 0 };
   max = max || 25;
   let dim = horizontal ? 'x' : 'y';
   let alt = horizontal ? 'y' : 'x';

   let axis = randInt( this[ dim + '1' ] + minRoomDimension, this[ dim + '2' ] - minRoomDimension - 1 ); 

   //console.log( 'Room (', this.x1,',', this.y1,'),(',this.x2,',',this.y2,') splitting on ',dim,'axis at ',axis);
      
   //split if enough room on either side (happens until limits overlap)
   if( this[ dim + '1' ] + minRoomDimension <= axis &&
      this[ dim + '2' ] - minRoomDimension - 1 >= axis && 
      current.number + 1 < max ){
      
      //Can't use direct constructor as we don't know if primary dimension is x or y
      //This is also a little helpful for visualizing
      let first = new MapNode( null, null, null, null, this );
      let second = new MapNode( null, null, null, null, this );
      first[ dim + '1' ] = this[ dim + '1' ];
      first[ alt + '1' ] = this[ alt + '1' ];
      first[ dim + '2' ] = axis;
      first[ alt + '2' ] = this[ alt + '2' ];
      second[ dim + '1' ] = axis + 1;
      second[ alt + '1' ] = this[ alt + '1' ];
      second[ dim + '2' ] = this[ dim + '2' ];
      second[ alt + '2' ] = this[ alt + '2' ];
      
      this.children.push( first );
      this.children.push( second );
      current.number++;
      first.split( !horizontal, minRoomDimension, current, max );
      second.split( !horizontal, minRoomDimension, current, max );
      this.connect();
   }else{
      this.carveInner( minRoomDimension );
      this.connect();
   }
}
   


function randInt(min,max){
   let r = Math.floor(Math.random()*(max-min+1)+min);
   return r;
};

new Vue({
   el: '#app',
   data: {
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
         for ( child of node.children ){
            this.markConnections( child );
         }
         this.markConnection( node );
      },
      markRooms : function ( node ){
         if( node.children.length < 1 ){
            this.markRoom( node.innerX1, node.innerY1, node.innerX2, node.innerY2 );
            return;
         }
         for( child of node.children ){
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
        for( connection of node.connections ){
           let passage = this.findPassage( node, connection );
           //console.log('Passage found: ',passage);
           //this.markRoom( passage.x1, passage.y1, passage.x2, passage.y2 );
        } 
      },
      findAllByType : function( type ){
         var output = [];
          for ( var i = 0; i < this.heightOfGrid; i++ ){
            var col = [];
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
            this.markRoom( passage[0], boundsA[boundsA.length - 1], passage[ passage.length - 1], boundsB[0]);
         }else if( yHallways.length ) {
            let passage = yHallways[ randInt( 0, yHallways.length - 1 ) ];
            let boundsA = this.findCompletelyOccupiedRow( a.x1, a.x2,  passage[0], passage[ passage.length - 1 ], false );
            let boundsB = this.findCompletelyOccupiedRow( b.x1, b.x2, passage[0], passage[ passage.length - 1 ], false );
            this.markRoom( boundsA[ boundsA.length - 1 ], passage[0], boundsB[ 0 ] , passage[ passage.length - 1 ] );         
         }else{
            return false;
         }
         return true;
      },
      distance : function(a,b){
        var dx = a[0] - b[0],
            dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
      }
   }
});