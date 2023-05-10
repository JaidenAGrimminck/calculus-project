//main hole, long depth is 5cm
//butt side hole is 1.4cm

const body = {
    objects: ["main", "neck", "butt"],
    main: {
        outer: {
            height: 10.8,
            diameter: 2.55,
            radius() {
                return this.diameter / 2;
            }
        },
        hole1: { //butt side hole
            height: 1.4 - 0.15,
            diameter: 0.7,
            radius() {
                return this.diameter / 2;
            }
        },
        hole2: { //neck side hole
            height: 1,
            diameter: 0.5,
            radius() {
                return this.diameter / 2;
            }
        }
    },
    neck: {
        outer: {
            height: 1.6,
            diameter: 2.05,
            radius() {
                return this.diameter / 2;
            }
        },
        hole: {
            height: 1.6,
            diameter: 1.6,
            radius() {
                return this.diameter / 2;
            }
        }
    },
    butt: {
        outer: {
            height: 0.15,
            diameter: 2.4,
            radius() {
                return this.diameter / 2;
            }
        },
        hole: {
            height: 0.15,
            diameter: 0.7,
            radius() {
                return this.diameter / 2;
            }
        },
    }
}

export default body;