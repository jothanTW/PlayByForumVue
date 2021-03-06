import axios from 'axios';

class DBService {
    constructor() {
        this.httpc = "http://" + location.host.split(":")[0] + ":3000";
        this.httpsc = "https://" + location.host.split(":")[0] + ":3443";
        this.host = null;
    }
    getDBInfo() {
        if (this.host)
            return Promise.resolve({ host: this.host });
        
        // test the connection
        return axios.head(this.httpsc).then(response =>{
            this.host = this.httpsc;
            console.log("Using secure connection to backend");
            return {host: this.host};
        }).catch(e => {
            this.host = this.httpc;
            console.warn("Secure connection to backend unavailable! Responded with error " + e + ". Using unsecure connection");
            return {host: this.host};
        })
    }
}

export default new DBService();