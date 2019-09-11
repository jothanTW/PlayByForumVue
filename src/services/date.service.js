const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class DateService {
    constructor() {
        this.format = "MMM DD, YYYY h:mm";
    }
    formatDateToString(date, formatstring) {
        let form = this.format;
        if (formatstring) form = formatstring;
        
        let tokens = form.match(/[a-z]+|[^a-z]+|\/.*?\//gi);

        for (let i = 0; i < tokens.length; i++) {
            if (/^[a-z]/i.test(tokens[i])) {
                let nstr = "";
                switch(tokens[i]) {
                    case 'YYYY': 
                        nstr = date.getFullYear();
                        break;
                    case 'YY':
                        nstr = date.getFullYear().substr(2);
                        break;
                    case 'M':
                        nstr = months[date.getMonth()];
                        break;
                    case 'MM':
                        nstr = date.getMonth() + 1;
                        break;
                    case 'MMM':
                        nstr = months[date.getMonth()].substr(0, 3);
                        break;
                    case 'D':
                        nstr = days[date.getDay()];
                        break;
                    case 'DD':
                        nstr = date.getDate();
                        break;
                    case 'DDD':
                        nstr = shortdays[date.getDay()];
                        break;
                    case 'h':
                        nstr = '' + date.getHours();
                        break;
                    case 'hh':
                        nstr = '' + (date.getHours() % 12);
                        break;
                    case 'mm':
                        nstr = '' + date.getMinutes();
                        if (nstr.length == 1) nstr = '0' + nstr;
                        break;
                    case 'ss':
                        nstr = '' + date.getSeconds();
                        if (nstr.length == 1) nstr = '0' + nstr;
                        break;
                    default:
                        throw "Error: unrecognized format string " + tokens[i];
                }
                tokens[i] = nstr;
            }
        }

        return tokens.join('');
    }
}

export default new DateService();