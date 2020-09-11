---
title: "Wordpress: Botnet bait"
id: e142d86fdd8d84e5ee88631021ab879a
date: 2012-12-30T10:16:56.869Z
editDate: 2013-06-25T10:11:45.745Z
originalURL: http://www.noiregrets.com/blog/2012/12/30/e142d86f/Wordpress-Botnet-bait
published: true
tags:
  - security
---

_Belated Update: This botnet is not unique to my wife's website. It has be ravaging any Wordpress sites it can find. You can read more at [siliconrepublic](http://www.siliconrepublic.com/strategy/item/32269-major-brute-force-attack/)._

I learned this morning that since Boxing Day, a botnet of at least 151 IP addresses has been attempting to take over my wife's Wordpress blog, [Raging Cravings](https://web.archive.org/web/20160807202936/http://www.ragingcravings.com/). After some research, I believe this is the same attack as seen by [GraphiclineWeb](http://graphiclineweb.wordpress.com/2012/11/25/botnet-attacks-wordpress-website/) and [Perishable Press](http://perishablepress.com/protect-against-brute-force-login-attacks/).

We discovered the hacking attempt because the hackers _actually succeeded_. My wife complained about her website getting a lot of 404s, so I looked into it. I immediately discovered that some spam files had been uploaded into the root of our Wordpress folder. I immediately deleted all files, restored from a recent backup (thank god for backups), and changed passwords. So how did they do it?

Lots of Wordpress (or any PHP) websites make use of a library called [TimThumb](http://code.google.com/p/timthumb/) for uploading and displaying thumbnails. It turns out that this library has a [HUGE vulnerability](http://markmaunder.com/2011/08/01/zero-day-vulnerability-in-many-wordpress-themes/) that allows anyone to upload PHP code to the server and execute it. Luckily the vulnerability has long been fixed, but unfortunately the theme we were using, [TrulyMinimal](http://www.flarethemes.com/theme/trulyminimal/), had an old version of the library that was still vulnerable. I have emailed them and they say they are expecting to put out a new version that doesn't use TimThumb at all in the next couple weeks (though the vulnerability has been around for a year so it's a bit of a fail already that they're still vulnerable). In the meantime, I've updated timthumb.php locally, so this vulnerability is no longer an issue on our site.

Great! All fixed then? No, unfortunately. At the same time as they exploited timthumb, they also attempted to brute force the admin password for the blog. In the past 5 days, 151 different IP addresses have attempted to log into the blog as "admin". Why did they do this if they already had access to my server? I have no idea. It would seem they aren't that well organized.

For anyone interested, I looked into the IP addresses:

<pre style="height: 290px; overflow: scroll;">
* 103.7.56.210 (Unique, THAILAND)
* 107.22.208.133 (Unique, UNITED STATES)
* 108.163.128.206 (Unique, CANADA)
* 108.163.228.218 (Unique, UNITED STATES)
* 108.163.250.74 (Unique, UNITED STATES)
* 108.179.218.220 (Unique, UNITED STATES)
* 109.74.204.186 (Unique, UNITED KINGDOM)
* 112.213.84.166 (Unique, VIET NAM)
* 112.78.8.3 (Unique, VIET NAM)
* 115.68.15.54 (Unique, KOREA, REPUBLIC OF)
* 118.69.198.230 (Unique, VIET NAM)
* 142.4.30.233 (Unique, UNITED STATES)
* 163.43.132.41 (Unique, JAPAN)
* 173.166.75.217 (Unique, UNITED STATES)
* 173.193.71.176 (Unique, UNITED STATES)
* 173.231.52.246 (Unique, UNITED STATES)
* 173.243.113.200 (Unique, UNITED STATES)
* 173.255.243.68 (Unique, UNITED STATES)
* 174.120.181.179 (Unique, UNITED STATES)
* 174.121.83.162 (Unique, UNITED STATES)
* 176.28.11.67 (Unique, GERMANY)
* 176.31.234.69 (Unique, FRANCE)
* 176.9.43.178 (Unique, GERMANY)
* 176.9.49.228 (Unique, GERMANY)
* 178.157.80.11 (Unique, ROMANIA)
* 178.255.225.89 (Unique, SPAIN)
* 178.63.53.21 (Unique, GERMANY)
* 182.50.141.162 (Unique, SINGAPORE)
* 183.91.14.204 (Unique, VIET NAM)
* 184.106.168.183 (Unique, UNITED STATES)
* 184.107.237.66 (Unique, CANADA)
* 184.170.145.10 (Unique, UNITED STATES)
* 184.82.62.205 (Unique, UNITED STATES)
* 188.116.32.134 (Unique, POLAND)
* 188.132.179.34 (Unique, TURKEY)
* 188.132.225.242 (Unique, TURKEY)
* 188.190.98.26 (Unique, UKRAINE)
* 188.227.182.67 (Unique, UNITED KINGDOM)
* 188.95.251.2 (Unique, SPAIN)
* 190.186.237.2 (Unique, BOLIVIA, PLURINATIONAL STATE OF)
* 193.33.186.241 (Unique, UNITED KINGDOM)
* 194.14.79.29 (Unique, SWEDEN)
* 194.28.172.172 (Unique, UKRAINE)
* 194.38.104.59 (Unique, HUNGARY)
* 195.16.88.174 (Unique, UKRAINE)
* 195.189.80.101 (Unique, BULGARIA)
* 195.219.57.56 (Unique, SPAIN)
* 195.22.20.231 (Unique, PORTUGAL)
* 195.225.171.122 (Unique, ITALY)
* 196.200.16.88 (Unique, KENYA)
* 198.1.101.205 (Unique, UNITED STATES)
* 198.24.141.82 (Unique, -)
* 199.116.250.88 (Unique, UNITED STATES)
* 199.16.130.58 (Unique, CANADA)
* 205.204.81.100 (Unique, CANADA)
* 206.126.97.12 (Unique, UNITED STATES)
* 208.115.125.60 (Unique, CHINA)
* 208.77.45.58 (Unique, UNITED STATES)
* 209.151.224.240 (Unique, UNITED STATES)
* 209.191.186.199 (Unique, UNITED STATES)
* 209.191.187.104 (Unique, UNITED STATES)
* 209.217.246.138 (Unique, UNITED STATES)
* 212.178.198.80 (Unique, NETHERLANDS)
* 216.238.64.58 (Unique, UNITED STATES)
* 217.172.188.12 (Unique, GERMANY)
* 221.132.33.130 (Unique, VIET NAM)
* 31.210.46.106 (Unique, TURKEY)
* 37.1.222.114 (Unique, GERMANY)
* 37.1.223.19 (Unique, GERMANY)
* 37.123.98.92 (Unique, TURKEY)
* 37.59.134.60 (Unique, FRANCE)
* 46.17.97.28 (Unique, RUSSIAN FEDERATION)
* 46.22.211.11 (Unique, ESTONIA)
* 46.252.193.47 (Unique, NETHERLANDS)
* 46.32.226.96 (Unique, UNITED KINGDOM)
* 46.32.254.132 (Unique, UNITED KINGDOM)
* 46.45.143.50 (Unique, TURKEY)
* 46.45.161.250 (Unique, TURKEY)
* 46.45.169.180 (Unique, TURKEY)
* 5.9.240.238 (Unique, GERMANY)
* 5.9.81.50 (Unique, GERMANY)
* 50.116.121.84 (Unique, UNITED STATES)
* 50.22.21.114 (Unique, UNITED STATES)
* 50.22.79.226 (Unique, UNITED STATES)
* 50.22.91.134 (Unique, UNITED STATES)
* 50.28.21.75 (Unique, UNITED STATES)
* 50.57.174.146 (Unique, UNITED STATES)
* 50.63.67.12 (Unique, UNITED STATES)
* 50.93.197.25 (Unique, UNITED STATES)
* 54.243.214.134 (Unique, UNITED STATES)
* 64.207.152.84 (Unique, UNITED STATES)
* 64.62.164.94 (Unique, UNITED STATES)
* 64.64.14.79 (Unique, UNITED STATES)
* 65.49.39.194 (Unique, UNITED STATES)
* 66.135.50.49 (Unique, UNITED STATES)
* 66.154.54.43 (Unique, UNITED STATES)
* 66.7.203.158 (Unique, UNITED STATES)
* 67.205.107.173 (Unique, ECUADOR)
* 67.205.111.202 (Unique, CANADA)
* 67.227.150.178 (Unique, UNITED STATES)
* 67.227.238.95 (Unique, UNITED STATES)
* 68.169.44.28 (Unique, UNITED STATES)
* 69.162.127.133 (Unique, UNITED STATES)
* 69.175.78.234 (Unique, UNITED STATES)
* 69.41.174.38 (Unique, UNITED STATES)
* 69.60.24.170 (Unique, UNITED STATES)
* 69.64.68.159 (Unique, UNITED STATES)
* 69.90.163.60 (Unique, CANADA)
* 70.32.114.50 (Unique, UNITED STATES)
* 70.32.92.169 (Unique, UNITED STATES)
* 70.38.54.242 (Unique, CANADA)
* 72.9.231.10 (Unique, UNITED STATES)
* 74.117.220.10 (Unique, CAYMAN ISLANDS)
* 74.208.64.189 (Unique, UNITED STATES)
* 74.82.186.98 (Unique, UNITED STATES)
* 77.81.241.197 (Unique, NETHERLANDS)
* 78.111.80.205 (Unique, RUSSIAN FEDERATION)
* 78.46.128.32 (Unique, GERMANY)
* 82.194.82.102 (Unique, SPAIN)
* 83.170.121.209 (Unique, UNITED KINGDOM)
* 84.19.186.238 (Unique, GERMANY)
* 84.200.20.191 (Unique, GERMANY)
* 85.214.45.181 (Unique, GERMANY)
* 85.25.124.220 (Unique, GERMANY)
* 85.31.96.201 (Unique, LATVIA)
* 87.106.133.227 (Unique, GERMANY)
* 89.107.224.106 (Unique, TURKEY)
* 89.223.49.163 (Unique, RUSSIAN FEDERATION)
* 89.44.47.203 (Unique, ROMANIA)
* 91.207.6.6 (Unique, UKRAINE)
* 92.47.29.12 (Unique, KAZAKHSTAN)
* 93.114.41.220 (Unique, ROMANIA)
* 93.114.43.144 (Unique, ROMANIA)
* 93.186.115.18 (Unique, TURKEY)
* 94.23.250.149 (Unique, FRANCE)
* 94.23.27.29 (Unique, FRANCE)
* 95.173.186.127 (Unique, TURKEY)
* 96.126.117.240 (Unique, UNITED STATES)
* 98.126.160.18 (Unique, UNITED STATES)
* 188.143.232.173 (Duplicate, RUSSIAN FEDERATION)
* 188.143.232.189 (Duplicate, RUSSIAN FEDERATION)
* 188.143.233.177 (Duplicate, RUSSIAN FEDERATION)
* 188.143.233.2 (Duplicate, RUSSIAN FEDERATION)
* 91.215.216.35 (Duplicate, BULGARIA)
* 91.215.216.37 (Duplicate, BULGARIA)
* 91.215.216.46 (Duplicate, BULGARIA)
* 91.224.160.135 (Duplicate, NETHERLANDS)
* 91.224.160.24 (Duplicate, NETHERLANDS)
* 91.224.160.35 (Duplicate, NETHERLANDS)
* 96.127.139.186 (Duplicate, UNITED STATES)
* 96.127.139.170 (Duplicate, UNITED STATES)
</pre>

Unique servers: 139 Shared servers: 12

I thought this was pretty interesting. I've never been hacked before, and I always sort of got the impression that these servers were all in Eastern Europe somewhere. But in reality, most of these compromised machines are in the US. It's a pretty diverse set, actually.

The only reason I was able to weed out these IPs from normal readers is that I'm using the WP plugin [Simple Login Log](http://wordpress.org/extend/plugins/simple-login-log/) which records all login attempts. So I'm able to easily grab a CSV of all login attempts on my server, the IPs, and whether they've passed or failed. There have been 3600+ attempts so far, so that would have been a pain to grab data from otherwise.

I've temporarily "solved" this issue by blocking the above ips from accessing my server. I did this by adding them to my .htaccess file:

```apacheconf
    deny from IP ADDRESS
    deny from OTHER IP ADDRESS
```

The biggest issue here for me is that I'm not sure if or when it will end. It's quite possible this attack will last...forever. I'm not too worried because I've enabled a plugin, [Limit Login Attempts](http://wordpress.org/extend/plugins/limit-login-attempts/) that does as advertised. Also they are stupidly attempting to log in as a user that doesn't exist. So...

I've reported a few of the IPs to the whois results for them, but it doesn't scale too well (150 whois lookups will take a while).

If anyone has any advice on dealing with this sort of thing, it'd be great to hear. I've never been hacked before, so I'm not sure what methods I have for fighting back.
