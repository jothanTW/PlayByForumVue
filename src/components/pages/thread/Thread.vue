<template>
    <div v-if="thread">
        <div class="thread-title">{{ thread.title }}</div>
        <div class="thread-breadcrumbs"></div>
        <div class="post-box">
            <Post v-for="(post, index) in thread.posts" :key="index" :post="post" :isGameThread="thread.isGame"></Post>
        </div>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service"

    import Post from "@/components/pages/thread/Post"

    export default {
        name: "Thread",
        components: { Post },
        data() {
            return {
                thread: {}
            }
        },
        methods: {
            populate(to, from) {
                ForumService.getThread(to.params.thread, to.params.page).then(data => {
                    this.thread = data;
                });
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => vm.populate(to, from));
        },
        watch: {
            '$route' (to, from) {
                this.populate(to, from);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .thread-title {
        font-size: 24px;
        font-weight: bold;
    }



    .post-box {
        margin: 20px;
        border: 10px solid grey;
        border-radius: 15px;
        background-color: grey;
    }
</style>