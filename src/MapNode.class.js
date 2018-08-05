
export class MapNode{
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
    for( let node of nodes ){
       if( !this.hasConnection( node ) ){
          this.connections.push( node );
       }
    }
  }
  
  MapNode.prototype.hasConnection = function( node ){
    for( let connection of this.connections ){
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
  }