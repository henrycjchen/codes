/**
 * swipe 左右滑动手势
 * @param {Element} 元素，用于绑定事件
 * @param {Function} 回调函数
 *    @param {Number} 方向参数（-1：左，1：右）
 * example:
 *   swipe(this.$refs.slide, direction => {
 *     // todo
 *   }
 */
export function swipe(el, callback) {
  el.addEventListener(
    "touchstart",
    onStart
  );
  el.addEventListener(
    "touchend",
    onEnd
  );
  el.addEventListener(
    "touchmove",
    onMove
  );

  function onStart(e) {
    this.startTime = e.timeStamp;
    var touch = e.changedTouches[0];
    this.curdragX = this.dragStartX = touch.clientX;
    this.curdragY = this.dragStartY = touch.clientY;
    this.scrollerPos = window.pageYOffset;
  }
  function onMove(e) {
    var touch = e.changedTouches[0];
    var distanceX = Math.abs(touch.clientX - this.curdragX);
    var distanceY = Math.abs(touch.clientY - this.curdragY);
    if (distanceX > distanceY) e.preventDefault();
    this.curdragX = touch.clientX;
    this.curdragY = touch.clientY;
  }
  function onEnd(e) {
    var touch = e.changedTouches[0];
    const eventPosX = touch.clientX;
    const eventPosY = touch.clientY;
    const newOffsetX = this.dragStartX - eventPosX;
    const newOffsetY = this.dragStartY - eventPosY;
    if (
        Math.abs(newOffsetX) < Math.abs(newOffsetY) ||
        e.timeStamp - this.startTime > 900 ||
        Math.abs(newOffsetX) < 20 ||
        window.pageYOffset != this.scrollerPos
    ) {
      return;
    }
    if (newOffsetX < 0) {
      callback(-1);
    } else {
      callback(1);
    }
  }
}