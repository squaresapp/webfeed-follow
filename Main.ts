
namespace WebfeedFollow
{
	/**
	 * Creates an anchor that when clicked, goes to the installed
	 * webfeed reader (which at this point has to be Squares), and
	 * instructs the webfeed reader to follow the specified webfeed
	 * URLs.
	 */
	export function createAnchor(...webfeedUrls: string[])
	{
		const anchor = document.createElement("a");
		anchor.href = getRedirectionUrl(webfeedUrls);
		anchor.addEventListener("click", () =>
		{
			writeClipboard(webfeedUrls.join("\n"));
		});
		
		return anchor;
	}
	
	/**
	 * Triggers a redirection of the browser window to the installed
	 * webfeed reader (which at this point has to be Squares), and
	 * instructs the webfeed reader to follow the specified webfeed
	 * URLs.
	 */
	export function go(...webfeedUrls: string[])
	{
		writeClipboard(webfeedUrls.join("\n"));
		window.location.href = getRedirectionUrl(webfeedUrls);
	}
	
	/**
	 * Adds the specified text to the clipboard,
	 * under all applicable mime types.
	 */
	function writeClipboard(text: string)
	{
		for (const type of clipboardDataTypes)
		{
			try
			{
				const blob = new Blob([text], { type });
				const data = [new ClipboardItem({ [type]: blob })];
				navigator.clipboard.write(data);
			}
			catch (e)
			{
				continue;
			}
			
			break;
		}
	}
	
	/**
	 * The list of data types to attempt to copy to the clipboard.
	 * 
	 * Some browsers (Chrome) don't allow text/uri-list copied
	 * on write, so we fall back to text/plain in this case.
	 */
	const clipboardDataTypes = ["text/uri-list", "text/plain"];
	
	/** */
	function getRedirectionUrl(webfeedUrls: string[])
	{
		const query = webfeedUrls
			.map(s => s.replace(/&/g, "%26"))
			.join("&");
		
		return redirectionUrl + "?" + query;
	}
	
	/**
	 * 
	 * 
	 * NOTE: This isn't ideal, at all, but it's currently the best available
	 * solution to maximize the probility of the proliferation of webfeeds.
	 */
	const redirectionUrl = "https://deeplinks.squaresapp.org/";
}
