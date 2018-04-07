(function () {
    function twitchCheck(){$.getJSON("https://api.twitch.tv/kraken/streams/Ashuvidz?client_id=yufsibfdh5gwli5nzdj01ceghc1ubv", function(channel) {
  //live is offline Youtube player appened
  if (channel["stream"] == null) {
    browser.browserAction.setIcon({path: "images/offline.png"});
    console.log("set icon offline");

    //live is online Twitch player
  } else {
      browser.browserAction.setIcon({path: "images/online.png"});
      console.log("set icon online");
    }
})};
twitchCheck();

browser.alarms.create('twitchAlarm', {delayInMinutes: 5, periodInMinutes: 5});

browser.alarms.onAlarm.addListener(function( twitchAlarm ) {
  twitchCheck();
})}
)();