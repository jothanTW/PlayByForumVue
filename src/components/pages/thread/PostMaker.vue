<template>
    <div class="post-maker-body" :class='{ "active" : showBox }'>
        PUT YOUR POSTS RIGHT HERE BABY
        <textarea ref="post-area"></textarea>
        <button @click="sendPost()">Submit Post</button>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import ForumService from "@/services/forum.service";

export default {
    name: "PostMaker",
    data() {
        return {
            showBox: false
        }
    },
    methods: {
        updateShowBox() {
            this.showBox = (this.$cookies.isKey("pbforum_sid"));
        },
        sendPost() {
            ForumService.postToThread(this.$route.params.thread, {text: this.$refs["post-area"].value}).then(response => {
                if (response.data.error) {
                    console.log(response.data.error);
                }
                if (response.data.status) {
                    // post complete, go to the last page
                    if (this.$route.params.page == 'last')
                        this.$router.go();
                    else
                        this.$router.push({ path: "/thread/" + this.$route.params.thread + "/last"});
                }
            })
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
        max-height: 300px;
    }
}
</style>
