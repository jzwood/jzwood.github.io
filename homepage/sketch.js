/*
 *	Jake w.
 * sketch for homepage
 */

var panes, paneCounter, broken

function setup() {
	var sketch = createCanvas(windowWidth, windowHeight).parent('sketch-container')
	panes = new collectPanes(0.8)
	var container = document.getElementById('sketch-container')
	container.style.opacity = 1
	var rick = document.querySelector('.rick-container')
	var reset = document.querySelector('.reset')

	window.setTimeout(function(){
		container.addEventListener('mousedown',function(e){
			broken = true
			rick.classList.remove('hide')
			container.classList.remove('pointable')
			window.setTimeout(function(){
				reset.classList.remove('hide')
				reset.addEventListener('mousedown', resetAll)
			},1000)
		})
	},1000)
}

function resetAll(){
	var reset = document.querySelector('.reset')
	reset.classList.add('hide')

	var container = document.getElementById('sketch-container')
	container.classList.add('pointable')

	broken = false
	setup()
}

function draw() {
	clear()
	drawPanes(panes)
}

function drawPanes(panes) {
	stroke(255,255,255)
	for (var i = 0, maxi = panes.stack.length; i < maxi; i += 8) {
		var state = panes.attr[i / 8]
		var threshold = (paneCounter < 5) ? 0.05 : 0.2 //mess with these values
		if (Math.random() < threshold && broken && !state[0]) {
			state[0] = true
			paneCounter--
		}

		if (broken) {
			var acceleration = 1.5 //seems pretty good. change at will
			state[1] = state[0] ? Math.max(state[1] * acceleration, -screen.width - screen.height) : -0.1 // max prevents infinite regress
		}
		colorMode(HSB, 255)
		fill(color(~~(i/8)%255, 100, 255))
		var decr = state[1]
		quad(panes.stack[i], panes.stack[i + 1] - decr, panes.stack[i + 2], panes.stack[i + 3] - decr,
			panes.stack[i + 4], panes.stack[i + 5] - decr, panes.stack[i + 6], panes.stack[i + 7] - decr)
	}
}

function collectPanes(radLim) {
	var hx = 0.4 * windowWidth,
		hy = 0.6 * windowHeight //home (x,y)
	this.stack = []
	//var incr = Math.PI/40//degrees between spokes
	var incr = Math.PI / 9.9
	var limit = radLim * Math.max(windowWidth, windowHeight) //should cover most of screen
	var b = 0,
		m = 10
	//var b = 5, m = 10
	for (var angle = 0; angle < 2 * Math.PI; angle += incr) {
		recursiveGlass(this.stack, hx, hy, b, m, limit, hx + Math.cos(angle), hy - Math.sin(angle), hx + Math.cos(angle + incr), hy - Math.sin(angle + incr), angle, angle + incr)
	}
	this.attr = []
	for (var a = 0, z = this.stack.length; a < z; a += 8) {
		this.attr.push([false, -1]) //random, arbitrary
	}

}

function recursiveGlass(stack, hx, hy, b, m, limit, x1, y1, x2, y2, a1, a2) {
	if (Math.sqrt((x1 - hx) * (x1 - hx) + (y1 - hy) * (y1 - hy)) > limit || Math.sqrt((x2 - hx) * (x2 - hx) + (y2 - hy) * (y2 - hy)) > limit) {
		return false //base case, terminate function
	} else {
		var dx = Math.cos(a1),
			dy = Math.sin(a1)
		var dist = b + m * Math.random()

		var x3 = x1 + dist * dx
		var y3 = y1 + dist * dy

		dx = Math.cos(a2)
		dy = Math.sin(a2)
		dist = b + m * Math.random()
		var x4 = x2 + dist * dx
		var y4 = y2 + dist * dy

		stack.push(x1, y1, x2, y2, x4, y4, x3, y3)
		recursiveGlass(stack, hx, hy, b, m, limit, x3, y3, x4, y4, a1, a2)
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	if(!broken) panes = new collectPanes(0.8)
}
