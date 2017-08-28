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
            if(offset == 0) return new Date(year,month,day,hour,min,sec,msec).getTime();
            else return new Date(new Date(year,month,day,hour,min,sec,msec).getTime() + 3600000 * offset).getTime();
        }

        this._setdate = function(a){
            if(typeof a === "undefined") return Date.now();
            else{
                var s = a.split(" "), s1;
                if(~s[0].indexOf("-")) s1 = s[0].split("-");
                else if(~s[0].indexOf(".")) s1 = s[0].split(".");
                else if(~s[0].indexOf("/")) s1 = s[0].split("/");
                else s1 = [s[0]]; //assuming it's a single number (year)
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
            else if(typeof date === "string") self._date = self._setdate(date);
            else throw new Error("input error on first parameter");
        }
        else self._date = false;

        this.setMode = function(a){
            if(typeof a === "string"){
                if(typeof self._mode === "undefined"){
                    self._mode = a;
                }
                else throw new Error("instance of script was already created; previous mode: " + self._mode + "; please create another one");
            }
            else throw new Error("mode setting failed");
        }

        this._events = {};

        this.doEvent = function(a){
            if(typeof self._events[a] === "function") self._events[a]();
        };
    };

    timify.prototype.date = function(options, objreturn){

        var self = this;
        var months = [["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        ["jan.", "feb.", "mar.", "apr.", "may", "june", "july", "aug.", "sept.", "oct.", "nov.", "dec."]];
        var formatMap = {
            "Y" : "year", "M" : "month", "N" : "fullMonth", "n" : "shortMonth", "W" : "week", "D" : "day", "h" : "hour", "m" : "min", "s" : "sec"
        };
        if(typeof options !== "object" || !(options instanceof Object)) throw new Error("first parameter needs to be an object");
        if(self._date === false) throw new Error("this method requires a date on the timify function");

        if(typeof options.type !== "undefined"){
            if(options.type == "print"){
                self.setMode("print");
                if(typeof options.format !== "string") options.format = "%DD; %NN; %YYYY; %hh;:%mm;:%ss;";
                if(typeof options.months !== "undefined" && options.months instanceof Array){
                    if(options.months.length === 12) months[0] = options.months;
                    else throw new Error("the 'Months' array needs to be exactly 12 length");
                };
                if(typeof options.shMonths !== "undefined" && options.shMonths instanceof Array){
                    if(options.shMonths.length === 12) months[1] = options.shMonths;
                    else throw new Error("the 'shMonths' array needs to be exactly 12 length");
                };

                var date = new Date(self._date),
                    datedata = {};
                datedata.year = date.getFullYear(); datedata.month = date.getMonth() + 1; datedata.fullMonth = months[0][datedata.month - 1];
                datedata.shortMonth = months[1][datedata.month - 1]; datedata.week = parseInt(date.getDate() / 7); datedata.day = date.getDate();
                datedata.hour = date.getHours(); datedata.min = date.getMinutes(); datedata.sec = date.getSeconds();
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
                    else if(parenthese.length == 1){
                        if(lastchar == "-") return parenthese[0] + text;
                        else return text + parenthese[0];
                    }
                    else if(parenthese.length == 2){
                        if(lastchar == "-"){
                            if(text == 1) return parenthese[0] + text;
                            else return parenthese[1] + text;
                        }
                        else{
                            if(text == 1) return text + parenthese[0];
                            else return text + parenthese[1];
                        }
                    }
                }

                display = options.format.replace(/%[a-zA-Z](.*?);/g,replacef);
                if(typeof options.element === "object") options.element.innerHTML = display;
                if(typeof objreturn === "function") objreturn(display);
            }

            if(options.type == "round"){
                self.setMode("round");

                self._roundfunc = function(){
                    var text = {
                        s : "second,seconds",
                        m : "minute,minutes",
                        h : "hour,hours",
                        D : "day,days",
                        W : "week,weeks",
                        M : "month,months",
                        Y : "year,years"
                    }, now;
                    if(typeof options.format === "undefined") options.format = "about %s ago";
                    if(typeof options.order === "undefined") options.order = "s,m,h,D,W,M,Y";
                    if(typeof options.text !== "undefined"){
                        if(typeof options.text !== "object") throw new Error("the text parameter needs to be an object");
                        for(i in options.text){
                            text[i] = options.text[i];
                        }
                    }
                    if(typeof options.from !== "undefined"){
                        if(options.from instanceof Date) now = options.from;
                        else if(typeof options.from === "number") now = new Date(options.from);
                        else if(typeof options.from === "string") now = new Date(self._setdate(options.from));
                    }
                    else now = new Date();
                    function returnmonth(a,b){
                        return ((b.getUTCFullYear() - a.getUTCFullYear()) * 12) - (a.getUTCMonth() + 1) + (b.getUTCMonth() + 1);
                    }
                    var display = "", order = options.order.split(","), then = new Date(self._date), time = Math.floor(Math.abs((now.getTime() - self._date)/1000)),
                        timing = {};
                    timing.s = time;
                    timing.m = Math.floor(time / 60);
                    timing.h = Math.floor(timing.m / 60);
                    timing.D = Math.floor(timing.h / 24);
                    timing.W = Math.floor(timing.D / 7);
                    timing.M = Math.abs(returnmonth(then,now));
                    timing.Y = Math.abs(now.getFullYear() - then.getFullYear());
                    var orders = {
                        s : order.indexOf("s"), m : order.indexOf("m"), h : order.indexOf("h"), D : order.indexOf("D"), W : order.indexOf("W"), M : order.indexOf("M"), Y : order.indexOf("Y")
                    };

                    function generate(a){
                        if(text[a].split(",").length == 1){
                            display = options.format.replace("%s", timing[a] + " " + text[a]);
                        }
                        else{
                            if(timing[a] == 1) display = options.format.replace("%s", timing[a] + " " + text[a].split(",")[0]);
                            else display = options.format.replace("%s", timing[a] + " " + text[a].split(",")[1]);
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

                    return returnobject;

                }

                if(typeof options.update === "number"){
                    if(options.update <= 0) throw new Error("update time parameter needs to be greater than 0");
                    if(typeof options.from !== "undefined"){
                        var q = self._roundfunc();
                        console.warn("Ignored the update time for performance reasons (if the 'from' parameter is specified then the date will be the same everytime)");
                        if(typeof options.element === "object") options.element.innerHTML = q.round;
                        if(typeof objreturn === "function") objreturn(q);
                    }
                    else{
                        self._updatefunc = function(){
                            var q = self._roundfunc();
                            if(typeof options.element === "object") options.element.innerHTML = q.round;
                            if(typeof objreturn === "function") objreturn(q);
                            self.doEvent("update");
                        };
                        self._updatetime = options.update;
                        self._updateint = setInterval(self._updatefunc,options.update);
                        self._updatefunc();
                    }
                }
                else{
                    var q = self._roundfunc();
                    if(typeof options.element === "object") options.element.innerHTML = q.round;
                    if(typeof objreturn === "function") objreturn(q);
                }
            }

        }
        else throw new Error("type must be specified in options");
    }

    timify.prototype.countdown = function(options, objreturn){
        var self = this;
        this.setMode("countdown");
        if(self._date === false) throw new Error("this method requires a date defined on the timify function");
        if(typeof options === "undefined") throw new Error("the first parameter needs to be an object");
        if(typeof options.format === "undefined") options.format = "%h; %m; %s;";
        if(typeof options.continue !== "undefined" && options.continue == true) var stopupdate = false;

        function returnmonth(a,b){
            return ((b.getUTCFullYear() - a.getUTCFullYear()) * 12) - (a.getUTCMonth() + 1) + (b.getUTCMonth() + 1);
        }
        function sortit(a,b){
            var template = ["Y","M","W","D","h","m","s"];
            if(template.indexOf(a) < template.indexOf(b)) return -1;
            else return 1;
            return 0;
        }
        var then = new Date(self._date);


        self._timefunc = function(){
            var step = false,
                characters = [], display, timing = {}, now;

            if(typeof options.from !== "undefined"){
                if(options.from instanceof Date) now = options.from;
                else if(typeof options.from === "number") now = new Date(options.from);
                else if(typeof options.from === "string") now = new Date(self._setdate(options.from));
            }
            else now = new Date();
            var time = Math.floor(Math.abs((self._date - now.getTime())/1000));
            timing.s = time; timing.m = Math.floor(time / 60);
            timing.h = Math.floor(timing.m / 60); timing.D = Math.floor(timing.h / 24); timing.W = Math.floor(timing.D / 7);
            timing.M = Math.abs(returnmonth(then,now)); timing.Y = Math.abs(then.getFullYear() - now.getFullYear());

            var newtimefull = time, newtime = {
                s : null, m : null, h : null, D : null, W : null, M : null, Y : null
            }

            function generate(){
                if(~characters.indexOf("Y")){
                    newtime.Y = Math.floor( newtimefull / 3600 / 24 / 365.25 );
                    newtimefull -= Math.floor( newtime.Y * 3600 * 24 * 365.25 );
                }
                if(~characters.indexOf("M")){
                    newtime.M = Math.floor( newtimefull / 3600 / 24 / 30.4375 );
                    newtimefull -= Math.floor( newtime.M * 3600 * 24 * 30.4375 );
                }
                if(~characters.indexOf("W")){
                    newtime.W = Math.floor( newtimefull / 3600 / 24 / 7 );
                    newtimefull -= Math.floor( newtime.W * 3600 * 24 * 7 );
                }
                if(~characters.indexOf("D")){
                    newtime.D = Math.floor( newtimefull / 3600 / 24 );
                    newtimefull -= Math.floor( newtime.D * 3600 * 24 );
                }
                if(~characters.indexOf("h")){
                    newtime.h = Math.floor( newtimefull / 3600 );
                    newtimefull -= Math.floor( newtime.h * 3600 );
                }
                if(~characters.indexOf("m")){
                    newtime.m = Math.floor( newtimefull / 60 );
                    newtimefull -= Math.floor( newtime.m * 60 );
                }
                if(~characters.indexOf("s")){
                    newtime.s = Math.floor( newtimefull );
                    newtimefull -= Math.floor( newtime.s );
                }
            }
            function replacef(){
                var args = [].slice.call(arguments),
                    match = args[0],
                    index = args[args.length - 2],
                    word = args[args.length - 1];

                match = match.replace(/(^%)|(;$)/g,"");
                if(~match.indexOf("(")) var parenthese = match.split("(")[1].split(")")[0].split(",");
                match = match.split("(")[0];
                var lastchar = match.charAt(match.length - 1),
                    char = match.charAt(0);

                if(step == false){
                    characters.push(char);
                    return match;
                }
                else if(step == true){
                    var text = newtime[char];
                    if(typeof parenthese === "undefined"){
                        return text;
                    }
                    else if(parenthese.length == 1){
                        if(lastchar == "-") return parenthese[0] + text;
                        else return text + parenthese[0];
                    }
                    else if(parenthese.length == 2){
                        if(lastchar == "-"){
                            if(text == 1) return parenthese[0] + text;
                            else return parenthese[1] + text;
                        }
                        else{
                            if(text == 1) return text + parenthese[0];
                            else return text + parenthese[1];
                        }
                    }
                }
            }

            options.format.replace(/%[a-zA-Z](.*?);/g,replacef);
            characters.sort(sortit);
            step = true;
            generate();
            display = options.format.replace(/%[a-zA-Z](.*?);/g,replacef);

            var returnobject = {
                text : display, years : newtime.Y, months : newtime.M, weeks : newtime.W, days : newtime.D, hours : newtime.h, minutes : newtime.m, seconds : newtime.s,
                full : {
                    years : timing.Y, months : timing.M, weeks : timing.W, days : timing.D, hours : timing.h, minutes : timing.m, seconds : timing.s
                }
            };

            return returnobject;
        }

        if(typeof options.from === "undefined"){
            if(typeof options.update === "undefined") options.update = false;
            if(options.update){
                self._updatefunc = function(){
                    var q = self._timefunc();
                    if(typeof stopupdate !== "undefined" && q.full.seconds == 0){
                        if(self._updatetime && self._updatefunc){
                            clearInterval(self._updateint);
                            self._updateint = undefined;
                            self._updatetime = undefined;
                            self._updatefunc = undefined;
                            self.doEvent("finish");
                            return;
                        }
                    }
                    if(typeof options.element === "object") options.element.innerHTML = q.text;
                    if(typeof objreturn === "function") objreturn(q);
                    self.doEvent("update");
                };
                self._updatetime = options.update;
                self._updateint = setInterval(self._updatefunc,options.update);
                self._updatefunc();
            }
            else{
                var q = self._timefunc();
                if(typeof options.element === "object") options.element.innerHTML = q.text;
                if(typeof objreturn === "function") objreturn(q);
            }
        }
        else{
            var q = self._timefunc();
            if(typeof options.update === "number") console.warn("Ignored the update time for performance reasons (if the 'from' parameter is specified then the date will be the same everytime)");
            if(typeof options.element === "object") options.element.innerHTML = q.text;
            if(typeof objreturn === "function") objreturn(q);
        }
    }

    timify.prototype.stopwatch = function(){
        var self = this;
        this.setMode("stopwatch");

    }

    timify.prototype.on = function(event, callback){

        var self = this,
            eventList = {
            countdown : ["stop","update","finish","resume","pause"],
            stopwatch : ["stop","pause","start","update","resume"],
            round : ["stop","pause","update","resume"]
        };

        if(typeof self._mode === "undefined") throw new Error("You need to create an instance of the script to attach events.");
        if(typeof eventList[self._mode] === "undefined") throw new Error("can't attach events to this method");

        if(!~eventList[self._mode].indexOf(event)) throw new Error("event not recognized for this method");
        else{
            if(typeof callback === "function") self._events[event] = callback;
            else throw new Error("the callback needs to be a function");
        };

    }

    timify.prototype.off = function(event){
        var self = this;
        if(typeof self._events[event] !== "undefined") delete self._events[event];
    }

    timify.prototype.pause = function(){
        var self = this;
        if(self._mode == "round" || self._mode == "countdown"){
            if(self._updatetime && typeof self._updateint === "number"){
                clearInterval(self._updateint);
                self._updateint = undefined;
                self._paused = true;
                self.doEvent("pause");
            }
        }

    }
    timify.prototype.resume = function(){
        var self = this;
        if(self._mode == "round" || self._mode == "countdown"){
            if(self._updatetime && self._updatefunc && self._paused){
                self._updateint = setInterval(self._updatefunc, self._updatetime);
                self._paused = undefined;
                self.doEvent("resume");
                self._updatefunc();
            }
        }

    }
    timify.prototype.stop = function(){
        var self = this;
        if(self._mode == "round" || self._mode == "countdown"){
            if(self._updatetime && self._updatefunc){
                if(self._paused){
                    self._paused = undefined;
                }
                else if(self._updateint){
                    clearInterval(self._updateint);
                    self._updateint = undefined;
                }
                self._updatetime = undefined;
                self._updatefunc = undefined;
                self.doEvent("stop");
            }
        }
    }

    timify.prototype.start = function(){}

    return timify;
});
