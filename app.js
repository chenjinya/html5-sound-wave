
var vConsole = new VConsole();

const Media = document.getElementById('Media');
const Wave = document.getElementById('Wave');
const LogMonitor = document.getElementById('LogMonitor');
let waveStyle = '';
Wave.width = document.body.clientWidth;
Wave.height = 200;
Media.crossOrigin = "anonymous";
Media.load();
Media.addEventListener('canplay', function () {

    window.AudioContext = window.AudioContext ? window.AudioContext : window.webkitAudioContext
    const audioCtx = new AudioContext(); // define

    let analyser = audioCtx.createAnalyser();
    let gainnode = audioCtx.createGain();

    // analyser.minDecibels = -90;
    // analyser.maxDecibels = -10;
    let source = audioCtx.createMediaElementSource(Media);
    // let source = audioCtx.createBufferSource();
    // loadSource("./test.mp3");
    source.connect(analyser);
    analyser.connect(gainnode);
    gainnode.connect(audioCtx.destination);
    console.log(audioCtx.destination);
    gainnode.gain.value = 1;
    // analyser.fftSize = 2048;
    // analyser.fftSize = 64;
    let byteDataCount = analyser.frequencyBinCount;
    let byteData = new Uint8Array(byteDataCount);

    //global constant
    const ctx = Wave.getContext("2d");
    const COLUMN_COUNT = 16;//列数
    analyser.fftSize = COLUMN_COUNT * 2;
    const SAMPLE_OFFSET = analyser.frequencyBinCount / COLUMN_COUNT;// COLUMN_COUNT;//采样率
    const COLUMN_WIDTH = (Wave.width / COLUMN_COUNT);
    const BYTE_MAX = 256;
    const COLUMN_HEIGHT_RATE = Wave.height / BYTE_MAX;
    console.log('canvas width', Wave.width, "column width", COLUMN_WIDTH, 'column count', COLUMN_COUNT, 'sample offset', SAMPLE_OFFSET)

    //global variable
    let open_stroke_effect = true;
    let open_byte_value = false;
    let wave_type = 'frequency';
    let top_row_y = [];

    const style_addon_shadow = function (color) {
        ctx.shadowColor = color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;

    }

    const style_rect_mirror = function (col) {
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const coloumnMargin = 4;
        const color = '#FFF';
        ctx.strokeStyle = color;

        ctx.strokeStyle = color;
        style_addon_shadow(color);
        ctx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height / 2 + coloumnHeight / 2, 2, -coloumnHeight);

        // style_addon_shadow(color);
    }

    let style_curve_offset = 0;
    const style_curve = function (col) {
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];

        const preColumnHeight = col - 1 >= 0 ? COLUMN_HEIGHT_RATE * byteData[(col - 1) * SAMPLE_OFFSET] : 0;
        const nexColumnHeight = col + 1 < COLUMN_COUNT ? COLUMN_HEIGHT_RATE * byteData[(col + 1) * SAMPLE_OFFSET] : 0;

        const coloumnMargin = 4;
        const color = '#FFF';
        ctx.strokeStyle = color;

        // style_addon_shadow(color);
        ctx.beginPath();
        const preY = Wave.height - (preColumnHeight);
        const nexY = Wave.height - (coloumnHeight);
        const curY = Wave.height - coloumnHeight;
        const horizontal = Wave.height / 2;
        ctx.moveTo(style_curve_offset + col * COLUMN_WIDTH, horizontal);

        ctx.quadraticCurveTo(
            style_curve_offset + col * COLUMN_WIDTH + COLUMN_WIDTH / 4, horizontal - coloumnHeight,
            style_curve_offset + col * COLUMN_WIDTH + COLUMN_WIDTH / 2, horizontal);
        ctx.quadraticCurveTo(
            style_curve_offset + col * COLUMN_WIDTH + COLUMN_WIDTH / 4 * 3, horizontal + coloumnHeight,
            style_curve_offset + col * COLUMN_WIDTH + COLUMN_WIDTH, horizontal);
        ctx.stroke();



    }

    const style_stroke = function (col) {
        open_stroke_effect = true;
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];

        const coloumnMargin = 0;
        const color = '#FFF';
        var gradient = ctx.createLinearGradient(0, 0, 170, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // 用渐变进行填充
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.strokeStyle = gradient;

        const _y = Wave.height - coloumnHeight;
        if (col == 0) {
            ctx.beginPath();
            ctx.moveTo(0, _y);
        }
        // console.log(col * COLUMN_WIDTH);
        ctx.lineTo(col * COLUMN_WIDTH + COLUMN_WIDTH / 2, _y);
        style_addon_shadow(color);



    }

    let style_column_animate_data = [];
    const style_column_animate = function (col) {

        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const coloumnMargin = 4;

        if (!style_column_animate_data[col] && coloumnHeight > COLUMN_HEIGHT_RATE * 200) {
            style_column_animate_data[col] = Wave.height;

        }
        if (style_column_animate_data[col] !== null) {
            ctx.strokeStyle = "#AAA";
            style_addon_shadow(`#FFF`);
            ctx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, style_column_animate_data[col], COLUMN_WIDTH - coloumnMargin, COLUMN_WIDTH - coloumnMargin);
            style_column_animate_data[col]--;
            if (style_column_animate_data[col] <= - COLUMN_WIDTH) {
                style_column_animate_data[col] = null;
            }
        }


    }

    const style_rect_mirror2 = function (col) {
        // style_column_animate(col);
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const coloumnMargin = 4;
        const color = '#FFF';
        const center_x = Wave.width / 2;
        const column_w = COLUMN_WIDTH / 2;
        ctx.strokeStyle = color;

        ctx.strokeStyle = color;
        style_addon_shadow(color);
        ctx.strokeRect(center_x + col * column_w + coloumnMargin, Wave.height, column_w, -coloumnHeight);
        ctx.strokeRect(center_x - col * column_w + coloumnMargin, Wave.height, column_w, -coloumnHeight);

    }

    const style_rect = function (col) {
        style_column_animate(col);
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const coloumnMargin = 4;
        let topBlockY = coloumnHeight;
        const color = '#FFF';
        ctx.strokeStyle = color;
        style_addon_shadow(color);

        ctx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height, COLUMN_WIDTH - coloumnMargin, -coloumnHeight);
        // if (topBlockY > 0 && (!top_row_y[col] || Math.abs(topBlockY) < Math.abs(top_row_y[col].y))) {
        //     if (!top_row_y[col]) top_row_y[col] = {};
        //     top_row_y[col].y = topBlockY;
        //     top_row_y[col].color = color;
        // }
        // if (top_row_y[col]) {
        //     top_row_y[col].y += 1;
        //     ctx.strokeStyle = top_row_y[col].color;
        //     ctx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height, COLUMN_WIDTH - coloumnMargin, - top_row_y[col].y);
        // }
    }


    const style_rect_top = function (col) {
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const coloumnMargin = 4;
        const color = '#FFF';
        ctx.strokeStyle = color;
        style_addon_shadow(color);
        ctx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height - coloumnHeight, COLUMN_WIDTH - coloumnMargin, 10);
        let topBlockY = Wave.height - coloumnHeight;
        const topcolor = 'yellow';
        if (topBlockY > 0 && (!top_row_y[col] || Math.abs(topBlockY) < Math.abs(top_row_y[col].y))) {
            if (!top_row_y[col]) top_row_y[col] = {};
            top_row_y[col].y = topBlockY;
            top_row_y[col].color = topcolor;
        }
        if (top_row_y[col]) {
            top_row_y[col].y += 1;
            ctx.strokeStyle = top_row_y[col].color;
            ctx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, top_row_y[col].y, COLUMN_WIDTH - coloumnMargin, 4);

        }
    }

    const style_block = function (col) {
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const rowHeight = 16;
        const rowMargin = 4;
        const coloumnMargin = 4;
        const rowCount = Math.round(coloumnHeight / rowHeight)
        for (let h = 0; h < rowCount; h++) {
            r = 0 + 16 * h;
            g = 0 + 16 * h;
            b = 0 + 16 * h;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            style_addon_shadow(`rgb(${r},${g},${b})`);
            ctx.fillRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height - h * rowHeight, COLUMN_WIDTH - coloumnMargin, rowHeight - rowMargin);
        }
    }

    const style_block_pure = function (col) {
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const rowHeight = 16;
        const rowMargin = 4;
        const coloumnMargin = 4;
        const rowCount = Math.round(coloumnHeight / rowHeight)
        for (let h = 0; h < rowCount; h++) {
            ctx.fillStyle = `rgb(255,255,255)`;
            style_addon_shadow(`rgb(255,255,255)`);
            ctx.fillRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height - h * rowHeight, COLUMN_WIDTH - coloumnMargin, rowHeight - rowMargin);
        }
    }


    const style_block_colorful = function (col) {
        const coloumnHeight = COLUMN_HEIGHT_RATE * byteData[col * SAMPLE_OFFSET];
        const rowHeight = 16;
        const rowMargin = 2;
        const coloumnMargin = 2;
        const rowCount = Math.round(coloumnHeight / rowHeight)
        const maxRowCount = Math.floor(Wave.height / rowHeight)
        const colorByte = 256 / rowCount;
        // console.log('color byte', colorByte);
        const R = 250;
        const G = 180;
        const B = 0;
        let r = 0, g = G, b = B;
        let topBlockY = 0;
        let color = 'red';
        for (let h = 0; h < rowCount; h++) {
            r = 0 + colorByte * h;
            if (r > R) {
                r = R;
                g = g - colorByte * (rowCount - h);
            } else {
                g = G;
            }
            if (h == maxRowCount - 1) {
                r = R;
                g = 0;
            }
            b = B;
            color = `rgb(${r},${g},${b})`;
            ctx.fillStyle = color;
            style_addon_shadow(color);
            let height = Wave.height - h * rowHeight;
            ctx.fillRect(col * COLUMN_WIDTH + coloumnMargin, height, COLUMN_WIDTH - coloumnMargin, rowHeight - rowMargin);
            topBlockY = height;
        }
        if (topBlockY > 0 && (!top_row_y[col] || Math.abs(topBlockY) < Math.abs(top_row_y[col].y))) {
            if (!top_row_y[col]) top_row_y[col] = {};
            top_row_y[col].y = topBlockY;
            top_row_y[col].color = color;
        }
        if (top_row_y[col]) {
            top_row_y[col].y += 2;
            ctx.fillStyle = top_row_y[col].color;
            ctx.fillRect(col * COLUMN_WIDTH + coloumnMargin, top_row_y[col].y, COLUMN_WIDTH - coloumnMargin, rowHeight - 2 * rowMargin);

        }
    }

    const raf = function () {
        ctx.lineWidth = 1;
        ctx.clearRect(0, 0, Wave.width, Wave.height)
        if (wave_type == 'wave') {
            analyser.getByteTimeDomainData(byteData);
        } else {
            analyser.getByteFrequencyData(byteData);
        }

        for (let i = 0; i < COLUMN_COUNT; i++) {
            switch (waveStyle) {
                case 'stroke':
                    // style_stroke(i);
                    break;
                case 'curve':
                    style_curve(i);
                    break;
                case 'rect mirror':
                    style_rect_mirror(i);
                    break;
                case 'rect mirror2':
                    style_rect_mirror2(i);
                    break;
                case 'rect':
                    style_rect(i);
                    break;
                case 'rect top':
                    style_rect_top(i);
                    break;
                case 'block':
                    style_block(i);
                    break;
                case 'block colorful':
                    style_block_colorful(i);
                    break;
                case 'block pure':
                    style_block_pure(i);
                    break;

                default:
                // style_rect_mirror2(i);
            }

            if (open_stroke_effect) {
                style_stroke(i);
            }

            // rate height
            open_byte_value && ctx.strokeText('' + byteData[i * SAMPLE_OFFSET], i * COLUMN_WIDTH, Wave.height - COLUMN_HEIGHT_RATE * byteData[i * SAMPLE_OFFSET] + 20);
        }
        if (open_stroke_effect) {
            ctx.stroke();
        }

        requestAnimationFrame(function () {
            raf();
        });
    };


    raf();
})
