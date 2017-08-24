/*
    * (c) smuwn
    * Licensed under the MIT License
    * https://opensource.org/licenses/MIT
*/
;(function(root,factory){
    if(typeof define === "function" && define.amd) define([], factory);
    else if(typeof exports === "object") module.exports = factory();
    else root.timify = factory();
})(this,function(){
    "use strict";

    function timify(date, scope){

        var self = this;
        if(!Date.now){
            Date.now = function(){ return new Date().getTime(); };
        };
        var newdate = new Date();
        var now = {
            year : newdate.getUTCFullYear(),
            month : newdate.getUTCMonth(),
            day : newdate.getUTCDate()
        };

        function rtime(offset,year,month,day,hour,min,sec,msec){
            var offset = offset || 0, year = year || 0, month = month || 0, day = day || 1, hour = hour || 0, min = min || 0, sec = sec || 0, msec = msec || 0;
            offset = parseFloat(offset);
            month = parseInt(month);
            month = month > 0 ? month - 1 : 0;
            self._offset = offset;
            if(offset == 0){
                return new Date(year,month,day,hour,min,sec,msec).getTime();
            }
            else{
                return new Date(new Date(year,month,day,hour,min,sec,msec).getTime() + 3600000 * offset).getTime();
            }
        }

        Date.set = function(a){
            if(typeof a === "undefined") return Date.now();
            else{
                var s = a.split(" "), s1;
                if(~s[0].indexOf("-")) s1 = s[0].split("-");
                else if(~s[0].indexOf(".")) s1 = s[0].split(".");
                else if(~s[0].indexOf("/")) s1 = s[0].split("/");
                if(typeof s1 === "undefined" && s[0] != "today" && s[0] != "now") throw new Error("input error on first parameter");
                if(s.length === 1){
                    if(s[0] == "today") return rtime(0, now.year, now.month, now.day);
                    else if(s[0] == "now") return Date.now();
                    if(s1.length === 1) return rtime(0, s1[0]);
                    else if(s1.length === 2) return rtime(0, s1[0], s1[1]);
                    else if(s1.length === 3) return rtime(0, s1[0], s1[1], s1[2]);
                }
                else if(s.length === 2){
                    if(s[1].charAt(0) == "+" || s[1].charAt(0) == "-"){
                        if(s[0] == "today") return rtime(s[1], now.year, now.month, now.day);
                        else if(s[0] == "now") return Date.now() + 3600000 * parseFloat(s[1]);
                        if(s1.length === 1) return rtime(s[1], s1[0]);
                        else if(s1.length === 2) return rtime(s[1], s1[0], s1[1]);
                        else if(s1.length === 3) return rtime(s[1], s1[0], s1[1], s1[2]);
                    }
                    else{
                        var s2 = s[1].split(":");
                        if(s[0] == "today"){
                            if(s2.length === 1) return rtime(0, now.year, now.month, now.day, s2[0]);
                            else if(s2.length === 2) return rtime(0, now.year, now.month, now.day, s2[0], s2[1]);
                            else if(s3.length === 3) return rtime(0, now.year, now.month, now.day, s2[0], s2[1], s2[2]);
                        };
                        if(s2.length === 1) return rtime(0, s1[0], s1[1], s1[2], s2[0]);
                        else if(s2.length === 2) return rtime(0, s1[0], s1[1], s1[2], s2[0], s2[1]);
                        else if(s2.length === 3) return rtime(0, s1[0], s1[1], s1[2], s2[0], s2[1], s2[2]);
                    }
                }
                else if(s.length === 3){
                    var s2 = s[1].split(":");
                    if(s[0] == "today"){
                        if(s2.length === 1) return rtime(s[2], now.year, now.month, now.day, s2[0]);
                        else if(s2.length === 2) return rtime(s[2], now.year, now.month, now.day, s2[0], s2[1]);
                        else if(s2.length === 3) return rtime(s[2], now.year, now.month, now.day, s2[0], s2[1], s2[2]);
                    }
                    else{
                        if(s1.length === 3 && s2.length === 1) return rtime(s[2], s1[0], s1[1], s1[2], s2[0]);
                        else if(s1.length === 3 && s2.length === 2) return rtime(s[2], s1[0], s1[1], s1[2], s2[0], s2[1]);
                        else if(s1.length === 3 && s2.length === 3) return rtime(s[2], s1[0], s1[1], s1[2], s2[0], s2[1], s2[2]);
                    };
                }
                else throw new Error("input error on first parameter");
            }
        }

        if(typeof date !== "undefined"){
            if(date instanceof Date) self._date = date.getTime();
            else if(typeof date === "number") self._date = date;
            else if(typeof date === "string") self._date = Date.set(date);
            else throw new Error("input error on first parameter");
        }
        else throw new Error("first parameter missing (Date)");

        this.setMode = function(a){
            if(typeof a === "string"){
                if(self._mode === "undefined"){
                    self._mode = a;
                }
                else throw new Error("instance of script was already created; previous mode: " + self._mode + "; please create another one");
            }
            else throw new Error("mode setting failed");
        }

        this._events = {};
    };

    timify.prototype.date = function(options, objreturn){

        var self = this;
        var months = [["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        ["jan.", "feb.", "mar.", "apr.", "may", "june", "july", "aug.", "sept.", "oct.", "nov.", "dec."]];
        var formatMap = {
            "Y" : "year", "M" : "month", "N" : "fullMonth", "n" : "shortMonth", "W" : "week", "D" : "day", "h" : "hour", "m" : "min", "s" : "sec"
        };
        this.setMode("date");
        if(typeof options !== "object" || !(options instanceof Object)) throw new Error("first parameter needs to be an object");

        function returnDate(){}

        if(typeof options.type !== "undefined"){
            if(options.type == "print"){
                if(typeof options.format !== "string") options.format = "%DD;.%NN;.%YYYY; %hh;:%mm;:%ss;";
                if(typeof options.months !== "undefined" && options.months instanceof Array){
                    if(options.months.length === 12) months[0] = options.months;
                    else new Error("the 'Months' array needs to be exactly 12 length");
                };
                if(typeof options.shMonths !== "undefined" && options.shMonths instanceof Array){
                    if(options.shMonths.length === 12) months[1] = options.shMonths;
                    else new Error("the 'shMonths' array needs to be exactly 12 length");
                };

                var date = new Date(self._date),
                    datedata = {
                        year : date.getFullYear(),
                        month : date.getMonth() + 1,
                        fullMonth : months[0][this.month - 1],
                        shortMonth : months[1][this.month - 1],
                        week : parseInt(date.getDate() / 7),
                        day : date.getDate(),
                        hour : date.getHours(),
                        min : date.getMinutes(),
                        sec : date.getSeconds(),
                    };
                var display;
                function replacef(){
                    var text, args = [].slice.call(arguments),
                        match = args[0],
                        index = args[args.length - 2],
                        word = args[args.length - 1];

                    match = match.replace(/(^%)|(;$)/g,"");
                    if(~match.indexOf("(")) var parenthese = match.split("(")[1].split(")")[0].split(",");
                    match = match.split("(")[0];
                    var lastchar = match.charAt(match.length - 1),
                        char = match.charAt(0);

                    text = datedata[formatMap[char]];
                    if(!isNaN(text)) if(text < 10) text = "0" + text;

                    if(typeof parenthese === "undefined"){
                        return text;
                    }
                    else if(parenthese.length == 1 && lastchar == "-"){
                        return parenthese[0] + text;
                    }
                    else if(parenthese.length == 1 && lastchar != "-"){
                        return text + parenthese[0];
                    }
                    else if(parenthese.length == 2 && lastchar == "-"){
                        if(text == 1) return parenthese[0] + text;
                        else return parenthese[1] + text;
                    }
                    else if(parenthese.length == 2 && lastchar != "-"){
                        if(text == 1) return text + parenthese[0];
                        else return text + parenthese[1];
                    };
                }
                display = options.format.replace(/%[a-zA-Z](.*?);/g,replacef);
                if(typeof options.element !== "undefined") options.element.innerHTML = display;
                if(typeof objreturn === "function") objreturn(display);
            }

            if(options.type == "round"){
                var text = {
                    s : "second,seconds",
                    m : "minute,minutes",
                    h : "hour,hours",
                    D : "day,days",
                    W : "week,weeks",
                    M : "month,months",
                    Y : "year,years"
                };
                if(typeof options.format === "undefined") options.format = "about %s ago";
                if(typeof options.order === "undefined") options.order = "s,m,h,D,W,M,Y";
                if(typeof options.text !== "undefined"){
                    if(typeof options.text !== "object") throw new Error("the text parameter needs to be an object");
                    for(i in options.text){
                        text[i] = options.text[i];
                    }
                }
                function returnmonth(a,b){
                    return ((b.getUTCFullYear() - a.getUTCFullYear()) * 12) - (a.getUTCMonth() + 1) + (b.getUTCMonth() + 1);
                }
                var display = "", order = options.order.split(","), now = new Date(), then = new Date(self._date), time = Math.floor((now.getTime() - self._date)/1000),
                    timing = {
                        s : time,
                        m : Math.floor(Math.abs(time / 60)),
                        h : Math.floor(Math.abs(this.m / 60)),
                        D : Math.floor(Math.abs(this.h / 24)),
                        W : Math.floor(Math.abs(this.D / 7)),
                        M : Math.abs(returnmonth(then,now)),
                        Y : Math.abs(now.getFullYear() - then.getFullYear())
                    };
                var orders = {
                    s : order.indexOf("s"), m : order.indexOf("m"), h : order.indexOf("h"), D : order.indexOf("D"), W : order.indexOf("W"), M : order.indexOf("M"), Y : order.indexOf("Y")
                };

                function generate(a){
                    if(text[a].split(",").length == 1){
                        display = options.format.replace("%s", time + " " + text[a]);
                    }
                    else{
                        if(time == 1) display = options.format.replace("%s", time + " " + text[a].split(",")[0]);
                        else display = options.format.replace("%s", time + " " + text[a].split(",")[1]);
                    }
                }

                if(~orders.s && (!order[orders.s + 1] || (order[orders.s + 1] && timing[order[orders.s + 1]] == 0))) generate("s");
                else if(~orders.m && (!order[orders.m + 1] || (order[orders.m + 1] && timing[order[orders.m + 1]] == 0))) generate("m");
                else if(~orders.h && (!order[orders.h + 1] || (order[orders.h + 1] && timing[order[orders.h + 1]] == 0))) generate("h");
                else if(~orders.D && (!order[orders.D + 1] || (order[orders.D + 1] && timing[order[orders.D + 1]] == 0))) generate("D");
                else if(~orders.W && (!order[orders.W + 1] || (order[orders.W + 1] && timing[order[orders.W + 1]] == 0))) generate("W");
                else if(~orders.M && (!order[orders.M + 1] || (order[orders.M + 1] && timing[order[orders.M + 1]] == 0))) generate("M");
                else if(~orders.Y && (!order[orders.Y + 1] || (order[orders.Y + 1] && timing[order[orders.Y + 1]] == 0))) generate("Y");

                var returnobject = {};
                returnobject.round = display; returnobject.data = {}; returnobject.data.seconds = timing.s;
                returnobject.data.minutes = timing.m; returnobject.data.hours = timing.h; returnobject.data.days = timing.D;
                returnobject.data.weeks = timing.W; returnobject.data.months = timing.M; returnobject.data.years = timing.Y;

                if(typeof options.update === "number"){
                    
                }
                else{
                    if(typeof options.element === "object") options.element.innerHTML = display;
                    if(typeof objreturn === "function") objreturn(returnobject);
                }
            }
        }
        else throw new Error("type must be specified in options");
    }

    timify.prototype.countdown = function(from, options, objreturn){

        var self = this;
        this.setMode("countdown");


    }

    timify.prototype.stopwatch = function(){



    }

    timify.prototype.on = function(event, callback){

        var self = this,
            eventList = {
            countdown : ["stop","update","finish","start","resume"],
            stopwatch : ["stop","pause","start","update","resume"]
        };

        if(typeof this._mode === "undefined") throw new Error("You need to create an instance of the script to attach events.");



    }

    timify.prototype.off = function(){



    }

    timify.prototype.pause = function(){}
    timify.prototype.resume = function(){}
    timify.prototype.stop = function(){}
    timify.prototype.start = function(){}
});
