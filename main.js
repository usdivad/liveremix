//iv
var context = new window.AudioContext();

var urls = [
	"./ghastly/guit1.mp3", //0
	"./ghastly/guit2.mp3", //1
	"./ghastly/bass1.mp3", //2
	"./ghastly/bass2.mp3", //3
	"./ghastly/vox1.mp3", //4
	"./ghastly/vox2.mp3", //5
	"./ghastly/fx1.mp3", //6
	"./ghastly/fx2.mp3", //7
	"./ghastly/perc1.mp3", //8
	"./ghastly/perc2.mp3" //9
];
var bufferLoader = new BufferLoader(context, urls, finishedLoading);
bufferLoader.load();
var bufferList;
var trk1;
var ch_guit, ch_bass, ch_vox, ch_fx, ch_perc;
var tracks = [];
var channels = []

//do



//fn
function finishedLoading() {
	console.log("hey" + bufferLoader.bufferList);
	
	//has to come after loaded duh
	bufferList = bufferLoader.bufferList;
	//trk = new Track(bufferList[0], context);
	for (var i=0; i<bufferList.length; i++) {
		var t = new Track(bufferList[i], context);
		tracks.push(t);
	}

	//channel designations
	ch_guit = new Channel(tracks.slice(0,2), context); //0,1
	ch_bass = new Channel(tracks.slice(2,4), context); //2,3
	ch_vox = new Channel(tracks.slice(4,6), context); //4,5
	ch_fx = new Channel(tracks.slice(6,8), context); //6,7
	ch_perc = new Channel(tracks.slice(8), context); //8,9

	channels = [ch_guit, ch_bass, ch_vox, ch_fx, ch_perc];

	//we make 2 for-loops because of ordering
	for (var i=0; i<channels.length; i++) {
		channels[i].playAll();
	}
	for (var i=0; i<channels.length; i++) {
		channels[i].select(0);
	}

}

function Track(buf, ctx) {
	var trk = this;

	//initial load()
	trk.source = ctx.createBufferSource();
	trk.source.buffer = buf;
	
	trk.gainNode = ctx.createGain();
	trk.source.connect(trk.gainNode);
	trk.gainNode.connect(ctx.destination);

	//loop on
	trk.source.loop = true;
	console.log(trk.source.loop);

	trk.load = function() {
		trk.source = ctx.createBufferSource();
		trk.source.buffer = buf;
		
		trk.gainNode = ctx.createGain();
		trk.source.connect(trk.gainNode);
		trk.gainNode.connect(ctx.destination);
	}

	trk.start = function() {
		trk.load();
		trk.mute(); //default mute
		trk.source.start(0);
	}

	trk.stop = function() {
		trk.source.stop(0);
	}

	trk.mute = function() {
		trk.gainNode.gain.value = 0;
	}

	trk.unmute = function() {
		trk.gainNode.gain.value = 1;
	}
}

function Channel(tracklist) {
	//guts
	var ch = this;
	ch.tracklist = tracklist;

	ch.select = function(n) { //n = iNdex
		for (var i=0; i<tracklist.length; i++) {
			if (i==n) {
				tracklist[i].unmute();
			}
			else {
				tracklist[i].mute();
			}
		}
	};

	ch.playAll = function() {
		for (var i=0; i<tracklist.length; i++) {
			tracklist[i].start();
		}
	};
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