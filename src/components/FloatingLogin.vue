<template>
    <div class="login-body">
        <transition-group name="logincontrol" tag="div">
            <div v-if="hasCookie" class="user-logout-box" key="logout">
                Hello {{ displayName }}! <button class="logoutbutton" @click="doLogOut">Logout</button>
            </div>
            <div v-else class="user-login-box" key="login">
                <input type="text" ref="logName" placeholder="Username">
                <input type="text" ref="eName" placeholder="Email Address" :tabindex='showCreate ? 0 : -1' :class="{ 'hidden-under-create': !showCreate }">
                <input type="password" ref="logPass" placeholder="Password" @keyup.enter="if (!showCreate) doLogIn()">
                <input type="password" ref="conPass" placeholder="Confirm Password" @keyup.enter="if (showCreate) doSignUp()" :tabindex='showCreate ? 0 : -1' :class="{ 'hidden-under-create': !showCreate }">
                <button class="logbutton" @click="doLogIn()" v-if="!showCreate">Login</button>
                <button class="signupbutton" @click="doSignUp()" v-else>Create Account</button>
                <div class=show-create-text v-if="!showCreate">No account? <div @click="showCreate = !showCreate" class="show-create-toggle">Quit being a loser</div></div>
                <div class=show-create-text v-else>Have an account? <div @click="showCreate = !showCreate" class="show-create-toggle">You could've just said so</div></div>
                <div class="login-error" v-if="errortext.length">{{ errortext }}</div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import UserChecks from "@/services/userInfoChecks";

export default {
    name: "Login",
    data() {
        return {
            hasCookie: false,
            displayName: "",
            showCreate: false,
            errortext: ""
        }
    },
    created() {
        UserService.listen(this.showLogin);
    },
    methods: {
        showLogin() {
            this.hasCookie = (this.$cookies.isKey("pbforum_sid"));
            this.displayName = UserService.username;
        },
        doLogIn() {
            let username = this.$refs.logName.value;
            let userpass = this.$refs.logPass.value;

            UserService.doLogin(username, userpass).then(response => {
                if (response.data.error) {
                    this.errortext = response.data.error;
                    console.log(response.data.error);
                } else {
                    this.showLogin();
                }
            })
        },
        doSignUp() {
            let username = this.$refs.logName.value;
            let userpass = this.$refs.logPass.value;
            let useremail = this.$refs.eName.value;
            let userpassConfirm = this.$refs.conPass.value;

            let check = UserChecks.checkUserName(username);
            if (check.length > 0) {
                this.errortext = check;
                return;
            }
            check = UserChecks.checkPassword(userpass);
            if (check.length > 0) {
                this.errortext = check;
                return;
            }
            check = UserChecks.checkEmail(useremail);
            if (check.length > 0) {
                this.errortext = check;
                return;
            }
            if (userpass !== userpassConfirm) {
                this.errortext = "Passwords do not match"
                return;
            }
            this.errortext = "";
            UserService.doCreateUser(username, useremail, userpass).then (response => {
                if (response.error) {
                    this.errortext = response.error;
                } else {
                    this.showLogin();
                }
            })
        },
        doLogOut() {
            UserService.doLogout().then(response => {
                if (response.data.error) {
                    console.log(response.data.error);
                }
                this.showLogin();
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.login-body {
    position: relative;
    transition: all 1s;
    overflow: hidden;
    width: 250px;
}

.user-login-box {
    display: flex;
    flex-direction: column;

    >* {
        margin-top: 5px;
        transition: all 500ms;
        overflow: hidden;
        height: 22px;
    }

    .show-create-text {
        font-size: 10px;
        display: flex;

        .show-create-toggle {
            text-decoration: underline;
            margin-left: 5px;
            cursor: pointer;
        }
    }

    .hidden-under-create {
        height: 0;
        margin: 0;
        padding: 0;
        border-width: 0;
    }
}

.user-logout-box {
    display: flex;
    flex-direction: column;

    >* {
        margin-top: 5px;
    }
}



.logincontrol-item {
    display: block;
    transition: all 1s;
}
.logincontrol-enter-active {
    transition: all 1s;
} 
.logincontrol-leave-active {
    position: absolute;
    transition: all 1s;
}

.logincontrol-enter, .logincontrol-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
</style>
