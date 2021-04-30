var canvas = document.querySelector('canvas');
var statusText = document.querySelector('#statusText');

statusText.addEventListener('click', function() {
  statusText.textContent = 'Getting colours...🌈';
  colours = [];
  colourSensor.connect()
  .then(() => colourSensor.startNotificationsColourMeasurement().then(handleColours))
  .catch(error => {
    statusText.textContent = error;
  });
});

function handleColours(colourMeasurement) {
  colourMeasurement.addEventListener('characteristicvaluechanged', event => {
      console.log(event)
    var colourMeasurement = colourSensor.parseColor(event.target.value);
    var red = colourMeasurement[2];
    var green = colourMeasurement[1];
    var blue = colourMeasurement[0];

    console.log(red+" "+green+" "+blue);
    var ctx = canvas.getContext("2d");
    console.log("rgb("+red+","+green+","+blue+")")
    ctx.fillStyle = "rgb("+red+","+green+","+blue+")";

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //statusText.innerHTML = colourMeasurement.heartRate;
    //colours.push(colourMeasurement.heartRate);
    //drawWaves();
  });
}

/*
var colours = [];
var mode = 'bar';

canvas.addEventListener('click', event => {
  mode = mode === 'bar' ? 'line' : 'bar';
  drawWaves();
});

function drawWaves() {
  requestAnimationFrame(() => {
    canvas.width = parseInt(getComputedStyle(canvas).width.slice(0, -2)) * devicePixelRatio;
    canvas.height = parseInt(getComputedStyle(canvas).height.slice(0, -2)) * devicePixelRatio;

    var context = canvas.getContext('2d');
    var margin = 2;
    var max = Math.max(0, Math.round(canvas.width / 11));
    var offset = Math.max(0, colours.length - max);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#00796B';
    if (mode === 'bar') {
      for (var i = 0; i < Math.max(colours.length, max); i++) {
        var barHeight = Math.round(colours[i + offset ] * canvas.height / 200);
        context.rect(11 * i + margin, canvas.height - barHeight, margin, Math.max(0, barHeight - margin));
        context.stroke();
      }
    } else if (mode === 'line') {
      context.beginPath();
      context.lineWidth = 6;
      context.lineJoin = 'round';
      context.shadowBlur = '1';
      context.shadowColor = '#333';
      context.shadowOffsetY = '1';
      for (var i = 0; i < Math.max(colours.length, max); i++) {
        var lineHeight = Math.round(colours[i + offset ] * canvas.height / 200);
        if (i === 0) {
          context.moveTo(11 * i, canvas.height - lineHeight);
        } else {
          context.lineTo(11 * i, canvas.height - lineHeight);
        }
        context.stroke();
      }
    }
  });
}

window.onresize = drawWaves;

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    drawWaves();
  }
});*/