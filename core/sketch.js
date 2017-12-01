function setup() {
  createCanvas(windowWidth,windowHeight);
  background(255);
  cS = new coordSystem(100,100,500,500);
  cS.addFuncGraph(testFunc);
  cS.addFuncGraph(testFunc2);
}

function draw() {
  noLoop();
  strokeWeight(3);
  cS.showSelf();
}

function testFunc(x){
  return Math.pow(x,2);    
}

function testFunc2(x){
  return Math.pow(x,3);    
}
