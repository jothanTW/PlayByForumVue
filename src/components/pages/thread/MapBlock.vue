<template>
    <div class="map-block">
        <div class="new-map-dialog">
            <div class="new-map-display">
                <canvas ref="newMapCanvas"></canvas>
                <canvas class="canvas-grid" ref="newGridCanvas"></canvas>
            </div>
            <div class="new-map-controls">
                <input type="text" v-model="newMapImg" placeholder="New Map Image Source">
                <input type="range" min="10" max="200" v-model="gridscale">
            </div>
        </div>
        <div class="map-displayer">

        </div>
    </div>
</template>

<script>
export default {
    name: "MapBlock",
    data() {
        return {
            maps: [],
            newMapImg: "",
            gridscale: "90"
        }
    },
    methods: {
        drawCanvas() {
            let canvas = this.$refs.newMapCanvas;
            let ctx = canvas.getContext("2d");
            let bimg = new Image();
            bimg.src = this.newMapImg;
            let gridscale = this.gridscale;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            bimg.onload = function() {
                canvas.height = canvas.width / bimg.width * bimg.height;
                ctx.drawImage(bimg, 0, 0, canvas.width, canvas.height);
            }
            this.drawGridCanvas();
        }, 
        drawGridCanvas() {
            let canvas = this.$refs.newGridCanvas;
            let ctx = canvas.getContext("2d");
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.strokeStyle = "rgba(200,200,200,0.5)";
            ctx.lineWidth = 3;
            let gridscale = parseInt(this.gridscale);
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += gridscale) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
            }
            for (let i = 0; i < canvas.height; i += gridscale) {
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
            }
            ctx.stroke();
        }
    },
    watch: {
        newMapImg: function() {
            this.drawCanvas();
        },
        gridscale: function() {
            this.drawGridCanvas();
        }
    }
}
</script>

<style lang="scss" scoped>
.map-block {
    .new-map-dialog {
        .new-map-display {
            width: 100%;
            position: relative;
            img, canvas {
                width: 100%;
            }
            .canvas-grid {
                position: absolute;
                height: 100%;
                left: 0;
            }
            
        }
    }
}
</style>