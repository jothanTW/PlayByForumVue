<template>
    <div>
        <div class="forum-page-title">
            {{ forum.title }}
        </div>
        <div class="forum-page-crumbs" v-if="forum.crumbs">
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
        <div class="thread-box" v-if="forum.threads">
            <div class="thread-box-header">
                <div class="thread-box-title">Threads</div>
                <div class="thread-box-header-name">Posts</div>
                <div class="thread-box-header-name">Views</div>
                <div class="thread-box-header-last">Last Poster</div>
            </div>
            <ThreadBar v-for="(thread, id) in forum.threads" :key="id" :thread="thread"></ThreadBar>
        </div>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service";

    import ForumBar from "@/components/pages/home/ForumBar";
    import ThreadBar from "@/components/pages/forum/ThreadBar";

    export default {
        name: "Forum",
        components: { ForumBar, ThreadBar },
        data() {
            return {
                forum: {}
            }
        },
        methods: {
            populate(to, from) {
                ForumService.getForum(to.params.forum).then(data => {
                    this.forum = data;
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
    }
</style>