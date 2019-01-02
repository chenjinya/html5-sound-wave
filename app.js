
const vConsole = new VConsole();
window.AudioContext = window.AudioContext ? window.AudioContext : window.webkitAudioContext
class AudioWave {

    constructor() {
        this.MediaSource = null
        this.WaveCanvas = null
        this.AudioCtx = null
        this.WaveCtx = null
        this.Analyser = null
        this.Gainnode = null
        this.ByteData = null
        this.BYTE_MAX = 256
        this.COLUMN_COUNT = 16 //列数
        this.SAMPLE_OFFSET = 0
        this.COLUMN_WIDTH = 0
        this.COLUMN_HEIGHT_RATE = 0

        this.open_stroke_effect = true;
        this.open_byte_value = false;
        this.wave_type = 'frequency';
        this.filter = null;

        this.initAudioCtx();
        this.initWaveCtx();
        this.raf();

    }
    initWaveCtx() {
        this.WaveCanvas = document.getElementById('Wave');
        this.WaveCtx = this.WaveCanvas.getContext("2d");
        Wave.width = document.body.clientWidth;
        Wave.height = 200;
        this.COLUMN_WIDTH = (Wave.width / this.COLUMN_COUNT);
        this.COLUMN_HEIGHT_RATE = Wave.height / this.BYTE_MAX;
    }

    initAudioCtx() {

        this.MediaSource = document.getElementById('Media');
        Media.crossOrigin = "anonymous";
        Media.load();

        this.AudioCtx = new AudioContext()
        let analyser = this.AudioCtx.createAnalyser()
        let gainnode = this.AudioCtx.createGain()
        let source = this.AudioCtx.createMediaElementSource(this.MediaSource);
        // load from local
        // let source = audioCtx.createBufferSource();
        // loadSource("./test.mp3");
        source.connect(analyser);
        analyser.connect(gainnode);
        analyser.fftSize = this.COLUMN_COUNT * 2;
        gainnode.connect(this.AudioCtx.destination);
        gainnode.gain.value = 1;
        let byteDataCount = analyser.frequencyBinCount;
        this.Analyser = analyser
        this.Gainnode = gainnode
        this.ByteData = new Uint8Array(byteDataCount);
        this.SAMPLE_OFFSET = analyser.frequencyBinCount / this.COLUMN_COUNT;
    }

    addon_shadow(color) {
        this.WaveCtx.shadowColor = color;
        this.WaveCtx.shadowOffsetX = 0;
        this.WaveCtx.shadowOffsetY = 0;
        this.WaveCtx.shadowBlur = 10;

    }

    style_stroke(col) {
        this.open_stroke_effect = true;
        const coloumnHeight = this.COLUMN_HEIGHT_RATE * this.ByteData[col * this.SAMPLE_OFFSET];

        const coloumnMargin = 0;
        const color = '#FFF';
        var gradient = this.WaveCtx.createLinearGradient(0, 0, 170, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // 用渐变进行填充
        this.WaveCtx.lineWidth = 2;
        this.WaveCtx.lineJoin = "round";
        this.WaveCtx.strokeStyle = gradient;

        const _y = Wave.height - coloumnHeight;
        if (col == 0) {
            this.WaveCtx.beginPath();
            this.WaveCtx.moveTo(0, _y);
        }
        // console.log(col * COLUMN_WIDTH);
        this.WaveCtx.lineTo(col * this.COLUMN_WIDTH + this.COLUMN_WIDTH / 2, _y);
        this.addon_shadow(color);
    }

    setFilter(fn) {
        this.filter = fn;
    }

    raf() {
        this.WaveCtx.lineWidth = 1;
        this.WaveCtx.clearRect(0, 0, this.WaveCanvas.width, this.WaveCanvas.height)
        if (this.wave_type == 'wave') {
            this.Analyser.getByteTimeDomainData(this.ByteData);
        } else {
            this.Analyser.getByteFrequencyData(this.ByteData);
        }
        for (let i = 0; i < this.COLUMN_COUNT; i++) {
            if (this.filter) {
                this.filter(this, i);
            } else {
                this.style_stroke(i);
            }
        }
        if (!this.filter) {
            this.WaveCtx.stroke();
        }
        requestAnimationFrame(() => {
            this.raf();
        });
    };



}


let audioWave = null;
audioWave = new AudioWave();
audioWave.MediaSource.play();