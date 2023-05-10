
class Expression {
    constructor(type, value, lowerBound, upperBound) {
        this.type = "";
        this.lowerBound = lowerBound < upperBound ? lowerBound : upperBound;
        this.upperBound = upperBound > lowerBound ? upperBound : lowerBound;

        this.value = value.bind(this);
    }

    evaluate(x) {
        if (x < this.lowerBound || x > this.upperBound) {
            return null;
        } else {
            return this.value(x);
        }
    }

    latexForBounds(domain="y") {
        return `\\left\\{${this.lowerBound}<${domain}<${this.upperBound}\\right\\}`;
    }

    asLatex(domain="y", range="x", withBounds=true) {
        if (!withBounds) {
            return `${range}=${0}`;
        } else {
            return `${range}=${0}${this.latexForBounds(domain)}`;
        }
    }

    integrate(dy = 0.001) {
        let sum = 0;

        for (let x = this.lowerBound; x < this.upperBound; x += dy) {
            sum += this.value(x) * dy;
        }

        return sum;
    }

    soleExpression(domain="y", range="x") {
        return this.asLatex(domain, range, false).replace(`${range}=`, ``);
    }
}

class Line extends Expression {
    constructor(number, lowerBound, upperBound) {
        super("line", () => {
            return number;
        }, lowerBound, upperBound);
    }
    asLatex(domain="y", range="x", withBounds=true) {
        if (!withBounds) {
            return `${range}=${this.value()}`;
        } else {
            return `${range}=${this.value()}${this.latexForBounds(domain)}`;
        }
    }
}

class Linear extends Expression {
    constructor(slope, base, lowerBound, upperBound) {
        super("linear", (x) => {
            return slope * x + base;
        }, lowerBound, upperBound);
        this.slope = slope;
        this.base = base;
    }
    asLatex(domain="y", range="x", withBounds=true) {
        if (!withBounds) {
            return `${range}=${this.slope}${domain} + ${this.base}`;
        } else {
            return `${range}=${this.slope}${domain}${this.latexForBounds(domain)}+${this.base}`
        }
    }
}

class Parabola extends Expression {
    //h is the x coordinate of the vertex
    //k is the y coordinate of the vertex
    constructor(a, h, k, lowerBound, upperBound) {
        super("parabola", (x) => {
            return a * Math.pow(x - h, 2) + k;
        }, lowerBound, upperBound);
        this.a = a;
        this.h = h;
        this.k = k;
    }
    asLatex(domain="y", range="x", withBounds=true) {
        if (!withBounds) {
            return `${range}=${this.a}(${domain} - ${this.h})^2 + ${this.k}`;
        } else {
            return `${range}=${this.a}(${domain} - ${this.h})^2${this.latexForBounds(domain)} + ${this.k}`
        }
    }
}

class CubedParabola extends Expression {
    constructor(a, h, k, lowerBound, upperBound) {
        super("cubed_parabola", (x) => {
            return a * Math.pow(x - h, 3) + k;
        }, lowerBound, upperBound);
        this.a = a;
        this.h = h;
        this.k = k;
    }
    asLatex(domain="y", range="x", withBounds=true) {
        if (!withBounds) {
            return `${range}=${this.a}(${domain} - ${this.h})^{3} + ${this.k}`;
        } else {
            return `${range}=${this.a}(${domain} - ${this.h})^{3}${this.latexForBounds(domain)} + ${this.k}`
        }
    }
}

const expressions = {
    "main_line": new Line(0.83, 0.49, 7.775),
    "neck_line": new Line(0.614, 8.024, 8.96),
    "butt_bottom": new Parabola(-6.5, 0.299, 0.707, -0.0308, 0.28708),
    "main_neck_transition": new Parabola(-2.5, 7.726, 0.836, 7.775, 8.024),
    "first_topmost_neck": new CubedParabola(-20, 8.981, 0.565, 9.22, 9.286),
    "second_topmost_neck": new Parabola(-3.7, 8.923, 0.618, 8.956, 9.222),
    "main_butt_transition": new Parabola(-6.5, 0.5015, 0.83, 0.3476, 0.505),
    "butt_side": new Linear(-0.4754, 0.8426, 0.287, 0.3476),
};

const evaluations = {};

let real_expressions = {
    
};

let real_evaluations = {
    total: 0
};

function createRealExpressions() {
    const body = window.obj_body;

    real_expressions["butt"] = new Line(body.butt.outer.radius(), 0, body.butt.outer.height);
    real_expressions["butt_hole"] = new Line(body.butt.hole.radius(), 0, body.butt.hole.height);

    real_expressions["main"] = new Line(
        body.main.outer.radius(), 
        body.butt.outer.height, body.main.outer.height + body.butt.outer.height - 0.05
    );

    real_expressions["main_hole1"] = new Line(
        body.main.hole1.radius(),
        body.butt.outer.height, body.main.hole1.height + body.butt.outer.height
    );

    real_expressions["main_hole2"] = new Line(
        body.main.hole2.radius(),
        body.butt.outer.height + body.main.outer.height - body.main.hole2.height, body.butt.outer.height + body.main.outer.height
    );

    real_expressions["main_solid"] = new Line(
        0,
        body.butt.outer.height + body.main.hole1.height, body.butt.outer.height + body.main.outer.height - body.main.hole2.height
    )

    real_expressions["neck"] = new Line(
        body.neck.outer.radius(),
        body.butt.outer.height + body.main.outer.height,
        body.butt.outer.height + body.main.outer.height + body.neck.outer.height
    );

    real_expressions["neck_hole"] = new Line(
        body.neck.hole.radius(),
        body.butt.outer.height + body.main.outer.height,
        body.butt.outer.height + body.main.outer.height + body.neck.hole.height
    );

    real_expressions["neck_main_transition"] = new Parabola(
        -100, body.butt.outer.height + body.main.outer.height - 0.05,
        1.2748,
        body.butt.outer.height + body.main.outer.height - 0.05,
        body.butt.outer.height + body.main.outer.height
    )

    evaluateRealExpressions();
}

let real_visible = true;

function addToDesmos() {
    window.calculator.setExpression({
        id: "link",
        latex: `\\textcolor{transparent}{\\left(\\textcolor{#0b0}{\\mathrm{Click\\ me for image!}}\\right)}`
    })
    
    window.calculator.setExpression({
        id: "switch",
        latex: `\\textcolor{transparent}{\\left(\\textcolor{#00b}{\\mathrm{Click\\ to\\ switch}}\\right)}`
    })

    for (let key in expressions) {
        const expression = expressions[key];
        const latex = expression.asLatex();

        window.calculator.setExpression({
            id: key,
            latex,
            hidden: true
        })
    }

    const functions = "fghjklmnpqrst".split("");
    let on = 0;

    for (let key in real_expressions) {
        const expression = real_expressions[key];
        const latex = expression.asLatex("y", functions[on] + "(y)", true);

        //set it hidden
        window.calculator.setExpression({
            id: key,
            latex,
            hidden: false,
        })

        console.log(key)

        on++;
    }

    const link = document.getElementsByClassName("dcg-main")[0];

    link.style.cursor = "pointer";
    link.addEventListener("click", (e) => {
        window.open("https://www.desmos.com/calculator/jxjkdo34tb", "_blank");

        e.preventDefault();
        e.stopPropagation();
    })

    const switchGraph = document.getElementsByClassName("dcg-main")[1];

    switchGraph.style.cursor = "pointer";
    switchGraph.addEventListener("click", (e) => {
        real_visible = !real_visible;

        //Set all expressions to hidden
        for (let key in expressions) {
            const expression = expressions[key];

            window.calculator.setExpression({
                id: key,
                hidden: !real_visible
            })
        }

        //Set all real expressions to visible
        for (let key in real_expressions) {
            const expression = real_expressions[key];

            window.calculator.setExpression({
                id: key,
                hidden: real_visible
            })
        }
    });
}

function evaluateEachExpression() {
    let total = 0;

    for (let key in expressions) {
        const expression = expressions[key];

        evaluations[key] = expression.integrate();

        total += evaluations[key];
    }
    console.log("image-accurate", "pi", total, "cm^3");
}

function evaluateRealExpressions() {
    for (let key in real_expressions) {
        const expression = real_expressions[key];

        real_evaluations[key] = expression.integrate();
        real_evaluations["total"] += real_evaluations[key] * (key.includes("hole") || key.includes("solid") ? -1 : 1);
    }

    console.log("real-value", "pi", real_evaluations["total"], "cm^3");
}

function addLatexToSlides() {
    const node = document.getElementById("image-accurate");
    
    window.MathJax.typesetClear([node]);

    //add integrals
    let latex = `\\begin{align*}`

    let i = 0;

    for (let key in expressions) {
        const expression = expressions[key];

        if (i > 0) latex += "+ "
        latex += `\\pi \\int_{${expression.lowerBound}}^{${expression.upperBound}} (${expression.soleExpression()})^2dy ${i == 0 || i == Object.keys(expressions).length - 1 ? `` : `\\\\`}`;

        i++;
    }

    latex += `=V_{olume}\\end{align*}`;

    node.innerHTML = latex;

    window.MathJax.typesetPromise([node]).then(() => {
        console.log("done");
    })

    const real_node = document.getElementById("real-expressions");

    window.MathJax.typesetClear([real_node]);

    latex = `\\begin{align*}`
    i = 0;

    for (let key in real_expressions) {
        let subtracting = key.includes("hole") || key.includes("solid");
        
        latex += subtracting ? `-` : (i == 0 ? "" : `+`);

        const expression = real_expressions[key];

        let lowerBound = expression.lowerBound + "";
        let upperBound = expression.upperBound + "";
        //stop at 3 decimal places
        lowerBound = lowerBound.substring(0, lowerBound.indexOf(".") + 4);
        upperBound = upperBound.substring(0, upperBound.indexOf(".") + 4);

        latex += `\\pi \\int_{${lowerBound}}^{${upperBound}} (${expression.soleExpression()})^2dy `;

        if (i % 2 == 1) {
            latex += `\\\\`;
        }

        i++;
    }

    latex += `=V_{olume}\\end{align*}`;

    real_node.innerHTML = latex;

    window.MathJax.typesetPromise([real_node]).then(() => {
        console.log("done2");
    });
    
}

evaluateEachExpression();

setTimeout(() => {
    addLatexToSlides();
}, 1000)