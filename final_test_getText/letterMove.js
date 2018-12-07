// https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element


class letterMove {
  constructor(mx, my, element) {
    //mouse position
    this.mx = mx;
    this.my = my;
    //position of element
    this.x = 0;
    this.y = 0;

    //element
    this.element = element;
    //difference in position
    this.dx = 0;
    this.dy = 0;

    //variables
    this.posData = null;
  }

  //move in same direciton as mouse velocity
  //sine wave of position (so it returns back to original position)
  // 0 to 180 AKA 0 to PI
  // run() {
  // this.init();
  // this.step();
  // window.requestAnimationFrame(this.step);

  // }

  // init() {
  // this.posData = this.element.getBoundingClientRect();
  // this.x = this.posData.x;
  // this.y = this.posData.y;
  // //get tangent to movement
  // this.dx = this.mx - this.x;
  // this.dy = this.my - this.y;
  // }

  run() {
    this.posData = this.element.getBoundingClientRect();
    this.x = this.posData.x;
    this.y = this.posData.y;
    //get tangent to movement
    this.dx = this.mx - this.x;
    this.dy = this.my - this.y;
    let animate = (function() {
      console.log(this.x);
      //get animation frame
      let progressTime = +new Date() - this.startTime;
      //map 4 seconds of motion to full movement
      let eqnTime = mapRange(progressTime, 0, 4000, 0, Math.PI);
      //movement
      this.x = this.x + this.dx * Math.sin(eqnTime);
      this.y = this.y + this.dy * Math.sin(eqnTime);
      this.element.style.position = "absolute";
      this.element.style.left = this.x;
      this.element.style.top = this.y;


      // this.element.style = this.x + this.dx * Math.sin(eqnTime);
      //stop animatation when it returns to original position
      if (eqnTime <= Math.PI) {
        window.requestAnimationFrame(this.step);
      }
    })();

  }


}
