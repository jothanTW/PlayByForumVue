<template>
    <div>
        <div class="forum-group" v-for="(group, index) in groups" :key="index">
            <div class="forum-group-header">
                <div class="forum-group-title">{{ group.title }}</div>
                <div class="forum-group-header-name">Threads</div>
                <div class="forum-group-header-name">Posts</div>
            </div>
            <ForumBar v-for="(forum, fidx) in group.forums" :key="fidx" :forum="forum"></ForumBar>
        </div>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service";

    import ForumBar from "@/components/pages/home/ForumBar";

    export default {
        name: "Home",
        components: { ForumBar },
        data() {
            return {
                groups: []
            }
        },
        created() {
            ForumService.getGroups().then(data => {
                // fast way
                this.groups = data;
            });
        }
    }
</script>

<style lang="scss" scoped="true">
    .forum-group {
        margin: 20px;
        background-color: grey;
        border-radius: 15px;
        border: 10px solid grey;

        .forum-group-header {
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: flex;

            .forum-group-title {
                flex-grow: 1;
                padding: 10px;
                padding-top: 0;
            }

            .forum-group-header-name {
                padding: 10px;
                padding-top: 0;
                width: 100px;
                max-width: 100px;
            }
        }
    }
</style>