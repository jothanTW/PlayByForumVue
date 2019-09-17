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

<style lang="scss">
html {
    min-width: 500px;
}

@keyframes loadbar {
    from {background-position-x: -20px;}
    to {background-position-x: 0px;}
}

.loading-bar-container {
    width: 200px;
    border: 2px solid darkgray;
    border-radius: 5px;
    min-height: 10px;
    position: relative;
    overflow: hidden;
}

.loading-bar-container::before {
    position: absolute;
    content: '';
    
    background: repeating-linear-gradient(
        90deg,
        #fff,
        #fff 10px,
        #465298 10px,
        #465298 20px
    );
    width: 100%;
    padding-top: 100%; 
    //height: 100px;

    transform: translateY(-50%) rotate(45deg);
    
    animation-name: loadbar;
    background-size: 10000px;
    animation-duration: 500ms;
    background-repeat: repeat;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}



// maybe put this in another style sheet
.bar-list-item {
    transition: all 500ms;
}

.bar-list-enter-active {
    transition: all 1s;
} 
.bar-list-leave-active {
    position: absolute;

    transition: all 1s;
}

.bar-list-enter, .bar-list-leave-to {
    opacity: 0;
}

.bar-list-enter {
    transform: translateX(100px);
}


.group-list-item {
    transition: all 500ms;
}

.group-list-enter-active {
    transition: all 1s;
} 
.group-list-leave-active {
    position: absolute;

    transition: all 1s;
}

.group-list-enter, .bar-list-leave-to {
    opacity: 0;
}

.group-list-enter {
    transform: translateY(-30px);
}
</style>
