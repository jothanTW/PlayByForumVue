<template>
    <div> 
        <div class="forum-page-title">
            {{ forum.title }} > New Thread
        </div>
        <div class="forum-page-crumbs" v-if="forum.crumbs">
            <router-link class="crumb-home" to="/">Home</router-link>
            <div class="forum-page-crumb" v-for="(crumb, index) in forum.crumbs" :key="index">&lt;<router-link :to="'/forum/' + crumb.id">{{ crumb.title }}</router-link></div>
        </div>
        <div><input ref="titlein" type="text" placeholder="Thread Title"></div>
        <div style="display: flex"><textarea ref="postin"></textarea></div>
        <button @click="doMakeThread()">Create Thread</button>
        <div v-if="errorText.length">{{ errorText }}</div>
    </div>
</template>

<script>
import ForumService from "@/services/forum.service"

export default {
    name: "CreateThread",
    data() {
        return {
            forum: {},
            errorText: ""
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
            ForumService.postNewThread(thtitle, thparent, thpost).then(response => {
                if (response.data.status) {
                    this.$router.push({ path: "/thread/" + response.data.threadid });
                } else if (response.data.error) {
                    vm.errorText = response.data.error;
                }
            })
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

</style>
