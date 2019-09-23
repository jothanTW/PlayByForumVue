<template>
    <div v-if="thread">
        <div class="thread-title">{{ thread.title }}</div>
        <div class="thread-breadcrumbs">
            <router-link to="/">Home</router-link>
            <div class="crumb" v-for="(crumb, index) in thread.crumbs" :key="index">
                &lt;<router-link :to='"/forum/" + crumb.id'>{{ crumb.title }}</router-link>
            </div>
        </div>
        <transition-group tag="div" name="bar-list"  class="post-box">
            <div class="threadloader" v-if="!loaded" key="loadingbar"><div class="loading-bar-container"></div>Loading...</div>
            <Post v-for="(post, index) in thread.posts" :key="index" 
                :post="post" :isGamePost="thread.isGame" :username="username"  
                @quote="moveQuote(post)" @edit="sendEdit($event, index)"></Post>
        </transition-group>
        <div class="post-maker-container">
            <PostMaker ref="postmaker" :isGameThread="thread.isGame" @refresh="partialPopulate()"></PostMaker>
        </div>
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
                thread: {
                    title: ForumService.getThreadNameFromCache(this.$route.params.thread),
                },
                username: "",
                pagenum: 1,
                postInterval: 200,
                loaded: false
            }
        },
        methods: {
            populate(to) {
                ForumService.getThread(to.params.thread, to.params.page).then(data => {
                    let posts = data.posts;
                    data.posts = [];
                    this.thread = data;
                    let t = 0;
                    let i = this.postInterval;
                    for (let post of posts) {
                        window.setTimeout(() => {
                            this.thread.posts.push(post);
                        }, t);
                        t += i;
                    }
                    this.loaded = true;
                });
            },
            partialPopulate() {
                ForumService.getThread(this.$route.params.thread, this.$route.params.page).then(data => {
                    let newposts = data.posts;
                    // compare each post
                    // if the names match, call it the same post
                    // if they don't, hard reload the page
                    //      could just put the new data in wholesale
                    //
                    // update the headers and textblocks
                    // if data.posts has more, add them one at a time
                    //
                    // only thread data that could need to be updated is the post number
                    this.thread.postNum = data.postNum;

                    let t = 0;
                    let i = this.postInterval;

                    for (let i = 0; i < data.posts.length; i++) {
                        if (i < this.thread.posts.length) {
                            if (newposts[i].header.name == this.thread.posts[i].header.name) {
                                Object.assign(this.thread.posts[i], newposts[i]);
                            } else {
                                this.populate(this.$route);
                                return;
                            }
                        } else {
                            window.setTimeout(() => {
                                this.thread.posts.push(newposts[i]);
                            }, t);
                            t += i;
                        }
                    }
                });
            },
            moveQuote(post) {
                this.$refs.postmaker.addQuote(post);
            },
            updateUsername() {
                this.username = UserService.username;
            },
            sendEdit(event, num) {
                let postnum = (this.pagenum - 1) * 40 + num + 1;
                ForumService.editPost(this.thread.id, postnum, event).then(response=> {
                    if (response.status) {
                        this.populate(this.$route);
                    } else if (response.error) {
                        console.log(response);
                    }
                });
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
                // might be messing up somewhere?
                //this.populate(to);
                this.partialPopulate();
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
        font-size: 20px;

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
        background-color: white;
        overflow:hidden;

        .threadloader {
            padding: 10px;
        }
    }
</style>