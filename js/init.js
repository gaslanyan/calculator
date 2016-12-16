$(function () {
    // attach event listeners to the buttons
    var screen = $(".screen"), operators = ["+", "-", "/", "*", "."];
    var isCreated = false;

    $.fn.valueButton = function () {
        var val = $(this).text(),
            x = $('#arrow').nextAll('.screen-input:last-child').attr('id').split('-')[2];
        if (x > 4) {
            $.fn.clearButton();
        }
        var screen_x = $('#screen-input-' + x);
        if (screen_x.find('.answer').text() !== "") {

            if (!isCreated) {
                var content_clone = screen_x.clone();
                content_clone.each(function () {
                    var id = $(this).attr('id').split('-')[0] + '-' + $(this).attr('id').split('-')[1] + "-" + (parseInt(x) + 1);
                    $(this).attr('id', id);
                    $(this).find('.question').text('');
                    $(this).find('.answer').text('');
                    content_clone.appendTo(screen);
                    screen_x = $('#screen-input-' + (parseInt(x) + 1));
                    isCreated = true;
                });
            }
        }

        var input = screen_x.find('.question').text(),
            lastVal = input.charAt(input.length - 1);
// check to see if the button is an operator and if it is a repeat
        if (operators.indexOf(val) !== -1 && val === lastVal) {
            return;
        }

// if it's a number or non-repeat operator, append it to the input
        screen_x.find('.question').text(input + val);
    };


// calcButton
// handles the action of the equals button
    $.fn.calcButton = function () {

        var result,
            x = $('#arrow').nextAll('.screen-input:last-child').attr('id').split('-')[2],
            screen_x = $('#screen-input-' + x),
            p_log = /log\(\d+\)/g,
            p_ln = /ln\(\d+\)/g,
            p_sin = /sin\(\d+\)/g,
            p_cos = /cos\(\d+\)/g,
            p_tg = /tan\(\d+\)/g,
            p_asin = /^asin\(\d+\)/g,
            p_acos = /^acos\(\d+\)/g,
            p_atg = /^atan\(\d+\)/g,
            p_dig = /\d+\^\d+/g,
            p_mode = /\d+\%\d+/g,
            p_minus = /\(\-\d+\)/g,

            value = screen_x.text();

        if (k = value.match(p_log)) {
            for (var i = 0; i < k.length; i++) {
                var kk = k[i].match(/\d+/g);
                value = value.replace(p_log, Math.log(kk));
            }
        }
        if (k = value.match(p_ln)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                value = value.replace(p_ln, Math.log(parseInt(kk)) / Math.log(10));
            }
        }
        if (k = value.match(p_sin)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                value = value.replace(p_sin, Math.sin(kk * ( Math.PI / 180)));
            }
        }
        if (k = value.match(p_cos)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                value = value.replace(p_cos, Math.cos(kk * ( Math.PI / 180)));
            }
        }
        if (k = value.match(p_tg)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                var tan = (Math.sin(kk * ( Math.PI / 180))) / (Math.cos(kk * ( Math.PI / 180)));
                value = value.replace(p_tg, Math.ceil(tan));
            }
        }
        if (k = value.match(p_asin)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                value = value.replace(p_asin, Math.asin(kk * ( Math.PI / 180)));
            }
        }
        if (k = value.match(p_acos)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                value = value.replace(p_acos, Math.cos(kk * ( Math.PI / 180)));
            }
        }
        if (k = value.match(p_atg)) {
            for (i = 0; i < k.length; i++) {
                kk = k[i].match(/\d+/g);
                var atan = (Math.cos(kk * ( Math.PI / 180))) / (Math.sin(kk * ( Math.PI / 180)));
                value = value.replace(p_atg, Math.ceil(atan));
            }
        }
        var indexes = [], matchs;
        while (matchs = p_dig.exec(value.trim())) {
            indexes.push([matchs[0]]);
            for (i = 0; i < indexes.length; i++) {
                kk = indexes[i][0].match(/\d+/g);
                value = value.replace(indexes[i][0], Math.pow(kk[0], kk[1]));
            }
        }

        while (matchs = p_mode.exec(value.trim())) {
            indexes.push([matchs[0]]);
            for (i = 0; i < indexes.length; i++) {
                kk = indexes[i][0].match(/\d+/g);
                value = value.replace(indexes[i][0], kk[0] % kk[1]);
            }
        }
        while (matchs = p_minus.exec(value.trim())) {
            indexes.push([matchs[0]]);
            for (i = 0; i < indexes.length; i++) {
                kk = indexes[i][0].match(/\d+/g);
                value = value.replace(indexes[i][0], "("+kk[0] * (-1)+")");
            }
        }
        alert(value);
        try {
            result = eval(value.toString());

            screen_x.find('.answer').text(result);
            isCreated = false;

        } catch (e) {
            screen.css("color", "red").text("error");
            setTimeout(function () {
                $("input").css("color", "inherit").text("");
            }, 600);
        }
    };
    $.fn.functionButton = function () {

        var x = $('#arrow').nextAll('.screen-input:last-child').attr('id').split('-')[2], text = $(this).text(), result;
        var six = $('#screen-input-' + x), value = six.find('.question').text(),
            pattern = /(\d+)$/i,
            last_val = value.match(pattern);

        try {
            switch (text) {
                case '(-)':
                    var v_m =value.match(/\(\-\d+\)/g);
                    if(!v_m){
                        value = value.replace(last_val[0], "").replaceAt(value.length, "(-" + last_val[0] + ")");
                    }else{
                        var repl = parseFloat(v_m[0].replace(/\((.*)\)/, "$1"))*(-1);
                        value = value.replace(v_m[0], "").replaceAt(value.length,  repl);
                    }
                    six.find('.question').text(value);
                    break;
                case 'log':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "log(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'ln':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "ln(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'sin':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "sin(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'cos':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "cos(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'tan':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "tan(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'sin-1':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "asin(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'cos-1':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "acos(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'tan-1':
                    value = value.replace(last_val[0], "").replaceAt(value.length, "atan(" + last_val[0] + ")");
                    six.find('.question').text(value);
                    break;
                case 'x2':
                    value = value.replace(last_val[0], Math.pow(parseInt(last_val[0]), 2));
                    six.find('.question').text(value);
                    break;
                case 'x-1':
                    value = value.replace(last_val[0], Math.pow(parseInt(last_val[0]), -1));
                    six.find('.question').text(value);
                    break;
                case 'π':
                    value += Math.PI;
                    six.find('.question').text(value);
                    break;
                case '^':
                    value = value.replaceAt(value.length, "^");
                    six.find('.question').text(value);
                    break;
                case 'mode':
                    value = value.replaceAt(value.length, "%");
                    six.find('.question').text(value);
                    break;
            }
            screen.text(result);
        } catch (e) {
            screen.css("color", "red").text("error");
            setTimeout(function () {
                $("input").css("color", "inherit").text("");
            }, 600);
        }
    };

    $.fn.clearButton = function () {
        $("div[id^='screen-input-']").each(function () {
            var clear_id = $(this).attr('id');
            if (clear_id !== 'screen-input-1') {
                $(this).remove();
            } else {
                $(this).find('.question').text('');
                $(this).find('.answer').text('');
            }
        });
        x = 1;
    };
    $.fn.secondButton = function () {
        $('.second').toggle();
        $('.first').toggle();
    };
    $.fn.deleteButton = function () {
        x = $('#arrow').nextAll('.screen-input:last-child').attr('id').split('-')[2];
        var screen_x = $('#screen-input-' + x),
            len = screen_x.find('.question').text();
        console.log(typeof x);
        if (parseInt(x) !== 1) {
            if (len.length !== 1) {
                screen_x.find('.question').text(len.substring(0, len.length - 1));
            } else {
                screen_x.remove();
            }
        } else {

            screen_x.find('.question').text('');
            screen_x.find('.answer').text('');
        }
    };

    $(".action").click($(this).valueButton);
    $("#enter").click($(this).calcButton);
    $("#clear").click($(this).clearButton);
    $(".function-button").click($(this).functionButton);
    $("#second-function").click($(this).secondButton);
    $("#delete").click($(this).deleteButton);

    String.prototype.replaceAt = function (index, char) {
        var a = this.split("");
        a[index] = char;
        return a.join("");
    }
});