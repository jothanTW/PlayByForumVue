<template>
    <div class="editor-body">
        <div class="editor-controls">
            <button class="format add-bold" @click="addBoldBB()">B</button>
            <button class="format add-italic" @click="addItalicBB()">I</button>
            <button class="format add-underline" @click="addUnderlineBB()">U</button>
        </div>
        <div class="editor-textbox">
            <textarea v-model="edittext" ref="textArea"></textarea>
        </div>
    </div>
</template>

<script>
export default {
    name: "TextEditor",
    data() {
        return {
            edittext: ""
        }
    },
    methods: {
        clearText() {
            this.edittext = ""
        },
        setText(value) {
            this.edittext = value;
        },
        addBoldBB() {
            this.addTextAroundCursor('[b]', '[/b]');
        },
        addItalicBB() {
            this.addTextAroundCursor('[i]', '[/i]');

        },
        addUnderlineBB() {
            this.addTextAroundCursor('[u]', '[/u]');

        },
        addQuote(post) {
            this.addTextAroundCursor("[quote=\"" + post.header.name + "\"]\n" + post.textBlock.text + "\n[/quote]");
        },
        addTextAroundCursor(textBefore, textAfter) {
            let pos = this.$refs.textArea.selectionStart;
            if (pos == 0 || pos) {
                let endpos = this.$refs.textArea.selectionEnd;
                let newstr = this.$refs.textArea.value.substring(0, pos) + textBefore + this.$refs.textArea.value.substring(pos, endpos);
                if (textAfter)
                    newstr += textAfter;
                newstr += this.$refs.textArea.value.substring(endpos);
                this.edittext = newstr;
            } else {
                this.edittext += textBefore;
                if (textAfter)
                    this.edittext += textAfter;
            }
        }
    },
    watch: {
        edittext: function() {
            this.$emit('edit', this.edittext);
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-body {

    .editor-controls {
        .add-bold {
            font-weight: bold;
        }

        .add-italic {
            font-style: italic;
        }

        .add-underline {
            text-decoration: underline;
        }
    }

    .editor-textbox {

        textarea {
            min-height: 300px;
            width: 100%;
        }
    }
}
</style>