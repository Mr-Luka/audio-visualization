
const WIDTH = 1500;
const HEIGHT = 1500;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;
let analyzer;

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
    const timeData = new Uint8Array(analyzer.frequencyBinCount);
    console.log(timeData)
}

getAudio();