<template>
    <div v-if="post" class="post">
        <div class="post-header">
            <div class="poster-name" :class="{ 'obscured': post.header.alias}">{{ post.header.name }}<span v-if="post.header.alias">posting as</span></div>
            <div class="poster-char-name" v-if="post.header.char">{{ post.header.char }}</div>
            <div class="poster-icon" v-if="post.header.icon"><img :src="imgHost + post.header.icon"></div>
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
            <div class="post-ooc" v-if="isGamePost && post.textBlock.ooc" :class="{'hidden': oocHidden}">
                <div class="edit-area" :class="{'active': isEditing}">
                    <textarea ref="editoocarea"></textarea>
                </div>
                <div class="post-area" :class="{'active': !isEditing && !oocHidden}" v-html="getFormattedText(post.textBlock.ooc)"></div>
                <button v-if="isGamePost && (isEditing || post.textBlock.ooc && post.textBlock.ooc.length > 0)" class="show-hide-ooc" @click="oocHidden = !oocHidden">{{ oocHidden ? 'Show' : 'Hide'}} OOC Content</button>
            </div>
            <div class="post-edit" v-if="post.edit && post.edit.date">Edited at {{ getFormattedDate(post.edit.date) }}</div>
        </div>
        <div class="post-buttons">
            <div class="change-character" v-if="isEditing && isGamePost && false">
                Change Character?<select v-model="post.header.alias">
                    <option value="">No Character</option>
                    <option v-for="character in userCharacters" :key="character.id" value="character.id">{{ character.name }}</option>
                </select>
            </div>
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
    import DateService from "@/services/date.service";
    import PostService from "@/services/post.service";
    import ImageHostService from "@/services/imagehost.service";
    import UserService from "@/services/user.service";

    export default {
        name: "Post",
        props: ["post", "isGamePost", "username"],
        data() {
            return {
                isEditing: false,
                imgHost: ImageHostService.host,
                oocHidden: true,
                userCharacters: []
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
                this.$refs.editoocarea.value = this.post.textBlock.ooc;
                this.userCharacters = UserService.characterCache; // this is here in case of login
            },
            sendEdit() {
                // build a new text body, alert the thread
                let textBlock = {
                    text: this.$refs.editarea.value,
                    ooc: this.$refs.editoocarea.value
                }
                this.$emit('edit', {textBlock: textBlock});
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

                &.obscured {
                    color: grey;

                    >span {
                        margin-left: 10px;
                        font-weight: normal;
                        font-style: italic;
                    }
                }
            }

            .poster-char-name {
                font-weight: bold;
                margin-top: 10px;
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

            .post-text, .post-ooc {

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

            .post-ooc {
                margin-top: 10px;
                border-top: 3px dashed grey;
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