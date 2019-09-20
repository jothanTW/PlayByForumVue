<template>
    <div>
        <div class="forum-page-title">
            {{ forum.title }}
        </div>
        <div class="forum-page-crumbs">
            <router-link class="crumb-home" to="/">Home</router-link>
            <div class="forum-page-crumb" v-for="(crumb, index) in forum.crumbs" :key="index">&lt;<router-link :to="'/forum/' + crumb.id">{{ crumb.title }}</router-link></div>
        </div>
        <div class="sub-forum-box" v-if="forum.subforums && forum.subforums.length">
            <div class="sub-forum-box-header">
                <div class="sub-forum-box-title">Subforums</div>
                <div class="sub-forum-box-header-name">Threads</div>
                <div class="sub-forum-box-header-name">Posts</div>
            </div>
            <ForumBar v-for="(subforum, fidx) in forum.subforums" :key="fidx" :forum="subforum"></ForumBar>
        </div>
        <div v-if="canCreate" class="new-thread-button"><router-link :to="'/forum/' + $route.params.forum + '/create-thread'">Create New Thread</router-link></div>
        <div class="thread-box">
            <div class="thread-box-header">
                <div class="thread-box-title">Threads</div>
                <div class="thread-box-header-name">Posts</div>
                <div class="thread-box-header-name">Views</div>
                <div class="thread-box-header-last">Last Poster</div>
            </div>
            <transition-group class="forum-threads" tag="div" name="bar-list">
                <div class="forumloader" v-if="!loaded" key="loadbar"><div class="loading-bar-container"></div>Loading...</div>
                <ThreadBar v-for="(thread, id) in forum.threads" :key="id" :thread="thread"></ThreadBar>
            </transition-group>
        </div>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service";
    import UserService from "@/services/user.service";

    import ForumBar from "@/components/pages/home/ForumBar";
    import ThreadBar from "@/components/pages/forum/ThreadBar";

    export default {
        name: "Forum",
        components: { ForumBar, ThreadBar },
        data() {
            return {
                forum: {
                    title: ForumService.getForumNameFromCache(this.$route.params.forum),
                    threads:[],
                    crumbs:[]
                },
                canCreate: false,
                loaded: false,
                loadTiming: 200
            }
        },
        methods: {
            populate(to) {
                this.forum.title = ForumService.getForumNameFromCache(this.$route.params.forum);
                ForumService.getForum(to.params.forum).then(data => {
                    // sort the threads, in case server doesn't do it
                    data.threads.sort(function(a, b) {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    })

                    // add threads one at a time
                    let threads = data.threads;
                    data.threads = [];

                    this.forum = data;
                    this.loaded = true;
                    let t = 0;
                    let i = this.loadTiming;
                    for (let thread of threads) {
                        window.setTimeout(() => { this.forum.threads.push(thread)}, t)
                        t += i;
                    }
                    this.setupPermissions();
                });
            },
            setupPermissions() {
                this.canCreate = UserService.username.length > 0;
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.populate(to);
            });
        },
        watch: {
            '$route' (to) {
                this.populate(to);
            }
        },
        created() {
            UserService.listen(this.setupPermissions);
        }
    }
</script>

<style lang="scss" scoped>
    .forum-page-title {
        font-size: 24px;
        font-weight: bold;
    }

    .forum-page-crumbs {
        display: flex;
        font-size: 20px;
        font-weight: bold;
        margin-top: 10px;

        .crumb-home {
            margin-right: 10px;
        }

        .forum-page-crumb a {
            margin-left: 10px;
            margin-right: 10px;
        }
    }

    .sub-forum-box {
        background-color: grey;
        border: 10px solid grey;
        border-radius: 15px;
        margin: 20px;

        .sub-forum-box-header {
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: flex;

            .sub-forum-box-title {
                flex-grow: 1;
                padding: 10px;
                padding-top: 0;
            }

            .sub-forum-box-header-name {
                padding: 10px;
                padding-top: 0;
                width: 100px;
                max-width: 100px;
            }
        }
    }

    .thread-box {
        background-color: grey;
        border: 10px solid grey;
        border-radius: 15px;
        margin: 20px;
        overflow:hidden;

        .thread-box-header {
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: flex;

            >div {
                padding: 10px;
                padding-top: 0;
            }

            .thread-box-title {
                flex-grow: 1;
            }

            .thread-box-header-name {
                width: 100px;
                max-width: 100px;
            }

            .thread-box-header-last {
                width: 200px;
                max-width: 200px;
            }
        }

        .forum-threads {
            background-color: white;
        }

        .forumloader {
            min-height: 20px;
            padding: 10px;
            background-color: white;
        }
    }
</style>