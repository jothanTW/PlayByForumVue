<template>
    <div>
        <div class="banner-text">
            HI WELCOME TO FORUM
        </div>
        <div class="profile-button" v-if="username.length"><router-link to="/user">User Profile</router-link></div>
    </div>
</template>

<script>
    import UserService from "@/services/user.service"

    export default {
        name: "Banner",
        data() {
            return {
                username: ""
            }
        },
        methods: {

        },
        mounted() {

        },
        created() {
            UserService.listen(() => {this.username = UserService.username;})
        }
    }
</script>

<style lang="scss" scoped>
    .banner-text {
        font-size: 40px;
        font-family: "Comic Sans MS", cursive, sans-serif;
        padding-bottom: 40px;
    }
</style>