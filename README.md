LogMeOutThx
===========

LogMeOutThx is the fastest way to log you out of websites. Get it here or get it [there](http://logmeoutthx.com).

For now, it's made of a bookmarklet (for Safari) and a Chrome extension, which does the same thing as the bookmarklet but can be called with a configurable keyboard shortcut.

The script looks for elements in the page that look like "Sign off", "Log out", etc. and dispatch a click event on them.
If no such element is found, the user can "show" which one should be activated. It's then saved in localStorage and used the following times.

Let me know if you try it and it doesn't work 

The goal is to have a Firefox extension that would just add a keyboard shortcut for this script and/or a GreaseMonkey script that would do the same.

Also, I'd like to add the ability to easily customize the strings to match. (e.g. for different languages)

This is provided under the MIT License.

(c) 2010 Timothee Boucher

[timotheeboucher.com](http://www.timotheeboucher.com)
