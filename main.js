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

//make sure you name the track divs the same as the urls
//silly but c dep
var track_divs = [];
for (var i=0; i<urls.length; i++) {
	var trackDiv;
	var trackName = urls[i];
	var lastSplash = trackName.lastIndexOf("/");
	trackName = trackName.slice(lastSplash+1);
	
	var dot = trackName.lastIndexOf(".");
	trackName = trackName.slice(0, dot);
	//console.log("'"+trackName+"'");
	trackDiv = document.getElementById(trackName);
	track_divs.push(trackDiv);
}

//buffer loading
var track_sounds = [];
var bufferLoader = new BufferLoader(context, urls, finishedLoading);
bufferLoader.load();
var bufferList;
var ch_guit, ch_bass, ch_vox, ch_fx, ch_perc;
var tracks = [];
var channels = [];




//do



//fn

//done loading buffers
function finishedLoading() {
	console.log("hey" + bufferLoader.bufferList);
	
	//has to come after loaded duh
	bufferList = bufferLoader.bufferList;
	//trk = new Track(bufferList[0], context);
	for (var i=0; i<bufferList.length; i++) {
		var t = new Track(bufferList[i], context, track_divs[i]);
		tracks.push(t);
	}

	//channel designations
	ch_guit = new Channel(tracks.slice(0,2)); //0,1
	ch_bass = new Channel(tracks.slice(2,4)); //2,3
	ch_vox = new Channel(tracks.slice(4,6)); //4,5
	ch_fx = new Channel(tracks.slice(6,8)); //6,7
	ch_perc = new Channel(tracks.slice(8)); //8,9

	channels = [ch_guit, ch_bass, ch_vox, ch_fx, ch_perc];

	//we make 2 for-loops because of ordering
	for (var i=0; i<channels.length; i++) {
		channels[i].playAll();
	}
	for (var i=0; i<channels.length; i++) {
		channels[i].select(Math.floor(Math.random()*2));
	}

}

//track class
//buf = audiobuffersource, ctx = context, div = corresponding track div
function Track(buf, ctx, div) {
	var trk = this;
	trk.isMuted = true; //instantiate as muted in .load()

	//div actions
	trk.div = div;
	/*div.onclick = function() {
		if (trk.isMuted) {
			trk.unmute();
		}
		else {
			trk.mute();
		}
	}*/

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

		trk.source.loop = true;
		
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
		divDeselect(div);
		trk.isMuted = true;
		console.log("(yes i've been muted)");
	}

	trk.unmute = function() {
		trk.gainNode.gain.value = 1;
		divSelect(div);
		trk.isMuted = false;
	}
}

//channel class
//tracklist is local to the channel self
function Channel(tracklist) {
	//guts
	var ch = this;
	ch.tracklist = tracklist;

	//dynamically setting onclick functions for track divs
	for (var i=0; i<ch.tracklist.length; i++) {
		//use with() to introduce new scope for onclick!
		with ({t_i: i}) {
			var t = ch.tracklist[t_i];
			var t_d = t.div;
			t_d.onclick = function() {
				if (ch.tracklist[t_i].isMuted) { //don't use t, use ch.tracklist[t_i]
					/*
					(function(idx) {
						ch.select(idx);
						console.log(idx);
					})(t_i); //anonymous fn forces new scope
					*/

					ch.select(t_i);
					console.log(t_i);
				}
				else {
					//mute all! ui choice
					ch.muteAll();
					console.log(ch.tracklist[t_i]);
				}
			}; //end t_d.onclick declaration
		} //end with
	} //end for

	
	ch.select = function(n) { //n = iNdex
		for (var i=0; i<tracklist.length; i++) {
			if (i==n) {
				tracklist[i].unmute();
				console.log(i+ " unmuted");
			}
			else {
				tracklist[i].mute();
				console.log(i+ " muted");
			}
		}
	};
	

	/*ch.select = function(t) { //t = track
		for (var i=0; i<tracklist.length; i++) {
			tracklist[i].mute();
		}
		t.unmute();
	}*/

	ch.playAll = function() {
		for (var i=0; i<tracklist.length; i++) {
			tracklist[i].start();
		}
	};

	ch.muteAll = function() {
		for (var i=0; i<tracklist.length; i++) {
			tracklist[i].mute();
		}
	}
}

//div functions
function divClick(track, channel, index) {
	if (track.isMuted) {
		channel.select(index);
		console.log(index);
	}
	else {
		//do nothing
	}

}

function divSelect(d) {
	d.style.opacity = 1;
}

function divDeselect(d) {
	d.style.opacity = 0.5;
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