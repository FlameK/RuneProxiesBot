To run it you need to
1) Install node.js on your computer or server where you host your bot.
2) Get a token from https://discordapp.com/developers/applications/
3) If you dont have a bot there. Create a new application an grab a token from bot section.
4) Get the invitation link from the oauth2 section. And invite the bot to your server using this link.
5) Put this token in settings.json file
it should look like this
{
"token" : "your_token_here"
}

Since this bot uses database(monbodb to be precise), you need to install it to the computer or vps(the same as the bot is running on). The following steps will guide you how to install mongodb on windows.

6) Go to this link
https://www.mongodb.com/try/download/community
It will lead you to the page where you can download mongodb community version. On the tab to the right you choose "Version - (Current), Platform - Windows, Package - msi"

7) After that hit the download button and run the file that you downloaded. It will install mongodb, you dont need to choose anything in particular in the installation.

After the installation is done the bot is ready to be used

8) Run "node bot.js" command in windows powershell console from the bot folder.
If you need to stop the bot just press ctrl + c

Commands :
-renew <reminder> @user1 @user2 in x amount of time

<> Are necessary. Example of this command
-renew <This is reminder> @craftaXLB in 5 days

You can have as many users as you want. Amount of time can be :
weeks, months, minutes, hours, days