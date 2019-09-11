import axios from 'axios';

const DBURL = "http://localhost:3000";
const GRPROUTE = "/groups/";
const FRMROUTE = "/forum/";
const THDROUTE = "/thread/";

class ForumService {
    constructor() {

    }
    doGet(url) {
        return axios.get(url).then(response => {
            if (response.status >= 300) {
                throw "Could not connect to database; return code " + response.status;
            }
            if (response.data.error) {
                throw "Error from database: " + response.data.error + ": " + response.data.reason;
            }
            return response.data;
        });
    }
    getGroups() {
        return this.doGet(DBURL + GRPROUTE).catch(error => {
            console.log(error);
            console.error("Error fetching groups: " + error);
        });
    }
    getForum(forumid, pagenum) {
        let p = 1;
        if (pagenum) p = pagenum;
        return this.doGet(DBURL + FRMROUTE + forumid + "/" + p).catch(error => {
            console.error("Error fetching forum" + forumid + ": " + error);
        });
    }
    getThread(threadid, pagenum) {
        let p = 1;
        if (pagenum) p = pagenum;
        return this.doGet(DBURL + THDROUTE + threadid + "/" + p).catch(error => {
            console.error("Error fetching thread" + threadid + ": " + error);
        });
    }
}

export default new ForumService();  