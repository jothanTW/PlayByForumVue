let BBCode = require("bbcode-parser");
let BBTag = require("bbcode-parser/bbTag");

class PostService {
    constructor() {
        this.tags = BBCode.defaultTags();
        this.tags["quote"] = new BBTag("quote", true, false, false, function (tag, content, attr) {
            let poster = 'someone';
            if (attr["quote"])
                poster = attr.quote;

            return '<div class="quote-block"><div class="quote-head">' + poster + ' posted:</div>' + content + "</div>";
        });
        this.parser = new BBCode(this.tags);
    }
    cleanText(text) {
        return text.replace("<", "&lt;").replace(">", "&rt;");
    }
    formatText(text) {
        return this.parser.parseString(this.cleanText(text));
    }
}

export default new PostService();