let userNavigation = [];
let touchStarted = false;
const $cvs = $("#cvs");

const getPointerEvent = function(event) {
    return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
};

$cvs.on("touchstart mousedown", function(event){
  event.preventDefault();
  touchStarted = true;
  const pointer = getPointerEvent(event);
  userNavigation = [pointer.pageX - $cvs.offset().left, pointer.pageY - $cvs.offset().top];
});

$cvs.on("touchend mouseup touchcancel click", function(event){
  event.preventDefault();
  touchStarted = false;
  const pointer = getPointerEvent(event);
  userNavigation = [pointer.pageX - $cvs.offset().left, pointer.pageY - $cvs.offset().top];
});

$cvs.on("touchmove mousemove", function(event){
  event.preventDefault();
  if(touchStarted){
    const pointer = getPointerEvent(event);
    userNavigation = [pointer.pageX - $cvs.offset().left, pointer.pageY - $cvs.offset().top];
  }
});
