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

        if(!Date.now){
            Date.now = function(){ return new Date().getTime(); };
        };
        var newdate = new Date();
        var now = {
            year : newdate.getUTCFullYear(),
            month : newdate.getUTCDate(),
            day : newdate.getUTCDay(),
            hour : newdate.getUTCHours(),
            min : newdate.getUTCMinutes(),
            sec : newdate.getUTCSeconds(),
            msec : newdate.getUTCMilliseconds()
        };

        function rtime(offset,year,month,day,hour,min,sec,msec){
            var offset = offset || 0, year = year || 0, month = month || 0, day = day || 0, hour = hour || 0, min = min || 0, sec = sec || 0, msec = msec || 0;
            offset = parseFloat(offset);
            month = parseInt(month);
            month = month > 0 ? month - 1 : 0;
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
                if(typeof s1 === "undefined" && s[0] != "today" && s[0] != "now") throw new Error("input error");
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
                else throw new Error("input error");
            }
        }

    };

});
