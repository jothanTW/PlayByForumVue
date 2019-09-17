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
        // overwrite the default img tag to prevent xss
        this.tags["img"] = new BBTag("img", true, false, false, function (tag, content, attr) {
            let ncontent = content.replace(/"|'/g, '');
            return "<img src=\"" + ncontent + "\" />";
        });
        // overwrite the default url tag for the same reason
        this.tags["url"] = new BBTag("img", true, false, false, function (tag, content, attr) {
            var link = content;
        
            if (attr["site"] != undefined) {
                link = BBCode.escapeHTML(attr["site"]);
             }
        
            if (!BBCode.startsWith(link, "http://") && !BBCode.startsWith(link, "https://")) {
                link = "http://" + link;
            }

            link = link.replace(/"|'/g, '');
        
            return "<a href=\"" + link + "\" target=\"_blank\">" + content + "</a>";
        });
        this.tags["spoiler"] = new BBTag("spoiler", true, false, false, function(tag, content, attr) {
            return '<div class="spoiler-text">' + content + '</div>'
        })
        this.parser = new BBCode(this.tags);
    }
    cleanText(text) {
        return text//.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    }
    formatText(text) {
        return this.parser.parseString(this.cleanText(text));
    }
}

export default new PostService();