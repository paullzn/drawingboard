var __instance = null

export class Server {
    constructor() {
        this.host = 'http://localhost:8129/api/v1/artwork'
    }

    getInstance() {
        if (!__instance) {
            __instance = new Server()
        }
        return __instance
    }

    gen_artwork_id() {
        return ''
    }

    put_artwork(artwork_id, image) {

    }

    get_artwork(artwork_id) {
        
    }
}