# Webfeed-Follow

This library creates and converts HTML anchor elements into into click-to-follow buttons, that cause a redirection to the Webfeed reader installed on the user's device (at this point, that reader must be [Squares](https://www.squaresapp.org)).

## Installation

Add this library to your website with the following snippet:
```html
<script src="https://cdn.jsdelivr.net/npm/webfeed-follow/min.js"></script>
```

## Usage (Static)

Add the `data-webfeed-href` attribute to any links that should be converted into click-to-follow buttons:

```html
<a data-webfeed-href="/path/to/webfeed/index.txt">Follow my Webfeed!</a>
```

The value specified in the `data-webfeed-href` may be relative to the current page, or it may be an absolute URL.

## Usage (Dynamic)

If you'd like to dynamically create click-to-follow links, this library has a minimal API for doing so. The functions are as follows. See the VS Code links 

`WebfeedFollow.createAnchor(...webfeedUrls: string[])`

Creates an empty <a> tag that when clicked, causes a redirection to the installed webfeed reader (which at this point has to be Squares), and instructs the webfeed reader to follow the specified webfeed URLs.

`convertAnchor(anchor: HTMLAnchorElement, ...webfeedUrls: string[])`

Converts an existing anchor to a a clickable webfeed-follow link. If no webfeedUrls are provided, or the specified anchor does not have a data-webfeed-href attribute, the anchor is returned without modification.

`go(...webfeedUrls: string[])`

Triggers a redirection of the browser window to the installed webfeed reader (which at this point has to be Squares), and instructs the webfeed reader to follow the specified webfeed URLs.

## How This Works

At this point, the links created by this library are iOS Universal Links / Android AppLinks which redirect the user to the [Squares](https://www.squaresapp.org) app, or to the app store to download Squares if it's not installed. **This really sucks**. If Webfeeds are to become an adopted standard, multiple Webfeed readers need to exist, and the follow links that exist all over the internet need to use an open URI scheme, such as `webfeed://...`, so that any webfeed reader installed on the device can receive the request.

However, on iOS or Android, it's not possible to determine if an app is installed on the users device that can handle a given URI scheme. This is necessary in order to know when to redirect the user to the appropriate app store so that the user can download a webfeed reader. 

A previous version of this library opted for this "eventual open standard" design, but it resulted in a user experience we found to be unacceptable. If Webfeeds are to become a viable exit strategy for mainstream social media, the follow-from-web experience needs to be best-in-class. RSS didn't deliver in this area and it was disasterous for it's adoption. We must be careful not to repeat these mistakes.

Before clicking on the link, the URLs to follow are first copied to the clipboard. Squares checks the clipboard for URLs to follow when it gains the focus. This may seem a bit brittle, but the clipboard mime type used is `text/uri-list` for Safari and `web text/uri-list` for other browsers, so clipboard overwrites should be uncommon.

