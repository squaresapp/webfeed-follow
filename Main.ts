
namespace WebfeedFollow
{
	/**
	 * Creates an empty <a> tag that when clicked, causes a redirection
	 * to the installed webfeed reader (which at this point has to be
	 * Squares), and instructs the webfeed reader to follow the specified
	 * webfeed URLs.
	 */
	export function createAnchor(...webfeedUrls: string[])
	{
		return convertAnchor(document.createElement("a"), ...webfeedUrls);
	}
	
	/**
	 * Converts an existing anchor to a a clickable webfeed-follow link.
	 * If no webfeedUrls are provided, or the specified anchor does not
	 * have a data-webfeed-href attribute, the anchor is returned without
	 * modification.
	 */
	export function convertAnchor(anchor: HTMLAnchorElement, ...webfeedUrls: string[])
	{
		if (webfeedUrls.length === 0)
			webfeedUrls.push(anchor.getAttribute(dataAttribute) || "");
		
		const href = getRedirectionUrl(webfeedUrls);
		if (href)
			anchor.href = href;
		
		return anchor;
	}
	
	/**
	 * Converts all anchors on the page with the data-webfeed-href attribute
	 * into webfeed follow links.
	 */
	export function convertAllAnchors()
	{
		const q = document.querySelectorAll(`A[${dataAttribute}]`);
		const anchors = Array.from(q) as HTMLAnchorElement[];
		
		for (const anchor of anchors)
		{
			const webfeedUrl = toAbsoluteOrNull(anchor.getAttribute(dataAttribute) || "");
			if (!webfeedUrl)
				continue;
			
			anchor.removeAttribute(dataAttribute);
			convertAnchor(anchor, webfeedUrl);
		}
	}
	
	/**
	 * Triggers a redirection of the browser window to the installed
	 * webfeed reader (which at this point has to be Squares), and
	 * instructs the webfeed reader to follow the specified webfeed
	 * URLs.
	 */
	export function go(...webfeedUrls: string[])
	{
		window.location.href = getRedirectionUrl(webfeedUrls);
	}
	
	const dataAttribute = "data-webfeed-href";
	
	/** */
	function getRedirectionUrl(webfeedUrls: string[])
	{
		const query = webfeedUrls
			.map(s => toAbsoluteOrNull(s.replace(/&/g, "%26")))
			.map(s => s?.trim())
			.filter((s): s is string => !!s)
			.join("&");
		
		return redirectionUrl + "?" + query;
	}
	
	/**
	 * Returns the specified string as a fully-qualified URL, relative
	 * to the current page, or null if the string is not a valid absolute
	 * or relative URL.
	 */
	function toAbsoluteOrNull(maybeUrl: string)
	{
		try
		{
			const url = new URL(maybeUrl, window.location.href);
			return url.toString();
		}
		catch (e) { }
		
		return null;
	}
	
	const redirectionUrl = "https://deeplink.squaresapp.org/follow/";
	document.addEventListener("DOMContentLoaded", convertAllAnchors);
}
