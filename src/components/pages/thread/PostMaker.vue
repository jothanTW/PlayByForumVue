<template>
    <div class="post-maker-body" :class='{ "active" : showBox }'>
        <div class="post-maker-input">
            PUT YOUR POSTS RIGHT HERE BABY
            <textarea ref="post-area" v-model="rawPreview" class="post-maker-text-area"></textarea>
            <button @click="sendPost()" :disabled="disableSubmit">Submit Post</button>
        </div>
        <div class='error-text' v-if="errorText.length">{{ errorText }}</div>
        <!--div class="post-preview" v-html="postPreview"></div-->
        <Post class="test-post" v-if="rawPreview.length" :post="testpost" :username="username"></Post>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import ForumService from "@/services/forum.service";
import PostService from "@/services/post.service";

import Post from "@/components/pages/thread/Post";

export default {
    name: "PostMaker",
    components: { Post },
    data() {
        return {
            showBox: false,
            errorText: "",
            disableSubmit: false,
            postPreview: "",
            rawPreview: "",
            username: "",
            testpost: null
        }
    },
    methods: {
        updateShowBox() {
            this.showBox = (this.$cookies.isKey("pbforum_sid"));
            this.username = UserService.username;
        },
        addQuote(post) {
            let quotestr = "[quote=\"" + post.header.name + "\"]\n" + post.textBlock.text + "\n[/quote]";
            let newstr = this.rawPreview + quotestr;

            this.$refs["post-area"].value = newstr;
            this.rawPreview = newstr;

            this.setPostPreview();
        },
        sendPost() {
            this.disableSubmit = true;
            ForumService.postToThread(this.$route.params.thread, {text: this.$refs["post-area"].value}).then(response => {
                this.disableSubmit = false;
                if (response.data.error) {
                    this.errorText = response.data.error;
                    console.log(response.data.error);
                }
                if (response.data.status) {
                    // post complete, go to the last page
                    // in case the routing messes up, clear the post box
                    this.$refs["post-area"].value = "";
                    this.rawPreview = "";
                    if (this.$route.params.page == 'last') {
                        // trigger a route refresh
                        this.$emit('refresh');
                    }
                    else
                        this.$router.push({ path: "/thread/" + this.$route.params.thread + "/last"});
                }
            })
        },
        setPostPreview() {
            this.postPreview = PostService.formatText(this.$refs["post-area"].value);

            if (this.rawPreview.length) {
                this.testpost = {
                    header: {
                        name: this.username,
                        date: new Date().toISOString()
                    },
                    textBlock: {
                        text: this.rawPreview
                    }
                }
            } else {
                this.testpost = null;
            }
        }
    },
    computed: {
    },
    watch: {
        rawPreview: function() {
            this.setPostPreview();
        }
    },
    created() {
        UserService.listen(this.updateShowBox);
    },
    mounted() {
        this.updateShowBox();
    }
}
</script>

<style lang="scss" scoped>
.post-maker-body {
    display: flex;
    flex-direction: column;
    max-height: 0;
    transition: all 500ms;
        overflow: hidden;

    &.active {
        max-height: initial;
    }

    .post-maker-input {
        max-width: 800px;
        display: flex;
        flex-direction: column;

        textarea {
            min-height: 300px;
        }
    }

    .test-post {
        border: 3px solid grey;
        margin: 20px;
    }
}
</style>

<style lang="scss">
div.post.test-post div.post-buttons {
    display: none;
}
</style>
