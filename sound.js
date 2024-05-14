
const WIDTH = 1500;
const HEIGHT = 1500;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;
let analyzer;
let bufferLength;

function handleError(err) {
    console.log("You must give access to your mic in order to proceed;")
}

// Audio
async function getAudio() {
    const stream = await navigator.mediaDevices.getUserMedia
    ({ audio: true}).catch(handleError);
    const audioCtx = new AudioContext();
    analyzer = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyzer);
    // how much data I want to collect
    analyzer.fftSize = 2 ** 10;
    // Pull the data off the audio
    //how many pieces of data are there?
    bufferLength = analyzer.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const frequencyData = new Uint8Array
    (bufferLength);
    drawTimeData(timeData);
    drawFrequency(frequencyData);
}

function drawTimeData(timeData) {
    // Inject the time data into our timeData array
    analyzer.getByteTimeDomainData(timeData)
    // Now that we have the data , lets turn it into something visual
    // 1) Clear the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // 2) Setup some canvas drawing
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ffc600";
    ctx.beginPath();
    // This will give us how big each slice will be
    const sliceWidth = WIDTH / bufferLength;
    let x = 0;
    timeData.forEach((data, i)=>{
        const v = data / 128;
        const y = (v * HEIGHT) / 2;
        // draw our lines
        if( i === 0) {
            ctx.moveTo(x, y)
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    });
    
    ctx.stroke()

    console.log(timeData);
    // Call itself as soon as possible
    requestAnimationFrame(()=> drawTimeData(timeData));
}

function drawFrequency(frequencyData) {
    // Get the frequency data into our frequencyData array
    analyzer.getByteTimeDomainData(frequencyData);
    console.log(frequencyData)
}

getAudio();