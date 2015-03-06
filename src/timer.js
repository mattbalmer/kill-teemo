var createjs = require('createjs');

// === Bar ===
var Bar = function Bar(left, top, right, bottom, color) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.color = color;

    this.height = bottom - top;
    this.width = right - left;

    this.border = new createjs.Shape();
    this.border.graphics.beginFill(color)
        .rect(left, top, 3, this.height)
        .rect(right - 3, top, 3, this.height)
        .rect(left, top, this.width, 3)
        .rect(left, bottom - 3, this.width, 3);

    this.fill = new createjs.Shape();
    this.update(.75);
};

Bar.prototype.addTo = function(stage) {
    stage.addChild(this.border);
    stage.addChild(this.fill);
};

Bar.prototype.removeFrom = function(stage) {
    stage.removeChild(this.border);
    stage.removeChild(this.fill);
};

Bar.prototype.update = function(percentage) {
    var left = this.left + 3,
        top = this.top + 3,
        width = this.width - 6,
        height = this.height - 6;

    percentage = Math.max(0, percentage);
    percentage = Math.min(1, percentage);

    this.fill.graphics.clear().beginFill(this.color)
        .rect(left, top, (width * percentage), height);
};

// === Timer ===
var Timer = function(duration, bar, onEnd) {
    this.duration = duration;
    this.onEnd = onEnd;
    this.bar = bar;
    this.elapsed = 0;

    this.start();
};

Timer.prototype.tick = function() {
    this.elapsed += 20;
    var pct = (this.duration - this.elapsed) / this.duration;
    this.bar.update(pct);

    if(pct <= 0) {
        this.onEnd();
    }
};

Timer.prototype.pause = function() {
    clearInterval(this.timer);
    this.timer = null;
};

Timer.prototype.reset = function() {
    this.pause();
    this.elapsed = 0;
};

Timer.prototype.start = function() {
    var tick = this.tick.bind(this);
    this.timer = setInterval(function() {
        tick();
    }, 20);
};

module.exports = {
    Bar: Bar,
    Timer: Timer
};