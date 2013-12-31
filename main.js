//iv
var context = new window.AudioContext();

var urls = [
	"./ghastly/guit1.mp3",
	"./ghastly/guit2.mp3",
	"./ghastly/bass1.mp3",
	"./ghastly/bass2.mp3",
	"./ghastly/vox1.mp3",
	"./ghastly/vox2.mp3",
	"./ghastly/fx1.mp3",
	"./ghastly/fx2.mp3",
	"./ghastly/perc1.mp3",
	"./ghastly/perc2.mp3"
];
var bufferLoader = new BufferLoader(context, urls, finishedLoading);

//var ch1 = new Channel(new AudioBuffer(), context);

//do



//fn
function finishedLoading() {

}

function Channel(buf, ctx) {
	var ch = this;
	ch.source = ctx.createBufferSource();
	ch.source.buffer = buf;
	
	ch.gainNode = ctx.createGain();
	ch.source.connect(ch.gainNode);
	ch.gainNode.connect(ctx.destination);
}

//NYAR NYAR
function C_Beam(a, b) {
	var t = this;
	this.x = 0;
	this.y = 0;

	var x = this.x;
	var y = this.y;

	t.x = a;
	t.y = b;
}