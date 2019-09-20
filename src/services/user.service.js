import axios from 'axios';
import DBService from '@/services/db.service';

const CHKROUTE = "/user/"
const CRTROUTE = "/newuser/";
const LGIROUTE = "/login/";
const LGOROUTE = "/logout/";
const ICOROUTE = "/icon/";
const CHRROUTE = "/character/";

class UserService {
    constructor() {
        this.username = '';
        this.usericon = '';
        this.usercookie = null;
        this.listeners = [];
        this.characterCache = [];
    }
    getKebabCase(str) {
        return str.replace(/\s+/g, '-').replace(/[?&%$#@^*/\\]/,'').toLowerCase();
    }
    doCreateUser(username, useremail, userpass) {
        // verify name, email, and password standards
        return DBService.getDBInfo().then(info => {
            // put the username and password in an authorization string
            let upass = Buffer.from(username + ":" + userpass).toString('base64');
            return axios({
                method: "PUT",
                url: info.host + CRTROUTE,
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
            });
        });
    }
    doLogin(username, userpass) {
        return DBService.getDBInfo().then(info => {
            let upass = Buffer.from(username + ":" + userpass).toString('base64');
            return axios({
                method: "PUT",
                url: info.host + LGIROUTE,
                data: {
                        id: username,
                        uauth: upass
                    },
                withCredentials: true
            }).then(response => {
                if (response.status) {
                    this.username = username;
                    this.usericon = response.data.user.icon;
                }
                this.sendAlert('loginAttempt');
                return response;
            }).catch(error => {
                console.log(error);
                console.error("Error logging in: " + error);
            })
        });
    }
    doLogout() {
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "PUT",
                url: info.host + LGOROUTE,
                withCredentials: true
            }).then(response => {
                this.username = '';
                this.sendAlert('logout');
                return response;
            }).catch(error => {
                console.log(error);
                console.error("Error logging out: " + error);
            });
        });
    }
    doCheckLogin() {
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "GET",
                url: info.host + CHKROUTE,
                withCredentials: true
            }).then(response => {
                if (response.data.name) {
                    this.username = response.data.name;
                    this.usericon = response.data.icon;
                }
                this.sendAlert('usercheck');
                return response;
            }).catch(error => {
                console.error("Error checking user: " + error);
            });
        });
    }
    sendImage(image, character) {
        let cid = "";
        if (character) 
            cid = this.getKebabCase(character.characterName);
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "PUT",
                url: info.host + ICOROUTE + cid,
                data: {
                        data: image
                    },
                withCredentials: true
            }).then(response => {
                return response;
            }).catch(error => {
                console.error("Error loading image: " + error);
            });
        });
    }
    createCharacter(character, image) {
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "POST",
                url: info.host + CHKROUTE + this.username + CHRROUTE,
                data: character,
                withCredentials: true
            }).then(response => {
                if (image) {
                    return this.sendImage(image, character);
                }
                return response;
            }).catch(error => {
                console.error("Error creating character: " + error);
            });
        });
    }
    getAllCharacters(username) {
        if (!username)
            return Promise.resolve({error: "No user defined"});
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "GET",
                url: info.host + CHKROUTE + username + CHRROUTE,
                withCredentials: true
            }).then(response => {
                if (username == this.username) {
                    this.characterCache = response.data.characters;
                }
                return response;
            }).catch(error => {
                console.error("Error getting characters: " + error);
            });
        });
    }
    getCharacter(username, charid) {
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "GET",
                url: info.host + CHKROUTE + username + CHRROUTE + charid,
                withCredentials: true
            }).then(response => {
                
                return response;
            }).catch(error => {
                console.error("Error getting character: " + error);
            });
        });
    }
    editCharacter(character) {
        let charid = character.id;
        return DBService.getDBInfo().then(info => {
            return axios({
                method: "PUT",
                url: info.host + CHKROUTE + this.username + CHRROUTE + charid,
                data: character,
                withCredentials: true
            }).then(response => {
                
                //console.log(response);
                return response;
            }).catch(error => {
                console.error("Error editing character: " + error);
            });
        });
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