//// UTILS /////////////////////////////////////////////////////////////////////

class Log {
    constructor() {}
    static i(s) { console.log("[INFO] " + s); }
    static d(s) { console.debug("[DEBUG] " + s); }
    static e(s) { console.error("[ERROR] " + s); }

}

function setCursorByID(id, cursorStyle)
{
    var elem;
    if (document.getElementById && (elem=document.getElementById(id)) ) {
        if (elem.style) {
            elem.style.cursor=cursorStyle;
        }
    }
}

//// CONFIG ////////////////////////////////////////////////////////////////////

class Config {
    constructor() {}

    static bgcolor = 'white';
}

//// POINT /////////////////////////////////////////////////////////////////////

class Point {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    get length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    dist(p) { return new Point(p.x - this.x, p.y - this.y) }
    add(p) { return new Point(p.x + this.x, p.y + this.y) }
    inv(p) { return new Point(-this.x, -this.y) }
}

//// NODE //////////////////////////////////////////////////////////////////////

class Node {
    constructor(p)
    {
        this.ctx = null;
        this._p = p;
        this.p = p;
        this.r = 3;
        this.color = 'black';
        this.isCatched = false;
    }

    setContext(context) { this.ctx = context; return this; }
    setColor(color) { this.color = color; return this; }
    setPos(p) { this.p = p; return this; }

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

    move(p)
    {
        this.eraseNode();
        this.setPos(p);
        this.drawNode();
    }

    drawNode()
    {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(this.p.x, this.p.y, this.r, 0, 2 * Math.PI);
        this.ctx.stroke();
        return this;
    }

    eraseNode()
    {
        let d = this.r + 2;
        this.ctx.clearRect(this.p.x - d, this.p.y - d, 2 * d, 2 * d);
    }
}

//// GRAPH /////////////////////////////////////////////////////////////////////

class Graph {
    constructor(object)
    {
        this.id = object.id;
        Log.i(object.id);
        this.back_canvas = object.getElementsByClassName("_layer0")[0];
        this.front_canvas = object.getElementsByClassName("_layer1")[0];
        this.b_ctx = this.back_canvas.getContext('2d');
        this.f_ctx = this.front_canvas.getContext('2d');
        this.origo = new Point(0, 0);
        this.nodes = [];

        this.resize();

        this.mousedown = [0, 0, 0];

        this.front_canvas.addEventListener('mousedown', e => {
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

        this.front_canvas.addEventListener('mousemove', e => {
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

        this.front_canvas.addEventListener('mouseup', e => {
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

        Log.d(this.id + " is ready!")
    }

    resize()
    {
        let obj = document.getElementById(this.id);
        Log.i(obj.width + ", " + obj.height);
        this.b_ctx.canvas.width = obj.clientWidth;
        this.b_ctx.canvas.height = obj.clientHeight;
        this.f_ctx.canvas.width = obj.clientWidth;
        this.f_ctx.canvas.height = obj.clientHeight;

        this.f_ctx.clearRect(0, 0, this.f_ctx.canvas.width, this.f_ctx.canvas.height);
        this.b_ctx.clearRect(0, 0, this.b_ctx.canvas.width, this.b_ctx.canvas.height);
        this.b_ctx.fillRect(20, 30, 40, 50);
        for (let node of this.nodes) {
            node.drawNode();
        }
    }

    addNode(node)
    {
        node.setContext(this.f_ctx);
        node.drawNode();
        this.nodes.push(node);
    }
}

//// MAIN //////////////////////////////////////////////////////////////////////

let graphs = [];
function loadGraphs()
{
    var elements = document.getElementsByClassName("_graph");
    for (let object of elements)
    {
        Log.i(object.getElementsByClassName("_layer0")[0]);
        graph = new Graph(object);
        object.onresize = graph.resize;

        graph.addNode(new Node(new Point(30, 30)).setColor('green'));
        graph.addNode(new Node(new Point(60, 30)).setColor('black'));
        graphs.push(graph);
    }
}

loadGraphs();

function graph_1()
{
}

function graph_2()
{
}
