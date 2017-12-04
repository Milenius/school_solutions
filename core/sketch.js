function setup() {
  
  createCanvas(windowWidth,windowHeight);
  background(255);
  cS = new coordSystem(width/2-250,100,500,500,[0,10],[0,10]);
  cS.addFuncGraph(testFunc);
  
}

function draw() {
  //noLoop();
  clear();
  
  cS.showSelf();
  
}

function testFunc(x){
  return Math.pow(x,2);  
}

