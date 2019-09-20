<template>
    <div class="profile-body">
        <div class="crumbs">
            <router-link to="/">Home</router-link>&lt; User Profile Page
        </div>
        <div v-if="username.length">
            <div class="profile-header">Hi {{username}}!!</div>
            <div class="user-image">
                <img v-if="userimage.length" ref="userImgPre" :src="userimage"><div v-else>You have no user icon. Upload one?</div>
                <div style="display: flex; flex-direction: column; font-style: italic">
                    Change your icon?
                    <input type="file" id="userImageUpload" @change="updateUserImage" accept="image/*">
                </div>
                <button @click="sendUserImageData" :disabled="!userimgmod">Save Image Changes</button>
            </div>
            <div class="user-title-text"><input type="text" placeholder="Optional Title Text"></div>
            <div class="user-stat-block unimplemented">THIS IS THE USER STAT BLOCK<br>IT ISN'T IMPLEMENTED YET</div>
            <div class="user-character-list">
                <div v-if="characters.length == 0">You have no character sheets!</div>
                <div v-else>You have {{ characters.length }} out of {{ maxCharacters }} character sheets uploaded.</div>
                <router-link v-for="(character, index) in characters" :key="'char' + index" :to="{name: 'character', params: { userid: username, characterid: character.id, characterPreLoad: character}}" class="profile-character-square">
                    <div class="character-small-icon"><img v-if="character.icon" :src="character.icon"></div>
                    <div class="character-name">{{ character.name }}</div>
                    <div class="character-thread" v-if="character.thread">{{ character.thread.title }}</div>
                </router-link>
                <div v-if="characters.length < maxCharacters" class="new-character-box">
                    <div class="new-character-query">
                        <p>Start a new character sheet?</p>
                        <button @click="createNewCharacter" :disabled="ncharname.length == 0">Create!</button>
                    </div>
                    <input type="text" v-model="ncharname" placeholder="Character Name">
                    <div class="character-icon-uploader">
                        <img ref="charIcoPre" v-if="imagePlaceholder.length" :src="imagePlaceholder"><div v-else>Choose a character icon-   </div>
                        <input style="margin-left: 20px" type="file" ref="charIcon" accept="image/*" placeholder="Character Icon" @change="updateImagePlaceholder">
                    </div>
                    <div class="error-text" v-if="errorText.length">{{ errorText }}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="profile-header">You are not logged in!</div>
        </div>
    </div>
</template>

<script>
import UserService from "@/services/user.service"
import ImageHostService from "@/services/imagehost.service"

export default {
    name: "UserProfile",
    data() {
        return {
            username: "",
            userimage: "",
            userimgmod: false,
            usertitle: "AAAA",
            characters: [],
            maxCharacters: 64, // get this from the server?
            maxIconSize: 150,
            imagePlaceholder: "",
            smallImagePlaceholder: "",
            errorText: "",
            ncharname: ""
        }
    },
    methods: {
        populate() {
            this.username = UserService.username;
            this.userimage = ImageHostService.host + UserService.usericon;
            UserService.getAllCharacters(this.username).then(response => {
                this.characters = response.data.characters;
                for (let character of this.characters) {
                    if (character.icon)
                        character.icon = ImageHostService.host + character.icon;
                }
            });
        },
        updateUserImage(e) {
            let icon = e.target.files[0];
            this.userimgmod = true;
            if (!icon) {
                this.userimage = ImageHostService.host + UserService.usericon;
                this.userimgmod = false;
                return;
            }
            if (icon.size > 1.2 * 1024 * 1024) {
                errorText = "Image is too big! should be under 1.2MB"
                icon.value = null;
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(icon);
            reader.onload = this.applyUserImage
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        updateImagePlaceholder(e) {
            let icon = e.target.files[0];
            if (!icon) {
                this.imagePlaceholder = "";
                return;
            }
            if (icon.size > 1.2 * 1024 * 1024) {
                errorText = "Image is too big! should be under 1.2MB"
                icon.value = null;
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(icon);
            reader.onload = this.applyImagePlaceholder;
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        applyImagePlaceholder(evt) {
            this.imagePlaceholder = evt.target.result;
            if (this.imagePlaceholder.length) {
                this.$nextTick(() => {
                    if (this.$refs.charIcoPre.width > this.maxIconSize || this.$refs.charIcoPre.height > this.maxIconSize)
                        this.errorText = "Icon is too big! should be " + this.maxIconSize + " by " + this.maxIconSize + " px";
                })
            }
        },
        applyUserImage(evt) {
            this.userimage = evt.target.result;
            if (this.userimage.length) {
                this.$nextTick(() => {
                    if (this.$refs.userImgPre.width > this.maxIconSize || this.$refs.userImgPre.height > this.maxIconSize)
                        this.errorText = "Icon is too big! should be " + this.maxIconSize + " by " + this.maxIconSize + " px";
                        this.userimgmod = false;
                })
            }
        },
        sendUserImageData() {
            let base64str = this.userimage.substring(this.userimage.indexOf("base64") + 7);
            UserService.sendImage(base64str);
        },
        createNewCharacter() {
            // build the character, and if the image exists, build that too
            let newChar = {
                characterName: this.ncharname,
                title: "",
                statBlock: { rows: [] }
            }
            let imgdata = null;
            if (this.imagePlaceholder.length) {
                imgdata = this.imagePlaceholder.substring(this.imagePlaceholder.indexOf("base64") + 7);
            } 
            
            UserService.createCharacter(newChar, imgdata).then(response => {
                if (response.data.status) {
                    this.ncharname = "";
                    this.$refs.charIcon.files[0].value = null;
                    this.populate();
                    
                }
                if (response.data.error) {
                    this.populate();
                    this.errorText = response.data.error;
                }
            });
        }
    },
    mounted() {
        this.populate();
    },
    created() {
        UserService.listen(this.populate);
    }
}
</script>

<style lang="scss" scoped>
.profile-body {

    .crumbs {
        font-size: 24px;
        font-weight: bold;
        margin: 10px;

        a {
            margin-right: 10px;
        }
    }

    .profile-header {
        font-size: 40px;
        font-weight: bold;
    }

    .user-image {
        margin: 20px;

        img {
            //border: 2px solid black;
            margin: 10px;
        }
    }

    .user-stat-block {
        margin: 40px;

        &.unimplemented {
            font-size: 40px;
            font-weight: bold;
            font-family: "Comic Sans MS", cursive, sans-serif;
        }
    }

    .user-character-list {

        .profile-character-square {
            display: flex;
            height: 70px;
            border: 2px solid black;
            margin: 10px;
            padding: 10px;
            transition: box-shadow 300ms ease-in, transform 300ms ease-in;
            cursor: pointer;

            &:hover {
                box-shadow: 4px 4px 4px black;
                transform: translate(-3px, -3px);
            }

            .character-small-icon {
                img {
                    height: 50px;
                    border-radius: 50%;
                    border: 5px solid #880000;
                }
                width: 90px;
                margin-top: auto;
                margin-bottom: auto;
            }

            .character-name {
                font-weight: bold;
            }
        }

        .new-character-box {
            border: 2px solid black;
            margin: 10px;
            padding: 10px;

            box-shadow: 4px 4px 4px black;
            width: 400px;
            //display: flex;
            //flex-direction: column;

            .new-character-query {
                font-style: italic;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;

                p {
                    margin: 0;
                }

                button {
                    display: block;
                    height: auto;
                }
            }

            input[type="text"] {
                width: 200px;
                font-size: 16px;
            }

            .character-icon-uploader {
                margin-top: 20px;
            }
        }
    }
}
</style>