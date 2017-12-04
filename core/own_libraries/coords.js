var coordSystemArray = [];

function coordSystem(x,y,width,height,xInterval,yInterval){
    
  this.x = x || 0;
  this.y = y || 0;
  
  this.width  = width  || 200;
  this.height = height || 200;
  
  this.xInterval = xInterval ||              [0, 10];
  this.yInterval = yInterval || xInterval || [0, 10];
  
  this.xLabel = "X";
  this.yLabel = "Y";
  
  this.axisTextPadding = 20;
  
  this.funcGraphs = [];
  
  this.drawHelpLines = true;
  
  this.mode = 'binIntervals';
  
  this.n_input;
  this.pi_select;
  this.n;
  this.pi = 1.96;
  
  this.showSelf = function(){
    strokeWeight(2);
    push();
    translate(this.x, this.y);
    
    switch (this.mode) {
      case 'graphs':
        if (this.funcGraphs.length != 0 && this.mode == 'graphs'){
          for (var i = 0; i < this.funcGraphs.length; i++){
            drawFunction(this.funcGraphs[i]);    
          }
        }
        break;
      case 'binIntervals':
        this.xInterval = [0,1];
        this.yInterval = [0,1];
        
        this.xLabel = "p";
        this.yLabel = "h";
        
        if (typeof this.n_input == 'undefined'){
          this.n_input = createInput(100);
          this.n_input.position(this.x, this.y + this.height + this.axisTextPadding*3);
        }
        if (typeof this.pi_select == 'undefined'){
          this.pi_select = createSelect();
          this.pi_select.position(this.x, this.y + this.height + this.axisTextPadding*6);
          this.pi_select.size(this.n_input.width/3,this.n_input.height);
          this.pi_select.option("99%");
          this.pi_select.option("95%");
          this.pi_select.option("90%");
        }
        this.n = this.n_input.value();
        
        switch (this.pi_select.value()) {
          case "99%":
            this.pi = 2.58;
            break;
          case "95%":
            this.pi = 1.96;
            break;
          case "90%":
            this.pi = 1.64;
            break;
          default:
            this.pi = 1.96;
        }
        
        strokeWeight(1);
        for (var i = 0; i <= 1; i+=0.01){
          
          var cInterval = confInterval(this.n,i,this.pi);
          var x1 = (cInterval[0] * (this.width/1));
          var x2 = (cInterval[1] * (this.width/1));
          var y = this.height - i*(this.height/1);
          
          if (x1 < 0){
            x1 = 0;
          }
          if (x2 > this.width){
            x2 = this.width;
          }
          
          line(x1,y,x2,y);
        }
        
        textAlign(RIGHT,CENTER);
        textSize(15);
        text("N: ",this.n_input.x-this.x,this.n_input.y-this.y+this.n_input.height/2);
        text("Sicherheitswahrscheinlichkeit: ",this.pi_select.x-this.x,this.pi_select.y-this.y+this.pi_select.height/2);
        textAlign(CENTER,CENTER);
        text("N = "+str(this.n),this.width/2,this.height/12);
        text("Sicherheitswahrscheinlichkeit: "+str(this.pi_select.value()),this.width/2,0-this.height/12);
        break;
      default:
        // code
    }
    
    
    strokeWeight(2);
    line(0, 0, 0, this.height);
    line(0, this.height, this.width, this.height);
    
    textSize(15);
    textAlign(CENTER,CENTER);
    
    text(this.xLabel, this.width + this.axisTextPadding, this.height);
    text(this.yLabel, 0, 0 - this.axisTextPadding);
    
    var n_mouseX = mouseX - this.x;
    var n_mouseY = mouseY - this.y;
    
    if (n_mouseX >= 0 && n_mouseX <= this.width && n_mouseY >= 0 && n_mouseY <= this.height){
      textAlign(LEFT,BOTTOM);
      text(str((n_mouseX/this.width*this.xInterval[1]).toFixed(2)) +" "+ str((this.yInterval[1]-n_mouseY/this.height*this.yInterval[1]).toFixed(2)),n_mouseX,n_mouseY);
      strokeWeight(1);
      stroke(0,60);
      line(n_mouseX,n_mouseY,0,n_mouseY);
      line(n_mouseX,n_mouseY,n_mouseX,this.height);
      
    }
    
    strokeWeight(2);
    stroke(0,100);
    textAlign(CENTER,CENTER);
    for (var i = 0; i <= 10; i++){
      var x = 0+((this.width/10)*i); 
      line(x, this.height+5, x, this.height-5);
      text((i*(this.xInterval[1]/10)).toFixed(1), x, this.height + this.axisTextPadding);
      
      var y = 0+((this.height/10)*i);
      line(-5, y, 5, y);
      text((this.yInterval[1]-(i*(this.yInterval[1]/10))).toFixed(1), 0 - this.axisTextPadding, y);
      
      if(this.drawHelpLines){
        strokeWeight(1);
        stroke(0,60);
        line(x, this.height, x, 0);
        line(0, y, this.width, y);
      }
    }
    
    pop();
  }
  
  this.addFuncGraph = function(funcGraph){
    this.funcGraphs.push(funcGraph)  
  }
  
  this.refreshXInterval = function(n_xInterval){
    this.xInterval = n_xInterval;
  }
  
  this.refreshYInterval = function(n_yInterval){
    this.yInterval = n_yInterval;
  }
  
  coordSystemArray.push(this);
  
  
}

function drawFunction(func){
  var curCS = coordSystemArray[0];
  beginShape();
  noFill();
  for (var i = curCS.xInterval[0]; i <= curCS.xInterval[1]; i += ((curCS.xInterval[1]-curCS.xInterval[0])/100)){
    
    var x = i * (curCS.width/(curCS.xInterval[1] - curCS.xInterval[0]));
    var y = (curCS.height - (func(i)*(curCS.height/(curCS.yInterval[1] - curCS.yInterval[0]))) ) ;
    
    if(y <= curCS.height+2 && y >= -2){
      vertex(x,y);
    }
      
  }
  endShape();
  fill(0);
}

function confInterval(argN,argH,safeProb){
  return [argH - (safeProb * sqrt( (argH*(1-argH))/(argN))),argH + (safeProb * sqrt( (argH*(1-argH))/(argN)))]
}