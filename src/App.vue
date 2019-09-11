<template>
    <div>
        <Banner></Banner>
        <router-view/>
        <Footer/>
    </div>
</template>

<script>
    import Banner from "@/components/Banner.vue";
    import Footer from "@/components/Footer.vue";

    export default {
        name: "App",
        components: {Banner, Footer},
        data() {
            return {
            }
        }

    }
</script>

<style lang="scss" scoped>
</style>
