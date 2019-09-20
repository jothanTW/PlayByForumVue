import DBService from "@/services/db.service";

class ImageHostService {
    constructor() {
        this.host = "";
        DBService.getDBInfo().then(info => {
            this.host = info.host + "/icon/";
            // this is a hack to deal with the backend handling images itself
            // ideally we provide an image service or store the images directly with the site content
        })
    }
}

export default new ImageHostService();