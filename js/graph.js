// When true, moving the mouse draws on the canvas

//var canvases = document.getElementsByClassName("_graph");

function logi(s) { console.log("[INFO] " + s); }
function logd(s) { console.debug("[DEBUG] " + s); }
function loge(s) { console.error("[ERROR] " + s); }

class Config {
    constructor()
    {}

    static bgcolor = 'red';
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dist(p) {
        return new Point(p.x - this.x, p.y - this.y)
    }

    add(p) {
        return new Point(p.x + this.x, p.y + this.y)
    }

    inv(p) {
        return new Point(-this.x, -this.y)
    }
}

class Node {
    constructor(context, p) {
        this.ctx = context;
        this._p = p;
        this.p = p;
        this.r = 3;
        this.color = 'black';
        this.isCatched = false;
    }

    setColor(color) {
        this.color = color;
        return this;
    }
    setPos(p) {
        this.p = p;
        return this;
    }

    hittest(p)
    {
        let res = 0;
        let l = this.p.dist(p).length;
        if (l <= this.r + 2) {
            res = 1;
        }
        if (l <= this.r) {
            res = 2;
        }
        return res;
    }

    move(p) {
        this.eraseNode();
        this.setPos(p);
        this.drawNode();
    }

    drawNode() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(this.p.x, this.p.y, this.r, 0, 2 * Math.PI);
        this.ctx.stroke();
        return this;
    }

    eraseNode() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = Config.bgcolor;
        this.ctx.lineWidth = 3;
        this.ctx.arc(this.p.x, this.p.y, this.r, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}

function setCursorByID(id, cursorStyle) {
 var elem;
 if (document.getElementById &&
    (elem=document.getElementById(id)) ) {
  if (elem.style) elem.style.cursor=cursorStyle;
 }
}

class Graph {
    constructor(canvas) {
        this.id = canvas.id;
        this.ctx = canvas.getContext('2d');
        this.origo = new Point(0, 0);

        this.ctx.fillStyle = Config.bgcolor;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.nodes = [
            new Node(this.ctx, new Point(60, 30)).setColor('black').drawNode(),
            new Node(this.ctx, new Point(30, 30)).setColor('green').drawNode()
        ];

        this.mousedown = [0, 0, 0];
        canvas.addEventListener('mousedown', e => {
            let isBackGround = true;
            this.mousedown[e.button] = 1;
            let p = new Point(e.offsetX, e.offsetY);
            for (let node of this.nodes) {
                if (node.hittest(p) == 2) {
                    node.move(p);
                    node.isCatched = true;
                    isBackGround = false;
                    break;
                }
            }
            if (isBackGround) {
                setCursorByID(this.id, "move");
            }
        });

        canvas.addEventListener('mousemove', e => {
            let p = new Point(e.offsetX, e.offsetY);
            for (let node of this.nodes) {
                let test = node.isCatched ? 2 : node.hittest(p);
                if (test > 0) {
                    if (test == 2) {
                        setCursorByID(this.id, "pointer");
                        if (this.mousedown[0] == 1) {
                            node.move(p);
                        }
                    } else {
                        setCursorByID(this.id, "auto");
                    }
                    break;
                }
            }
        });

        canvas.addEventListener('mouseup', e => {
            this.mousedown[e.button] = 0;
            let isBackGround = true;
            for (let node of this.nodes) {
                if (node.isCatched) {
                    node.isCatched = false;
                    isBackGround = false;
                }
            }
            if (isBackGround) {
                setCursorByID(this.id, "auto");
            }
        });

        logd(this.id + " is ready!")
    }
}

var canvases = document.getElementsByTagName("CANVAS");
let graphs = [];
for (let canvas of canvases)
{
    graphs.push(new Graph(canvas));
}

