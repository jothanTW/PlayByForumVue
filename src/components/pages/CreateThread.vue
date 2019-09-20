<template>
    <div> 
        <div class="forum-page-crumbs" v-if="forum.crumbs">
            <router-link class="crumb-home" to="/">Home</router-link>
            <div class="forum-page-crumb" v-for="(crumb, index) in forum.crumbs" :key="index">&lt;<router-link :to="'/forum/' + crumb.id">{{ crumb.title }}</router-link></div>
            <div>> <router-link class="crumb-home" :to="'/forum/' + forum.id">{{ forum.title }}</router-link></div>
            <div> >  New Thread</div>
        </div>
        <div class="new-forum-title"><input ref="titlein" type="text" placeholder="Thread Title"></div>
        <input type="checkbox" v-model="isgame">Is this a Game Thread?
        <!--PostMaker></PostMaker-->
        <div class="new-thread-post"><textarea v-model="rawPreview" ref="postin"></textarea></div>
        <button @click="doMakeThread()">Create Thread</button>
        <div v-if="errorText.length">{{ errorText }}</div>
        <Post class="test-post" v-if="rawPreview.length" :post="testpost" :username="username"></Post>
    </div>
</template>

<script>
import ForumService from "@/services/forum.service"
import UserService from "@/services/user.service"

import Post from "@/components/pages/thread/Post"

export default {
    name: "CreateThread",
    components: {Post},
    data() {
        return {
            forum: {},
            errorText: "",
            rawPreview: "",
            rawOOC: "",
            testpost: {},
            username: "",
            isgame: false
        }
    },
    methods: {
        updateErrorText(text) {
            this.errorText = text;
        },
        doMakeThread() {
            let thtitle = this.$refs.titlein.value;
            let thpost = this.$refs.postin.value;
            let thparent = this.$route.params.forum;

            let vm = this;
            ForumService.postNewThread(thtitle, thparent, thpost, this.isgame).then(response => {
                if (response.data.status) {
                    this.$router.push({ path: "/thread/" + response.data.threadid });
                } else if (response.data.error) {
                    vm.errorText = response.data.error;
                }
            })
        }
    },
    watch: {
        rawPreview: function() {
            this.username = UserService.username;
            this.testpost = {
                header: {
                    name: this.username,
                    date: new Date().toISOString()
                },
                textBlock: {
                    text: this.rawPreview,
                    ooc: this.rawOOC
                }
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        ForumService.getForum(to.params.forum).then(data => {
            next(vm => vm.forum = data)
        })
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

.new-forum-title {
    margin-top: 10px;
    margin-bottom: 10px;
    
    input {
        width: 500px;
        font-size: 24px;
    }
}

.new-thread-post {
    display: flex;

    textarea {
        width: 800px;
        height: 300px;
        margin-bottom: 10px;
    }
}

.test-post {
    border: 10px solid grey;
    border-radius: 15px;
    margin: 20px;
}

</style>
