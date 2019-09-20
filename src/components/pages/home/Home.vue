<template>
    <div :style="styleObject" ref="group-container" class="group-container">
        <transition-group name="group-list" tag="div" ref="groups" class="group-list">
            <div class="grouploader" v-if="groups.length == 0" key="loadbar"><div class="loading-bar-container"></div>Loading...</div>
            <div class="forum-group" v-for="(group, index) in groups" :key="index" :ref="'group' + index">
                <div class="forum-group-header">
                    <div class="forum-group-title">{{ group.title }}</div>
                    <div class="forum-group-header-name">Threads</div>
                    <div class="forum-group-header-name">Posts</div>
                </div>
                <transition-group @enter="onEnter" tag="div" name="bar-list" class="forum-list">
                    <ForumBar v-for="(forum, fidx) in group.forums" :key="fidx" :forum="forum"></ForumBar>
                </transition-group>
            </div>
        </transition-group>
    </div>
</template>

<script>
    import ForumService from "@/services/forum.service";

    import ForumBar from "@/components/pages/home/ForumBar";

    export default {
        name: "Home",
        components: { ForumBar },
        data() {
            return {
                groups: [],
                addInterval: 200,
                calculatedHeight: 0,
                doubleCalculatedHeight: 0
            }
        },
        methods: {
            onEnter() {
                // get the estimated height of each group object
                let returnh = 0;
                for (let i = 0; i < this.groups.length; i++) {
                    let h = this.$refs["group" + i][0].offsetHeight;
                    returnh += h + 20;
                }
                this.calculatedHeight = returnh;
            }
        },
        computed: {
            styleObject : function() {
                let minmaxheight = 200;
                if (this.calculatedHeight > minmaxheight) minmaxheight = this.calculatedHeight;
                return {
                    'max-height': minmaxheight + "px"
                }
            }
        },
        created() {
            ForumService.getGroups().then(data => {
                let i = this.addInterval;
                let t = 0;
                for (let group of data) {
                    let forums = group.forums;
                    group.forums = [];
                    // don't show empty groups
                    if (forums.length) {
                        window.setTimeout(() => {this.groups.push(group)}, t)
                        for (let forum of forums) {
                            window.setTimeout(() => {this.groups[this.groups.length - 1].forums.push(forum); }, t);
                            t += i;
                        }
                        
                    }
                    
                }

                
            });
        },
        watch : {
            calculatedHeight: function() {
                this.doubleCalculatedHeight = this.calculatedHeight;
            }
        }
    }
</script>

<style lang="scss" scoped="true">
.group-list{ 
    min-height: 500px;
    
    .group-container {
        transition: max-height 500ms ease-out;
    }

    .grouploader {
        display: flex;
        justify-content: center;
        font-size: 18px;
        .loading-bar-container {
            min-height: 18px;
        }
    }
}
    .forum-group {
        margin: 20px;
        background-color: grey;
        border-radius: 15px;
        border: 10px solid grey;
        overflow: hidden;

        .forum-group-header {
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: flex;

            .forum-group-title {
                flex-grow: 1;
                padding: 10px;
                padding-top: 0;
            }

            .forum-group-header-name {
                padding: 10px;
                padding-top: 0;
                width: 100px;
                max-width: 100px;
            }
        }

        .forum-list {
            background-color: white;
        }
    }
</style>