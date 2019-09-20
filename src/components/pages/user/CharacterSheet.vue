<template>
<div>
    <div class="crumbs">
        <router-link to="/">Home</router-link>&lt; Character Sheet
    </div>
    <button class="character-edit-button" v-if="thisuser == username && !editmode" @click="editmode = true">Edit Character</button>
    <button class="submit-edit-button" v-if="thisuser == username && editmode" @click="submitEdits()">Submit Edits</button>
    <div class="char-sheet-page">
        <div class="char-sheet-style-box">
            <div v-if="character.name">
                <div class="character-name">{{character.name}}</div>
                <div class="character-icon" v-if="character.icon"><img class="char-large-icon" :src="imhost + character.icon"><img class="char-small-icon" :src="imhost + character.icon"></div>
                <div class="character-title"><div v-if="editmode"><input type="text" v-model="character.title" placeholder="Character Title Text"></div><div v-else>{{ character.title }}</div></div>
                <div class="character-stat-block">
                    <!-- Character stats are ordered by rows of columns of stat name/value/flag objects-->
                    <div v-for="(row, ridx) in character.statBlock.rows" :key="'row' + ridx" class="block-row">
                        <button v-if="editmode" @click="character.statBlock.rows.splice(ridx, 1)" class="row-remove" :disabled="row.columns.length > 0" :title="getDeleteTitleText(row)">X</button>
                        <div class="block-row-title">
                            <input v-if="editmode" type="text" placeholder="Row Title" v-model="row.title">
                            <div v-else>{{ row.title }}</div>
                            <div class="column-buttons">
                                <button class="add-column-button" @click="row.columns.push({ title: '', stats: []})" v-if="editmode">Add Stat Column</button>
                                <button class="add-column-button" @click="row.columns.push({ title: '', stats: [], text: ''})" v-if="editmode">Add Text Column</button>
                            </div>
                        </div>
                        <div v-for="(column, cidx) in row.columns" :key="'row' + ridx + 'column' + cidx" class="block-column">
                            <div class="block-column-title">
                                <input v-if="editmode" type="text" placeholder="Column Title" v-model="column.title">
                                <div v-else>{{ column.title }}</div>
                                <button v-if="editmode" @click="row.columns.splice(cidx, 1)" class="column-remove" :disabled="column.text && column.text.length > 0 || column.stats.length > 0" :title="getDeleteTitleText(column)">X</button>
                            </div>
                            <div class="column-stat-list" v-if="column.text === undefined">
                                <div v-for="(stat, sidx) in column.stats" :key="'row' + ridx + 'column' + cidx + 'stat' + sidx" class="block-stat">
                                    <div v-if="editmode">
                                        <button @click="column.stats.splice(sidx, 1)" class="stat-remove" :disabled="stat.name.length > 0 || stat.value.length > 0" :title="getDeleteTitleText(stat)">X</button>
                                        <input type="text" placeholder="Stat Name" v-model="stat.name">:<input type="text" placeholder="Stat Value" v-model="stat.value">
                                    </div>
                                    <div v-else>
                                        <div class="stat-name">{{ stat.name }}</div>:<div class="stat-value">{{ stat.value }}</div>
                                    </div>
                                </div>
                                <div>
                                    <button class="add-stat-button" @click="column.stats.push({ name: '', value: ''})" v-if="editmode">Add Stat</button>
                                </div>
                            </div>
                            <div class="column-text-block" v-else> 
                                <textarea v-if="editmode" v-model="column.text" @keyup="textareaup"></textarea>
                                <div v-else v-html="getFormattedText(column.text)"></div>
                            </div>
                        </div>
                    </div>
                    <button class="add-row-button" @click="character.statBlock.rows.push({ title: '', columns: []})" v-if="editmode">Add Stat Row</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import UserService from "@/services/user.service";
import ImageHostService from "@/services/imagehost.service";
import PostService from "@/services/post.service";

export default {
    name: "CharacterSheet",
    data() {
        return {
            character: {},
            loaded: false,
            error: "",
            editmode: false,
            imhost: "",
            username: "",
            thisuser: ""
        }
    },
    methods: {
        populate(to) {
            // get the character sheet

            // optional: fetch character preload
            if (to.params.characterPreLoad) {
                this.character = to.params.characterPreLoad;
            }

            this.username = to.params.userid;

            UserService.getCharacter(to.params.userid, to.params.characterid).then(response => {
                if (response.data.error) {
                    console.log(response.data.error);
                    this.error = response.data.error;
                } else {
                    this.character = response.data.character;
                    this.loaded = true;
                }
            })
        },
        textareaup(evt) {
            let area = evt.target;
            if (area.clientHeight < area.scrollHeight) {
                console.log(area.clientHeight + " / " + area.scrollHeight);

                area.style.minHeight = area.scrollHeight;
            }
        },
        getFormattedText(text) {
            return PostService.formatText(text);
        },
        submitEdits() {
            let cdat = this.character;
            UserService.editCharacter(cdat).then(response => {
                if (response.data.error) {
                    this.error = response.data.error;
                    console.log(response.data.error);
                } else if (response.data.status) {
                    // reload page
                    this.populate(this.$route);
                    this.editmode = false;
                }
            });
        },
        
        getDeleteTitleText(obj) {
            if (obj.text) {
                if (obj.text.length > 0)
                    return "Delete all text before removing column";
                return "Remove Column";
            } else if (obj.stats) {
                if (obj.stats.length > 0)
                    return "Remove all stats before removing column";
                return "Remove Column";
            } else if (obj.name && obj.value) {
                if (obj.name.length > 0 || obj.value.length > 0)
                    return "Remove stat values before removing stat";
                return "Remove Stat";
            } else if (obj.columns) {
                if (obj.columns.length > 0)
                    return "Remove all columns before removing row";
                return "Remove Row";
            }
            return "";
        }
    },
    calculated: {
    },
    beforeRouteEnter(to, from, next) {
        next(vm => vm.populate(to));
    },
    created() {
        this.imhost = ImageHostService.host;
        this.thisuser = UserService.username;
        UserService.listen(() => {
            this.thisuser = UserService.username;
            this.imhost = ImageHostService.host;
            if (this.editmode) {
                if (this.thisuser != this.username) {
                    this.editmode = false;
                }
            }
        })
    }
}
</script>

<style lang="scss" scoped>

.crumbs {
    font-size: 24px;
    font-weight: bold;
    margin: 10px;

    a {
        margin-right: 10px;
    }
}

.char-sheet-page {
     background-color: grey;
     padding: 20px;
    .char-sheet-style-box {
        border-radius: 20px;
        background-color: white;
        padding: 20px;
    }

    .character-name {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        margin-top: 20px;
    }

    .character-icon {
        display: flex;
        .char-small-icon {
            width: 50px;
            border: 5px solid #880000;
            border-radius: 50%;
            margin-top: 0;
            margin-bottom: auto;
            display: block;
        }
    }

    .character-title {
        font-style: italic;
    }

    .character-stat-block {
        .block-row {
            position: relative;
            min-height: 200px;
            border: 10px solid grey;
            border-radius: 10px;
            margin: 5px;
            display: flex;
            padding: 10px;
            padding-top: 30px;
            position: relative;
            flex-wrap: wrap;

            .row-remove {
                position: absolute;
                top: 0;
                left: 0;
            }

            .block-row-title {
                position: absolute;
                top: 10px;
                font-weight: bold;
                font-size: 20px;
                display: flex;
                padding-left: 30px;
            }

            .block-column {
                min-width: 200px;
                border: 5px solid grey;
                border-radius: 5px;
                margin: 10px;
                padding: 10px;
                position: relative;

                .column-remove {
                    position: absolute;
                    top: 0;
                    right: 0;
                }

                .block-column-title {
                    font-weight: bold;
                    font-size: 18px;
                }

                .column-text-block {

                    textarea {
                        min-height: 100px;
                        overflow: hidden;
                    }
                }

                .block-stat > div{
                    display: flex;
                    .stat-value {
                        text-align: right;
                        flex-grow: 1;
                    }
                }
            }
        }
    }
}
</style>