import axios from 'axios';

const DBURL = "http://" + location.host.split(":")[0] + ":3000";
const CHKROUTE = "/user/"
const CRTROUTE = "/newuser/";
const LGIROUTE = "/login/";
const LGOROUTE = "/logout/";

class UserService {
    constructor() {
        this.username = '';
        this.usercookie = null;
        this.listeners = [];
    }
    doCreateUser(username, useremail, userpass) {
        // verify name, email, and password standards
        // put the username and password in an authorization string
        let upass = Buffer.from(username + ":" + userpass).toString('base64');
        return axios({
            method: "PUT",
            url: DBURL + CRTROUTE,
            data: {
                id: username,
                uauth: upass,
                email: useremail
            },
            withCredentials: true
        }).then(response => {
            if (response.status) {
                this.username = username;
            }
            this.sendAlert('signupAttempt');
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error creating user: " + error);
        })
    }
    doLogin(username, userpass) {
        let upass = Buffer.from(username + ":" + userpass).toString('base64');
        return axios({
            method: "PUT",
            url: DBURL + LGIROUTE,
            data: {
                    id: username,
                    uauth: upass
                },
            withCredentials: true
        //})
        //return axios.put(DBURL + LGIROUTE, {
        //    id: username,
        //    uauth: upass
        }).then(response => {
            if (response.status) {
                this.username = username;
            }
            this.sendAlert('loginAttempt');
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error logging in: " + error);
        })
    }
    doLogout() {
        return axios({
            method: "PUT",
            url: DBURL + LGOROUTE,
            withCredentials: true
        }).then(response => {
            this.sendAlert('logout');
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error logging out: " + error);
        })
    }
    doCheckLogin() {
        return axios({
            method: "GET",
            url: DBURL + CHKROUTE,
            withCredentials: true
        }).then(response => {
            if (response.data.name) {
                this.username = response.data.name;
            }
            this.sendAlert('usercheck');
            return response;
        }).catch(error => {
            console.log(error);
            console.error("Error checking user: " + error);
        })
    }
    listen(callback) {
        if (callback && {}.toString.call(callback) === '[object Function]')
            this.listeners.push(callback);
    }
    sendAlert(alertname) {
        for (let listener of this.listeners) {
            listener(alertname);
        }
    }
}

export default new UserService();