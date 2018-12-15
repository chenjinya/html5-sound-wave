


const loadSource = function (url, callback, errorCallback) {
    var loggedError = false;
    var self = this;
    let buffer = null;
    var errorTrace = new Error().stack;

    if (url != undefined && url != "") {
        var request = new XMLHttpRequest();
        request.addEventListener('progress', function (evt) {
            console.log(evt);
        }, false);
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function () {
            if (request.status == 200) {
                callback && callback(request.response);

            }
            else {
                console.error(request);
            }
        };

        // if there is another error, aside from 404...
        request.onerror = function (e) {
            console.error(e);
        };

        request.send();
    }
    else if (this.file != undefined) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function () {
            callback && callback(request.response);
        };
        reader.onerror = function (e) {
            console.error(e);
        };
        reader.readAsArrayBuffer(this.file);
    }
};
