define('humane', 
    [], 
    function() 
    {        
        var human = 
        {
            humaneDate: function (date, compareTo)
            {
                if(!date)
                    return;

                var lang = {
                        ago: 'Ago',
                        from: '',
                        now: 'Just Now',
                        minute: 'Minute',
                        minutes: 'Minutes',
                        hour: 'Hour',
                        hours: 'Hours',
                        day: 'Day',
                        days: 'Days',
                        week: 'Week',
                        weeks: 'Weeks',
                        month: 'Month',
                        months: 'Months',
                        year: 'Year',
                        years: 'Years'
                    },
                    formats = [
                        [60, lang.now],
                        [3600, lang.minute, lang.minutes, 60], // 60 minutes, 1 minute
                        [86400, lang.hour, lang.hours, 3600], // 24 hours, 1 hour
                        [604800, lang.day, lang.days, 86400], // 7 days, 1 day
                        [2628000, lang.week, lang.weeks, 604800], // ~1 month, 1 week
                        [31536000, lang.month, lang.months, 2628000], // 1 year, ~1 month
                        [Infinity, lang.year, lang.years, 31536000] // Infinity, 1 year
                    ],
                    isString = typeof date == 'string',
                    date = isString ?
                                new Date(('' + date).replace(/-/g,"/").replace(/[TZ]/g," ")) :
                                date,
                    compareTo = compareTo || new Date,
                    seconds = (compareTo - date +
                                    (compareTo.getTimezoneOffset() -
                                        // if we received a GMT time from a string, doesn't include time zone bias
                                        // if we got a date object, the time zone is built in, we need to remove it.
                                        (isString ? 0 : date.getTimezoneOffset())
                                    ) * 60000
                                ) / 1000,
                    token;

                if(seconds < 0) {
                    seconds = Math.abs(seconds);
                    token = lang.from ? ' ' + lang.from : '';
                } else {
                    token = lang.ago ? ' ' + lang.ago : '';
                }

                for(var i = 0, format = formats[0]; formats[i]; format = formats[++i]) {
                    if(seconds < format[0]) {
                        if(i === 0) {
                            // Now
                            return format[1];
                        }

                        var val = Math.ceil(this.normalize(seconds, format[3]) / (format[3]));
                        return val +
                                ' ' +
                                (val != 1 ? format[2] : format[1]) +
                                (i > 0 ? token : '');
                    }
                }
            },

            normalize: function(val, single)
            {
                var margin = 0.1;
                if(val >= single && val <= single * (1+margin)) {
                    return single;
                }
                return val;
            }
        } 

        return human;
});