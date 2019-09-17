<template>
    <div class="thread-bar">
        <div class="thread-text">
            <router-link class="thread-title" :to="'/thread/' + thread.id">{{ thread.title }}</router-link>
            <div class="thread-pages" v-if="pageliststart.length">Pages:
                <router-link v-for="(page) in pageliststart" :key="page" :to="'/thread/' + thread.id + '/' + page">{{ page }}</router-link>
                <div v-if="pagelistend.length">...</div>
                <router-link v-for="(page) in pagelistend" :key="page" :to="'/thread/' + thread.id + '/' + page">{{ page }}</router-link>
                </div>
        </div>
        <div class="thread-stats">
            <div class="thread-stat">{{ thread.posts }}</div>
            <div class="thread-stat">{{ thread.views }}</div>
            <div class="thread-last-poster">
                <router-link :to="'/thread/' + thread.id + '/last'">{{ thread.last }}</router-link>
                <div class="thread-last-posted-date">{{ formatDateString(thread.date) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import DateService from "@/services/date.service";

export default {

    name: "ThreadBar",
    props: ["thread"],
    data() {
        return {
            pageliststart: [],
            pagelistend: []
        }
    },
    created() {
        // TODO: get these numbers from some global, defined by user
        let maxPostsPerPage = 20;
        let maxPagesBeforeSplit = 5;
        let maxPagesAfterSplit = 3;

        let pageNum = Math.ceil(this.thread.posts / maxPostsPerPage);

        if (pageNum <= 1) {
            this.pageliststart = [];
            this.pagelistend = [];
        } else if (pageNum <= maxPagesBeforeSplit + maxPagesAfterSplit) {
            let pagelistbuffer = [];
            for (let i = 0; i < pageNum; i++) {
                pagelistbuffer.push(i + 1);
            }
            this.pageliststart = pagelistbuffer;
            this.pagelistend = [];
        } else {
            let pagelistbufferstart = [];
            let pagelistbufferend = [];
            for (let i = 0; i < maxPagesBeforeSplit; i++) {
                pagelistbufferstart.push(i + 1);
            }
            for (let i = pageNum - maxPagesAfterSplit; i < pageNum; i++) {
                pagelistbufferend.push(i + 1);
            }
            this.pageliststart = pagelistbufferstart;
            this.pagelistend = pagelistbufferend;
        }
    },
    methods: {
        formatDateString(date) {
            return DateService.formatDateToString(new Date(date));
        }
    },
    watch: {
        thread: function() {
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .thread-bar {
        display: flex;
        background-color: white;
        border-bottom: 1px solid grey;

        .thread-text {
            flex-grow: 1;
            padding: 10px;
            font-size: 20px;
            min-height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .thread-pages {
                display: flex;
                font-size: 12px;

                >a {
                    display: block;
                    width: 15px;
                    height: 15px;
                    text-align: center;
                    line-height: 15px;
                    
                    padding: 0px;
                    background-color: lightgray;
                    margin-left: 5px;
                    text-decoration: none;
                }
            }
        }

        .thread-stats {
            display: flex;

            .thread-stat {
                width: 100px;
                max-width: 100px;
                padding: 10px;
            }

            .thread-last-poster {
                width: 200px;
                max-width: 200px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .thread-last-posted-date {
                    font-size: 10px;
                    margin-left: 20px;
                }
            }
        }
    }
</style>