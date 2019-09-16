<template>
    <div v-if="thread">
        <div class="thread-title">{{ thread.title }}</div>
        <div class="thread-breadcrumbs">
            <router-link to="/">Home</router-link>
            <div class="crumb" v-for="(crumb, index) in thread.crumbs" :key="index">
                &lt;<router-link :to='"/forum/" + crumb.id'>{{ crumb.title }}</router-link>
            </div>
        </div>
        <div class="post-box">
            <Post v-for="(post, index) in thread.posts" :key="index" :post="post" :isGameThread="thread.isGame"></Post>
        </div>
        <PostMaker></PostMaker>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service"

    import Post from "@/components/pages/thread/Post"
    import PostMaker from "@/components/pages/thread/PostMaker"

    export default {
        name: "Thread",
        components: { Post, PostMaker },
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

    .thread-breadcrumbs {
        display: flex;
        margin-top: 10px;
        font-weight: bold;

        .crumb {
            margin-left: 10px;

            a {
                margin-left: 10px;
            }
        }
    }

    .post-box {
        margin: 20px;
        border: 10px solid grey;
        border-radius: 15px;
        background-color: grey;
    }
</style>