
class TwitchNotifier
{
    constructor(twitchApiKey, twitchUserName)
    {
        this.twitchApiKey = twitchApiKey;
        this.twitchUserName = twitchUserName;
        this.localStorage = {};

        this.twitchUrl = `https://api.twitch.tv/helix/streams?user_login=${this.twitchUserName}`;
        this.twitchApiGetter = {
            method: 'GET',
            headers: {"Client-ID": this.twitchApiKey}
        };
    }

    async init()
    {
        this.localStorage = await browser.storage.local.get();

        if (!this.localStorage.linkUrl || !this.localStorage.isLive) {
            this.localStorage = {
                linkUrl: `https://youtube.com/${this.twitchUserName}/`,
                isLive: false,
            };
        }

        // CRON for webextensions
        browser.alarms.create('twitchAlarm', {delayInMinutes: 1, periodInMinutes: 1});
        browser.alarms.onAlarm.addListener(async () => {
            await this.update();
        });
        // When notification is clicked
        browser.notifications.onClicked.addListener(() => {
            browser.tabs.create({url: this.localStorage.linkUrl});
        });
        // When plugin icon is clicked
        browser.browserAction.onClicked.addListener(() => {
            browser.tabs.create({url: this.localStorage.linkUrl});
        });

        await this.update();
    }

    async update()
    {
        await this.checkTwitch();
        browser.storage.local.set(this.localStorage);

        if (this.localStorage.isLive) {
            browser.browserAction.setIcon({path: "images/online.png"});
        } else {
            browser.browserAction.setIcon({path: "images/offline.png"});
        }
    }

    async findGame(gameId)
    {
        const twitchGameUrl = `https://api.twitch.tv/helix/games?id=${gameId}`;

        const response = await fetch(twitchGameUrl, this.twitchApiGetter);
        if (response.status !== 200) {
            console.error('Error when fetching API Twitch', response);

            return null;
        }

        const game = await response.json();
        if (game.data.length === 0) {
            return null;
        }

        return game;
    }

    async findUser(userId)
    {
        const twitchUserUrl = `https://api.twitch.tv/helix/users?id=${userId}`;

        const response = await fetch(twitchUserUrl, this.twitchApiGetter);
        if (response.status !== 200) {
            console.error('Error when fetching API Twitch', response);

            return null;
        }

        const user = await response.json();
        if (user.data.length === 0) {
            return null;
        }

        return user;
    }

    async checkTwitch()
    {
        const response = await fetch(this.twitchUrl, this.twitchApiGetter);
        if (response.status !== 200) {
            console.error('Error when fetching API Twitch', response);
            return;
        }

        const channel = await response.json();
        if (channel.data.length === 0) {
            // twitch offline
            this.localStorage.isLive = false;

            return;
        }

        const title = channel.data[0].title;

        // twitch is live
        if (this.localStorage.isLive) {
            // already in live : prevent multiple notifications "online"
            return;
        }
        this.localStorage.isLive = true;

        const game = await this.findGame(channel.data[0].game_id);
        const gameName = game.data[0].name;

        const user = await this.findUser(channel.data[0].user_id);
        const profileImageUrl = user.data[0].profile_image_url;
        const username = user.data[0].display_name;

        await this.sendNotification(title, gameName, username, profileImageUrl);
    }

    async sendNotification(title, gameName, username, profileImageUrl)
    {
        this.localStorage.linkUrl = `https://twitch.tv/${this.twitchUserName}/`;
        browser.notifications.create('notifTwitchOffline', {
            type: 'basic',
            title: title,
            message: `${username} est en stream sur ${gameName}`,
            iconUrl: profileImageUrl,
        });
    }
}

(new TwitchNotifier('b90nfoacg9807542cq15o2qbv2g05q', 'ashuvidz')).init();
