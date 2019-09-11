<template>
    <div class="forum-bar">
        <div class="forum-bar-text">
            <router-link class="forum-bar-title" :to="'/forum/' + forum.id">{{ forum.title }}</router-link>
            <div class="forum-bar-subforums" v-if="forum.subforums && forum.subforums.length > 0">Subforums:
                <router-link class="forum-bar-subforum" :to="'/forum/' + sub.id" v-for="(sub, index) in forum.subforums" :key="index">{{ sub.title }}</router-link>
            </div>
        </div>
        <div class="forum-bar-stats">
            <div>{{ forum.threadnum }}</div>
            <div>{{ forum.posts }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ForumBar",
    props: ["forum"],
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
    .forum-bar {
        background-color: white;
        border-bottom: 1px solid grey;
        display: flex;

        .forum-bar-text {
            flex-grow: 1;
            padding: 10px;

            .forum-bar-title {
                font-size: 20px;
            }

            .forum-bar-subforums {
                display: flex;
                font-size: 12px;

                .forum-bar-subforum {
                    margin-left: 5px;
                }
            }
        }

        .forum-bar-stats {
            display: flex;

            >div {
                padding: 10px;
                width: 100px;
                max-width: 100px;
            }
        }
    }
</style>