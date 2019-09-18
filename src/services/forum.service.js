import axios from 'axios';

const DBURL = "http://" + location.host.split(":")[0] + ":3000";
const GRPROUTE = "/groups/";
const FRMROUTE = "/forum/";
const THDROUTE = "/thread/";

class ForumService {
    constructor() {
        this.pageCaches = {
            forum: {},
            thread: {}
        }
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
        return this.doGet(DBURL + GRPROUTE).then(data => {
            // log all forums found to the cache
            for (let group of data) {
                for (let forum of group.forums) {
                    this.pageCaches.forum[forum.id] = {
                        id: forum.id,
                        title: forum.title
                    }
                    if (forum.subforums) {
                        for (let sub of forum.subforums) {
                            this.pageCaches.forum[sub.id] = {
                                id: sub.id,
                                title: sub.title
                            }
                        }
                    }
                }
            }
            return data;
        }).catch(error => {
            console.log(error);
            console.error("Error fetching groups: " + error);
        });
    }
    getForum(forumid, pagenum) {
        let p = 1;
        if (pagenum) p = pagenum;
        return this.doGet(DBURL + FRMROUTE + forumid + "/" + p).then(data => {
            // log all forums and threads found to cache
            this.pageCaches.forum[data.id] = {
                id: data.id,
                title: data.title
            }
            if (data.subforums) {
                for (let forum of data.subforums) {
                    this.pageCaches.forum[forum.id] = {
                        id: forum.id,
                        title: forum.title
                    }
                    if (forum.subforums) {
                        for (let sub of forum.subforums) {
                            this.pageCaches.forum[sub.id] = {
                                id: sub.id,
                                title: sub.title
                            }
                        }
                    }
                }
            }
            for (let thread of data.threads) {
                this.pageCaches.thread[thread.id] = {
                    id: thread.id,
                    title: thread.title
                }
            }
            for (let crumb of data.crumbs) {
                // assume all crumbs are forums
                this.pageCaches.forum[crumb.id] = {
                    id: crumb.id,
                    title: crumb.title
                }
            }
            return data;
        }).catch(error => {
            console.error("Error fetching forum " + forumid + ": " + error);
        });
    }
    getThread(threadid, pagenum) {
        let p = 1;
        if (pagenum) p = pagenum;
        return this.doGet(DBURL + THDROUTE + threadid + "/" + p).then(data => {
            // log all crumbs to cache
            this.pageCaches.thread[data.id] = {
                id: data.id,
                title: data.title
            }
            for (let crumb of data.crumbs) {
                // assume all crumbs are forums
                this.pageCaches.forum[crumb.id] = {
                    id: crumb.id,
                    title: crumb.title
                }
            }
            return data;
        }).catch(error => {
            console.error("Error fetching thread " + threadid + ": " + error);
        });
    }
    postToThread(threadid, post) {
        return axios({
            method: "POST",
            url: DBURL + THDROUTE + threadid,
            data: post,
            withCredentials: true
        }).then(response => {
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error making post: " + error);
        })
    }
    postNewThread(threadname, forumid, post) {
        return axios({
            method: "POST",
            url: DBURL + FRMROUTE + forumid,
            data: {
                title: threadname,
                text: post
            },
            withCredentials: true
        }).then(response => {
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error making thread: " + error);
        })
    }
    editPost(forumid, postnum, postcontent) {
        return axios({
            method: "PUT",
            url: DBURL + THDROUTE + forumid + "/" + postnum,
            data: postcontent,
            withCredentials: true
        }).then(response => {
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error editing post: " + error);
        })
    }
    getForumNameFromCache(id) {
        if (this.pageCaches.forum[id]) 
            return this.pageCaches.forum[id].title;
        return " ";
    }
    getThreadNameFromCache(id) {
        if (this.pageCaches.thread[id]) 
            return this.pageCaches.thread[id].title;
        return " ";
    }
}

export default new ForumService();  