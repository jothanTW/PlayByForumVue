import axios from 'axios';

const DBURL = "/static/";
const GRPROUTE = "test-data/group-test.json";
const FRMROUTE = "test-data/forum-test.json";
const THDROUTE = "test-data/thread-test.json";

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
            console.error("Error fetching groups: " + error);
        });
    }
    getForum(forumid, pagenum) {
        // TODO: when we have an actual database, append the forumid and pagenum to the route
        return this.doGet(DBURL + FRMROUTE).catch(error => {
            console.error("Error fetching forum" + forumid + ": " + error);
        });
    }
    getThread(threadid, pagenum) {
        // TODO: when we have an actual database, append the threadid and pagenum to the route
        return this.doGet(DBURL + THDROUTE).catch(error => {
            console.error("Error fetching thread" + threadid + ": " + error);
        });
    }
}

export default new ForumService();  