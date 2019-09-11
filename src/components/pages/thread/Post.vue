<template>
    <div v-if="post" class="post">
        <div class="post-header">
            <div class="poster-name">{{ post.header.name }}</div>
            <div class="poster-char-name" v-if="post.header.char">{{ post.header.char }}</div>
            <div class="poster-icon" v-if="post.header.icon"><img :src="post.header.icon"></div>
            <div class="poster-title" v-if="post.header.title">{{ post.header.title }}</div>
            <div class="poster-date">{{ getFormattedDate(post.header.date) }}</div>
        </div>
        <div class="post-content">
            <div class="post-text">{{ post.textBlock.text }}</div>
            <div class="post-ooc" v-if="isGamePost && post.textBlock.ooc">{{ post.textBlock.ooc }}</div>
            <div class="post-edit" v-if="post.edit && post.edit.date">Edited at {{ getFormattedDate(post.edit.date) }}</div>
        </div>
    </div>
</template>

<script>
    import DateService from "@/services/date.service"

    export default {
        name: "Post",
        props: ["post", "isGamePost"],
        data() {
            return {}
        },
        methods: {
            getFormattedDate(date) {
                return DateService.formatDateToString(new Date(date));
            },
            getFormattedText(text) {
                
            }
        }
    }
</script>

<style lang="scss" scoped>
    .post {
        background-color: white;
        min-height: 100px;
        display: flex;
        border-bottom: 3px solid grey;

        .post-header {
            width: 200px;
            padding: 10px;
            border-right: 3px solid grey;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .poster-name {
                font-weight: bold;
            }

            .poster-title {
                font-style: italic;
                margin-top: 10px;
            }

            .poster-date {
                //flex-grow: 1;
                align-self: flex-end;
                vertical-align: bottom;
                margin-top: auto;
            }
        }

        .post-content {
            padding: 10px;
            display: flex;
            flex-direction: column;
        }
    }
</style>