<template>
    <div class="post-maker-body" :class='{ "active" : showBox }'>
        <div class="post-maker-input">
            PUT YOUR POSTS RIGHT HERE BABY
            <textarea ref="post-area" v-model="rawPreview" class="post-maker-text-area"></textarea>
            <button v-if="isGameThread" @click="showOOC = !showOOC; if (!showOOC) rawOOC = ''">{{ showOOC ? "Remove" : "Include"}} OOC text?</button>
            <textarea v-if="isGameThread && showOOC" v-model="rawOOC" class="post-maker-ooc-area"></textarea>
            <div v-if="isGameThread" class="alias-selector">
                Choose a character to post as?
                <select v-model="characterAlias">
                    <option value="">No Character</option>
                    <option v-for="character in usercharacters" :key="character.id" :value="character.id">{{character.name}}</option>
                </select>
            </div>
            <button @click="sendPost()" :disabled="disableSubmit">Submit Post</button>
        </div>
        <div class='error-text' v-if="errorText.length">{{ errorText }}</div>
        <!--div class="post-preview" v-html="postPreview"></div-->
        <Post class="test-post" v-if="rawPreview.length" :post="testpost" :username="username" :isGamePost="isGameThread"></Post>
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
    props: [ "isGameThread" ],
    data() {
        return {
            showBox: false,
            errorText: "",
            disableSubmit: false,
            postPreview: "",
            rawPreview: "",
            rawOOC: "",
            username: "",
            testpost: null,
            usercharacters: [],
            characterAlias: "",
            showOOC: false
        }
    },
    methods: {
        updateShowBox() {
            this.showBox = (this.$cookies.isKey("pbforum_sid"));
            this.username = UserService.username;
            UserService.getAllCharacters(this.username).then(response => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    this.usercharacters = response.data.characters;
                }
            })
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
            let postbody = {
                text: this.$refs["post-area"].value,
                ooc: this.rawOOC
            }
            if (this.characterAlias.length > 0) {
                postbody.alias = this.characterAlias;
            }
            let vm = this;
            ForumService.postToThread(this.$route.params.thread, postbody).then(response => {
                vm.disableSubmit = false;
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

            if (this.rawPreview.length) {
                this.testpost = {
                    header: {
                        name: this.username,
                        date: new Date().toISOString(),
                    },
                    textBlock: {
                        text: this.rawPreview,
                        ooc: this.rawOOC
                    }
                }
                
            
                if (this.characterAlias.length > 0) {
                    for (let c of this.usercharacters) {
                        if (c.id == this.characterAlias) {
                            this.testpost.header.char = c.name;
                            this.testpost.header.alias = this.characterAlias;
                            if (c.icon)
                                this.testpost.header.icon = c.icon;
                            if (c.title)
                                this.testpost.header.title = c.title;
                        }
                    }
                } else if (UserService.usericon) {
                    this.testpost.header.icon = UserService.usericon;
                    // TODO: get character title
                    //this.testpost.header.icon = UserService.usericon;
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
        },
        rawOOC: function() {
            this.setPostPreview();
        },
        characterAlias: function() {
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
