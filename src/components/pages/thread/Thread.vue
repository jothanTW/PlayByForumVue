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
            <Post v-for="(post, index) in thread.posts" :key="index" 
                :post="post" :isGameThread="thread.isGame" :username="username"  
                @quote="moveQuote(post)" @edit="sendEdit($event, index)"></Post>
        </div>
        <PostMaker ref="postmaker"></PostMaker>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service"
    import UserService from "@/services/user.service"

    import Post from "@/components/pages/thread/Post"
    import PostMaker from "@/components/pages/thread/PostMaker"

    export default {
        name: "Thread",
        components: { Post, PostMaker },
        data() {
            return {
                thread: {},
                username: "",
                pagenum: 1
            }
        },
        methods: {
            populate(to) {
                ForumService.getThread(to.params.thread, to.params.page).then(data => {
                    this.thread = data;
                });
            },
            moveQuote(post) {
                this.$refs.postmaker.addQuote(post);
            },
            updateUsername() {
                this.username = UserService.username;
            },
            sendEdit(event, num) {
                let postnum = (pagenum - 1) * 40 + num + 1;
                ForumService.editPost(thread.id, postnum, event);
                //console.log(num);
                //console.log(event);
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => vm.populate(to, from));
        },
        created() {
            UserService.listen(this.updateUsername);
        },
        mounted() {
            this.updateUsername();
        },
        watch: {
            '$route' (to) {
                this.populate(to);
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