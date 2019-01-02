
const addon_shadow = (color) => {
    audioWave.WaveCtx.shadowColor = color;
    audioWave.WaveCtx.shadowOffsetX = 0;
    audioWave.WaveCtx.shadowOffsetY = 0;
    audioWave.WaveCtx.shadowBlur = 10;

}


const filter_curve = function (wave, col) {
    const coloumnHeight = wave.COLUMN_HEIGHT_RATE * wave.ByteData[col * wave.SAMPLE_OFFSET];

    const color = '#FFF';
    wave.WaveCtx.strokeStyle = color;

    // addon_shadow(color);
    wave.WaveCtx.beginPath();

    const horizontal = wave.WaveCanvas.height / 2;
    wave.WaveCtx.moveTo(col * wave.COLUMN_WIDTH, horizontal);

    wave.WaveCtx.quadraticCurveTo(
        col * wave.COLUMN_WIDTH + wave.COLUMN_WIDTH / 4, horizontal - coloumnHeight,
        col * wave.COLUMN_WIDTH + wave.COLUMN_WIDTH / 2, horizontal);
    wave.WaveCtx.quadraticCurveTo(
        col * wave.COLUMN_WIDTH + wave.COLUMN_WIDTH / 4 * 3, horizontal + coloumnHeight,
        col * wave.COLUMN_WIDTH + wave.COLUMN_WIDTH, horizontal);
    wave.WaveCtx.stroke();



}

const filter_stroke = function (wave, col) {

    const coloumnHeight = wave.COLUMN_HEIGHT_RATE * wave.ByteData[col * wave.SAMPLE_OFFSET];

    const coloumnMargin = 0;
    const color = '#FFF';
    var gradient = wave.WaveCtx.createLinearGradient(0, 0, 170, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // 用渐变进行填充
    wave.WaveCtx.lineWidth = 2;
    wave.WaveCtx.lineJoin = "round";
    wave.WaveCtx.strokeStyle = gradient;

    const _y = Wave.height - coloumnHeight;
    if (col == 0) {
        wave.WaveCtx.beginPath();
        wave.WaveCtx.moveTo(0, _y);
    }
    // console.log(col * COLUMN_WIDTH);
    wave.WaveCtx.lineTo(col * wave.COLUMN_WIDTH + wave.COLUMN_WIDTH / 2, _y);
}


const filter_rect_mirror = function (wave, col) {
    const coloumnHeight = wave.COLUMN_HEIGHT_RATE * wave.ByteData[col * wave.SAMPLE_OFFSET];
    const coloumnMargin = 4;
    const color = '#FFF';
    wave.WaveCtx.strokeStyle = color;

    wave.WaveCtx.strokeStyle = color;
    wave.addon_shadow(color);
    wave.WaveCtx.strokeRect(col * wave.COLUMN_WIDTH + coloumnMargin, wave.WaveCanvas.height / 2 + coloumnHeight / 2, 2, -coloumnHeight);

}


const filter_rect_mirror2 = function (wave, col) {
    // style_column_animate(col);
    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET

    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
    const coloumnMargin = 4;
    const color = '#FFF';
    const center_x = Wave.width / 2;
    const column_w = COLUMN_WIDTH / 2;
    wave.WaveCtx.strokeStyle = color;

    wave.WaveCtx.strokeStyle = color;
    addon_shadow(color);
    wave.WaveCtx.strokeRect(center_x + col * column_w + coloumnMargin, wave.WaveCanvas.height, column_w, -coloumnHeight);
    wave.WaveCtx.strokeRect(center_x - col * column_w + coloumnMargin, wave.WaveCanvas.height, column_w, -coloumnHeight);

}


let style_column_animate_data = [];
const addon_column_animate = function (wave, col) {

    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET

    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
    const coloumnMargin = 4;

    if (!style_column_animate_data[col] && coloumnHeight > COLUMN_HEIGHT_RATE * 200) {
        style_column_animate_data[col] = wave.WaveCanvas.height;

    }
    if (style_column_animate_data[col] !== null) {
        wave.WaveCtx.strokeStyle = "#AAA";
        // addon_shadow(`#FFF`);
        wave.WaveCtx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, style_column_animate_data[col], COLUMN_WIDTH - coloumnMargin, COLUMN_WIDTH - coloumnMargin);
        style_column_animate_data[col]--;
        if (style_column_animate_data[col] <= - COLUMN_WIDTH) {
            style_column_animate_data[col] = null;
        }
    }


}

const filter_rect = function (wave, col) {

    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET

    addon_column_animate(wave, col);
    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
    const coloumnMargin = 4;
    let topBlockY = coloumnHeight;
    const color = '#FFF';
    wave.WaveCtx.strokeStyle = color;
    addon_shadow(color);

    wave.WaveCtx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, wave.WaveCanvas.height, COLUMN_WIDTH - coloumnMargin, -coloumnHeight);
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

let top_row_y = [];
const filter_rect_top = function (wave, col) {
    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET

    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
    const coloumnMargin = 4;
    const color = '#FFF';
    wave.WaveCanvas.strokeStyle = color;
    addon_shadow(color);
    wave.WaveCtx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, wave.WaveCanvas.height - coloumnHeight, COLUMN_WIDTH - coloumnMargin, 10);
    let topBlockY = wave.WaveCanvas.height - coloumnHeight;
    const topcolor = 'yellow';
    if (topBlockY > 0 && (!top_row_y[col] || Math.abs(topBlockY) < Math.abs(top_row_y[col].y))) {
        if (!top_row_y[col]) top_row_y[col] = {};
        top_row_y[col].y = topBlockY;
        top_row_y[col].color = topcolor;
    }
    if (top_row_y[col]) {
        top_row_y[col].y += 1;
        wave.WaveCtx.strokeStyle = top_row_y[col].color;
        wave.WaveCtx.strokeRect(col * COLUMN_WIDTH + coloumnMargin, top_row_y[col].y, COLUMN_WIDTH - coloumnMargin, 4);

    }
}

const filter_block = function (wave, col) {

    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET


    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
    const rowHeight = 16;
    const rowMargin = 4;
    const coloumnMargin = 4;
    const rowCount = Math.round(coloumnHeight / rowHeight)
    for (let h = 0; h < rowCount; h++) {
        r = 0 + 16 * h;
        g = 0 + 16 * h;
        b = 0 + 16 * h;
        wave.WaveCtx.fillStyle = `rgb(${r},${g},${b})`;
        addon_shadow(`rgb(${r},${g},${b})`);
        wave.WaveCtx.fillRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height - h * rowHeight, COLUMN_WIDTH - coloumnMargin, rowHeight - rowMargin);
    }
}

const filter_block_pure = function (wave, col) {

    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET

    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
    const rowHeight = 16;
    const rowMargin = 4;
    const coloumnMargin = 4;
    const rowCount = Math.round(coloumnHeight / rowHeight)
    for (let h = 0; h < rowCount; h++) {
        wave.WaveCtx.fillStyle = `rgb(255,255,255)`;
        addon_shadow(`rgb(255,255,255)`);
        wave.WaveCtx.fillRect(col * COLUMN_WIDTH + coloumnMargin, Wave.height - h * rowHeight, COLUMN_WIDTH - coloumnMargin, rowHeight - rowMargin);
    }
}


const filter_block_colorful = function (wave, col) {
    const COLUMN_HEIGHT_RATE = wave.COLUMN_HEIGHT_RATE
    const COLUMN_WIDTH = wave.COLUMN_WIDTH
    const ByteData = wave.ByteData
    const SAMPLE_OFFSET = wave.SAMPLE_OFFSET


    const coloumnHeight = COLUMN_HEIGHT_RATE * ByteData[col * SAMPLE_OFFSET];
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
        wave.WaveCtx.fillStyle = color;
        addon_shadow(color);
        let height = Wave.height - h * rowHeight;
        wave.WaveCtx.fillRect(col * COLUMN_WIDTH + coloumnMargin, height, COLUMN_WIDTH - coloumnMargin, rowHeight - rowMargin);
        topBlockY = height;
    }
    if (topBlockY > 0 && (!top_row_y[col] || Math.abs(topBlockY) < Math.abs(top_row_y[col].y))) {
        if (!top_row_y[col]) top_row_y[col] = {};
        top_row_y[col].y = topBlockY;
        top_row_y[col].color = color;
    }
    if (top_row_y[col]) {
        top_row_y[col].y += 2;
        wave.WaveCtx.fillStyle = top_row_y[col].color;
        wave.WaveCtx.fillRect(col * COLUMN_WIDTH + coloumnMargin, top_row_y[col].y, COLUMN_WIDTH - coloumnMargin, rowHeight - 2 * rowMargin);

    }
}