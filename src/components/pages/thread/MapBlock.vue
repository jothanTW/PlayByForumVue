<template>
    <div class="map-block">
        <div class="new-map-dialog">
            <div class="new-map-controls">
                <div>
                    Map Name
                    <input type="text" v-model="newMapName">
                    <button @click="submitNewMap">Upload Map</button>
                </div>
                <div>
                    Map Image Source
                    <input type="text" v-model="newMapImg">
                </div>
                <div>
                    Grid Width (in cells): {{ gridscale }}
                    <input type="range" min="5" max="100" v-model="gridscale">
                </div>
                <div>
                    Grid Cell Offset: {{ gridtransX }}% by {{ gridtransY }}%
                    <input type="range" min="0" max="99" v-model="gridtransX">
                    <input type="range" min="0" max="99" v-model="gridtransY">
                </div>
            </div>
            <div v-if="error.length">{{ error }}</div>
            <div class="new-map-display">
                <canvas ref="newMapCanvas"></canvas>
                <canvas class="canvas-grid" ref="newGridCanvas"></canvas>
            </div>
        </div>
        <div class="map-displayer">

        </div>
    </div>
</template>

<script>
import ForumService from "@/services/forum.service";

export default {
    name: "MapBlock",
    data() {
        return {
            maps: [],
            newMapImg: "",
            newMapName: "",
            gridscale: "50",
            gridtransX: "0",
            gridtransY: "0",
            error: "",
            newImgGood: false
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
            let vm = this;

            bimg.onload = function() {
                canvas.height = canvas.width / bimg.width * bimg.height;
                ctx.drawImage(bimg, 0, 0, canvas.width, canvas.height);
                vm.drawGridCanvas();
                console.log("AAAA");
                vm.newImgGood = true;
            }

            bimg.onerror = function(e) {
            }
        }, 
        drawGridCanvas() {
            let canvas = this.$refs.newGridCanvas;
            let ctx = canvas.getContext("2d");
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.strokeStyle = "rgba(200,200,200,0.5)";
            ctx.lineWidth = 3;
            let gridscale = canvas.width / parseInt(this.gridscale);
            let gridtransX = parseInt(this.gridtransX) / 100.0;
            let gridtransY = parseInt(this.gridtransY) / 100.0;
            ctx.beginPath();
            for (let i = gridscale * gridtransX; i < canvas.width; i += gridscale) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
            }
            for (let i = gridscale * gridtransY; i < canvas.height; i += gridscale) {
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
            }
            ctx.stroke();
        },
        submitNewMap() {
            if (this.newMapName.length == 0) {
                this.error = "Map name required!";
                return;
            }
            if (this.newMapImg.length == 0) {
                this.error = "Map source required!";
                return;
            }
            if (this.newImgGood == false) {
                this.error = "Invalid map image source";
                return;
            }

            // send the map
            ForumService.sendMap(this.$route.params.thread, this.newMapName, this.newMapImg, this.gridscale, this.gridtransX, this.gridtransY).then(response => {
                console.log("Map sent");
            })
        }
    },
    watch: {
        newMapImg: function() {
            this.newImgGood = false;
            this.drawCanvas();
        },
        gridscale: function() {
            this.drawGridCanvas();
        },
         gridtransX: function() {
            this.drawGridCanvas();
        },
         gridtransY: function() {
            this.drawGridCanvas();
        },
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
        .new-map-controls {
            display: flex;

            >div {
                display: flex;
                flex-direction: column;
                text-align: center;
            }

            input {
                margin: 10px;
            }
            input[type="range"] {
                width: 200px;
            }
        }
    }
}
</style>