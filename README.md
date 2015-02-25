## 23 Video Live Search

23 Video Live Search is a jQuery plugin that enables showing of live search results from a 23 Video website as the user is typing in a search field. It supports searching for videos, channels and tags, and it provides a quick and smooth experience for browsing and navigating your video content. The plugin can be used both directly on a 23 Video website and on any other website where you wish to allow searching for video.

23 Video Live Search relies on <a href="http://jquery.com/">jQuery</a> for DOM manipulation and <a href="https://github.com/23/visualplatform.js">visualplatform.js</a> for talking to 23 Video's API.

## Demo

See an implentation of this plugin on <a href="http://video.kglteater.dk">http://video.kglteater.dk</a>

## Usage

### Activating live search

To begin with, import jQuery, visualplatform.js and videolivesearch.js on the page:

	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="/path/to/visualplatform.js"></script>
	<script src="/path/to/videolivesearch.js"></script>

Secondly, activate videolivesearch.js on a search field and pass in an object with your settings:

	<script>
		$(document).ready(function(){
			$("#searchField").videolivesearch({
				domain: "video.domain.com",
				maxResults: 10,
				searchDelay: 300
			});
		});
	</script>

### Styling

This plugin inserts unstyled content (apart from positioning and z-index of the result container), and as such you need to style the search results. The results are inserted in a container that is placed directly after the search field, with the following structure:

	<div class="ls-container">
		<div class="ls-section-videos">
			<div class="ls-headline">Videos</div>
			<div class="ls-result">
				<div class="ls-thumb-container">
					<img class="ls-thumb" />
				</div>
				<div class="ls-result-title">Video title</div>
			</div>
			<div class="ls-result">
				<div class="ls-thumb-container">
					<img class="ls-thumb" />
				</div>
				<div class="ls-result-title">Video title</div>
			</div>
			(...)
		</div>
                <div class="ls-section-events">
			<div class="ls-headline">Videos</div>
			<div class="ls-result">
				<div class="ls-thumb-container">
					<img class="ls-thumb" />
				</div>
				<div class="ls-result-title">Event name</div>
			</div>
			<div class="ls-result">
				<div class="ls-thumb-container">
					<img class="ls-thumb" />
				</div>
				<div class="ls-result-title">Event name</div>
			</div>
			(...)
		</div>
		<div class="ls-section-channels">
			<div class="ls-headline">Channels</div>
			<div class="ls-result">
				<div class="ls-result-title">Channel name</div>
			</div>
			<div class="ls-result">
				<div class="ls-result-title">Channel name</div>
			</div>
			(...)
		</div>
		<div class="ls-section-tags">
			<div class="ls-headline">Tags</div>
			<div class="ls-result">
				<div class="ls-result-title">Tag name</div>
			</div>
			<div class="ls-result">
				<div class="ls-result-title">Tag name</div>
			</div>
			(..)
		</div>
	</div>

## Settings

You can manipulate the following settings - *name* (Type) default:

- *domain* (String) document.domain // Domain of your video website
- *protocol* (String) document.location.protocol // Protocol of video website
- *maxResults* (Number) 5 // Maximum number search results in each section
- *truncateTitles* (Number) 30 // Maximum characters in search result titles
- *searchVideos* (Boolean) true // Search for videos
- *searchEvents* (Boolean) true // Search for live events
- *searchChannels* (Boolean) false // Search for channels
- *searchTags* (Boolean) false  // Search for tags
- *showHeadlines* (Boolean) true  // Show a headline for each section
- *videoHeadline* (String) "Videos" // Headline for the video section
- *eventHeadline* (String) "Videos" // Headline for the live event section
- *channelHeadline* (String) "Channels" // Headline for the channel section
- *tagHeadline* (String) "Tags" // Headline for the tag section
- *showThumbnails* (Boolean) true // Show a thumbnail for each video result
- *thumbnailWidth* (Number) 50  // Width of thumbnails
- *thumbnailHeight* (Number) 28  // Height of thumbnails
- *searchDelay* (Number) 500  // Time in milliseconds between user input and search request