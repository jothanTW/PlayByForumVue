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
            <div class="post-text">
                <div class="edit-area" :class="{'active': isEditing}">
                    <textarea ref="editarea"></textarea>
                </div>
                <div class="post-area" :class="{'active': !isEditing}" v-html="getFormattedText(post.textBlock.text)"></div>
            </div>
            <div class="post-ooc" v-if="isGamePost && post.textBlock.ooc">{{ post.textBlock.ooc }}</div>
            <div class="post-edit" v-if="post.edit && post.edit.date">Edited at {{ getFormattedDate(post.edit.date) }}</div>
        </div>
        <div class="post-buttons">
            <div class="send-edit-button" v-if="username == post.header.name && isEditing">
                <button @click="sendEdit()">Confirm Edit</button>
            </div>
            <div class="edit-button" v-if="username == post.header.name">
                <button @click="doEdit()">{{ isEditing ? 'Cancel' : 'Edit'}}</button>
            </div>
            <div class="quote-button" v-if="username.length">
                <button @click="sendQuoteEvent()">Quote</button>
            </div>
        </div>
    </div>
</template>

<script>
    import DateService from "@/services/date.service"
    import PostService from "@/services/post.service"

    export default {
        name: "Post",
        props: ["post", "isGamePost", "username"],
        data() {
            return {
                isEditing: false
            }
        },
        methods: {
            getFormattedDate(date) {
                return DateService.formatDateToString(new Date(date));
            },
            getFormattedText(text) {
                //if (this.parser)
                return PostService.formatText(text);
                //return str;
            },
            sendQuoteEvent() {
                this.$emit('quote');
            },
            doEdit() {
                // the post text area gets replaced with a text box
                this.isEditing = !this.isEditing;
                this.$refs.editarea.value = this.post.textBlock.text;
            },
            sendEdit() {
                // build a new text body, alert the thread
                let textBlock = {
                    text: this.$refs.editarea.value
                }
                this.$emit('edit', {textBlock: {text: this.$refs.editarea.value}});
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
        position: relative;

        .post-header {
            width: 200px;
            min-width: 200px;
            max-width: 200px;
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
            flex-grow: 1;
            flex-direction: column;
            word-wrap: break-word;
            max-width: calc(100% - 240px);

            .post-text {

                .edit-area, .post-area {
                    overflow: hidden;
                    flex-grow: 1;
                    max-height: 0px;
                    word-wrap: break-word;

                    &.active {
                        max-height: initial;
                    }
                }
                
                textarea {
                    display: flex;
                    width: 100%;
                    flex-grow: 1;
                }
            }
        }

        .post-buttons {
            display: flex;
            position: absolute;
            bottom: 5px;
            right: 5px;
        }
    }
</style>

<style lang="scss">
    .quote-block {
        .quote-head {
            font-weight: bold;
            padding-bottom: 10px;
        }
        border: 3px solid grey;
        box-shadow: 2px 2px 2px black;
        padding: 10px;
    }

    .spoiler-text {
        display: inline;
        background-color: black;
        color: black;
    }

    .spoiler-text:hover {
        color: white;
    }
</style>