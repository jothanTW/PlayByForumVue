<template>
    <div>
        <div class="floater-login">
            <Login></Login>
        </div>
        <Banner></Banner>
        <router-view/>
        <Footer/>
    </div>
</template>

<script>
    import Banner from "@/components/Banner.vue";
    import Footer from "@/components/Footer.vue";
    import Login from "@/components/FloatingLogin";

    import UserService from "@/services/user.service";

    export default {
        name: "App",
        components: {Banner, Footer, Login},
        data() {
            return {
            }
        },
        created() {
            UserService.doCheckLogin();
        }
    }
</script>

<style lang="scss" scoped>
    .floater-login {
        position: absolute;
        top: 0;
        right: 0px;
        padding: 10px;
        border: 4px solid lightgray;
        z-index: 10;
        background-color: white;
    }
</style>
