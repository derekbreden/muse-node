

muse-node
=========

A game maybe

![image](http://i.imgur.com/diQk2Gf.gif)

# Running

* Get the [muse headband](http://www.choosemuse.com/)
* Get the [muse sdk](https://sites.google.com/a/interaxon.ca/muse-developer-site/download/macos-install---sdk-v2-2)
* Pair your shit.
* Run [muse-io](https://sites.google.com/a/interaxon.ca/muse-developer-site/museio/tutorial). 
  * `muse-io --preset 14 --device Muse --osc osc.udp://localhost:5000` is good.
  * You should be seeing something like ![image](https://cloud.githubusercontent.com/assets/39191/4486860/32465e9c-49ee-11e4-83ee-13d7e8611cf7.png)
* You might have to reinstall the node-serialport package to get a binary built for your machine. This repo right now handles mac only. 
  * You'll get an error from the next step if you do. :)
* Run `node server.js`
* Serve the public folder however you like
* You should be getting a live D3 visual of your brainwave EEG.


# Who

I didn't do anything except write a readme. [bobi-rakova](https://github.com/bobi-rakova/muse) did all the work.
