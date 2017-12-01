var coordSystemArray = [];

function coordSystem(x,y,width,height,xInterval,yInterval){
    
  this.x = x || 0;
  this.y = y || 0;
  
  this.width  = width  || 200;
  this.height = height || 200;
  
  this.xInterval = xInterval ||              [0, 10];
  this.yInterval = yInterval || xInterval || [0, 10]; //Noch nicht wirklich implementiert!!!
  
  this.axisTextPadding = 20;
  
  this.funcGraphs = [];
      
  this.showSelf = function(){
    push();
    translate(this.x, this.y);
    
    if (this.funcGraphs.length != 0){
      for (var i = 0; i < this.funcGraphs.length; i++){
        drawFunction(this.funcGraphs[i]);    
      }
    }
    
    line(0, 0, 0, this.height);
    line(0, this.height, this.width, this.height);
    
    
    textSize(15);
    textAlign(CENTER,CENTER);
    text(str(this.xInterval[0]), 0, this.height + this.axisTextPadding);
    text(str(this.xInterval[1]), this.width, this.height + this.axisTextPadding);
    
    text(str(this.yInterval[0]), 0 - this.axisTextPadding, this.height);
    text(str(this.yInterval[1]), 0 - this.axisTextPadding, 0);
    
    text("X", this.width + this.axisTextPadding, this.height);
    text("Y", 0, 0 - this.axisTextPadding);
    
    pop();
    
    //ellipse(50,50,50);
  }
  
  this.addFuncGraph = function(funcGraph){
    this.funcGraphs.push(funcGraph)  
  }
  
  coordSystemArray.push(this);
}

function drawFunction(func){
  var curCS = coordSystemArray[0];
  curCS.yInterval[1] = func(curCS.xInterval[1]);
  beginShape();
  noFill();
  for (var i = curCS.xInterval[0]; i <= curCS.xInterval[1]; i += 0.1){
    var x = map(i, curCS.xInterval[0], curCS.xInterval[1], 0, curCS.width);
    var y = map(func(i),func(curCS.xInterval[0]),func(curCS.xInterval[1]),curCS.height,0);
    //var y = map(func(i), 0, func(curCS.xInterval[1]), curCS.height + (curCS.height/curCS.yInterval[1])*5, 0);
    
    if(y <= curCS.height){
      vertex(x,y);
    }
      
  }
  endShape();
  fill(0);
}