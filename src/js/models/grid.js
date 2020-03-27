//@format
export default class Grid {
    constructor(w, h) {
        this.w = w
        this.h = h
        this.img = new Image();
        this.load()
    }

    // NOTE: Straight outta $tack0verflow:
    //       http://codereview.stackexchange.com/a/114703
    load() {
        var data = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="${this.w}" height="${this.h}"
                             patternUnits="userSpaceOnUse">
                        <path d="M ${this.w} 0 L 0 0 0 ${this.h}" fill="none" stroke="gray"
                              stroke-width="0.5" />
                    </pattern>
                    <pattern id="grid" width="80" height="80"
                             patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)" />
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray"
                              stroke-width="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        `
        var DOMURL = window.URL || window.webkitURL || window
        var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'})
        var url = DOMURL.createObjectURL(svg)

        this.img.onload = function () {
            DOMURL.revokeObjectURL(url)
        }
        this.img.src = url
    }

    update() {
        //nop
    }

    render() {
        window.globals.ctx.drawImage(this.img, 0, 0)
    }
}
