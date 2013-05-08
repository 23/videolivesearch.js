(function($) {

  $.fn.videoLiveSearch = function(options) {

    var timeouts = [];
    var settings = $.extend({
      domain: undefined,
      maxResults: 5,
      truncateTitles: 30,
      searchVideos: true,
      searchChannels: false,
      searchTags: false,
      showHeadlines: true,
      videoHeadline: "Videos",
      channelHeadline: "Channels",
      tagHeadline: "Tags",
      showThumbnails: true,
      thumbnailWidth: 50,
      thumbnailHeight: 28,
      searchDelay: 500
    }, options);

    // Fail if no domain is specified
    if ( !settings.domain ) {
      throw "videoLiveSearch.js: No domain specified."
    }

    var searchField = this;
    var lastSearch = searchField.val();
    var api = Visualplatform(settings.domain);

    var photoEndpoint = "/api/photo/list";
    var albumEndpoint = "/api/album/list";
    var tagEndpoint = "/api/tag/list";

    var retinaWidth = settings.thumbnailWidth * 2;
    var retinaHeight = settings.thumbnailHeight * 2;
    
    // Create and insert a container for showing search results
    var resultContainer = $("<div></div>").css({
      "display": "none",
      "position": "absolute",
      "z-index": 888
    }).addClass("ls-container").insertAfter(searchField);
    
    var truncateString = function(s, l) {
      if (s.length > l && l !== 0) {
        s = $.trim(s.substr(0, l)) + "...";
      }
      return s;
    };

    var insertSection = function(name) {
      var section = $("<div></div>").addClass("ls-section-"+name);
      resultContainer.append(section);
      return section;
    }

    var insertHeadline = function(headline, section) {
      if (settings.showHeadlines) {
        section.append( $("<div></div>").addClass("ls-headline").html(headline) );
      }
    };

    var insertResult = function(title, url, srcArr, section) {
      var result = $("<div></div>").addClass("ls-result").attr("data-url", url);
      if (settings.showThumbnails && srcArr) {
        var src = srcArr.join("/");
        var thumbContainer = $("<div></div>").addClass("ls-thumb-container");
        var thumb = $("<img />");
        thumb.addClass("ls-thumb").attr({
          "src": src,
          "width": settings.thumbnailWidth,
          "height": settings.thumbnailHeight
        });
        thumb.hide().load( function() { $(this).fadeIn(200); });
        thumbContainer.append(thumb);
        result.append(thumbContainer);
      }
      var titleContainer = $("<div></div>").addClass("ls-result-title");
      titleContainer.html(truncateString(title, settings.truncateTitles));
      result.append(titleContainer);
      section.append(result);
    };

    // Parse a response from the API
    var responseHandler = function(data) {
      searchField.removeClass("ls-searching");
      resultContainer.html("").hide();
      if ( data.photos && data.photos.photos.length > 0 ) {
        var section = insertSection("videos");
        insertHeadline(settings.videoHeadline, section);
        $(data.photos.photos).each(function() {
          var srcArr = ["", this.tree_id, this.photo_id, this.token, retinaWidth + "x" + retinaHeight + "cr", "thumbnail.jpg"];
          insertResult(this.title, this.one, srcArr, section);
        });
      }
      if ( data.albums && data.albums.albums.length > 0 ) {
        var section = insertSection("channels");
        insertHeadline(settings.channelHeadline, section);
        $(data.albums.albums).each(function() {
          insertResult(this.title, this.one, undefined, section);
        });
      }
      if ( data.tags && data.tags.tags.length > 0 ) {
        var section = insertSection("tags");
        insertHeadline(settings.tagHeadline, section);
        $(data.tags.tags).each(function() {
          insertResult(this.tag, this.url, undefined, section);
        });
      }
      if ($(".ls-result").size() > 0) {
        resultContainer.slideDown(200);
      }
    };

    // On input, build requests and make API call
    var inputHandler = function() {
      var searchValue = $.trim(searchField.val());
      if ( searchValue !== lastSearch && searchValue !== "" ) {
        searchField.addClass("ls-searching");
        var requests = [];
        var data = {
          "search": searchValue,
          "size": settings.maxResults
        }
        if ( settings.searchVideos ) {
          requests.push({
            "method": photoEndpoint,
            "name": "photos",
            "data": data
          });
        }
        if ( settings.searchChannels ) {
          requests.push({
            "method": albumEndpoint,
            "name": "albums",
            "data": data
          });
        }
        if ( settings.searchTags ) {
          requests.push({
            "method": tagEndpoint,
            "name": "tags",
            "data": data
          });
        }
        api.concatenate(requests, responseHandler);
      } else if ( searchValue === "" ) {
        resultContainer.html("").hide();
      }
      lastSearch = searchValue;
    };

    // Set timeouts, so we don't react on each keystroke for quick typers
    var keyupHandler = function() {
      $.each(timeouts, function(){window.clearTimeout(this);});
      timeouts = [];
      timeouts.push(window.setTimeout(function(){inputHandler();}, settings.searchDelay));
    };

    // Enable navigation by up/down and enter keys
    var keydownHandler = function(e) {
      var currentIndex = $(".ls-selected").index(".ls-result");
      if ( e.keyCode === 40 && $(".ls-result").size() > 0 ) {
        $(".ls-selected").removeClass("ls-selected");
        if (currentIndex === -1 || currentIndex === $(".ls-result").size() - 1) {
          $(".ls-result").first().addClass("ls-selected");
        } else {
          $(".ls-result").eq(currentIndex+1).addClass("ls-selected");
        }
        e.preventDefault();
      } else if (e.keyCode === 38 && $(".ls-result").size() > 0) {
        $(".ls-selected").removeClass("ls-selected");
        if (currentIndex === -1 || currentIndex === 0) {
          $(".ls-result").last().addClass("ls-selected");
        } else {
          $(".ls-result").eq(currentIndex-1).addClass("ls-selected");
        }
        e.preventDefault();
      } else if ( e.keyCode === 13 && $(".ls-selected").size() > 0 ) {
        $(".ls-selected").click();
        e.preventDefault();
      }
    };

    $(resultContainer).on("click", ".ls-result", function(e) {
      $(".ls-selected").removeClass("ls-selected");
      $(this).addClass("ls-selected");
      window.location = $(this).attr("data-url");
    });

    $(resultContainer).on("mouseenter", ".ls-result", function() {
      $(".ls-selected").removeClass("ls-selected");
      $(this).addClass("ls-selected");
    });

    var blurHandler = function() {
      window.setTimeout(function(){resultContainer.hide();},50);
    };

    var focusHandler = function() {
      if ($(".ls-result").size() > 0) {
        resultContainer.show();
      }
    };

    searchField.keyup(keyupHandler);
    searchField.keydown(keydownHandler);

    searchField.blur(blurHandler);
    searchField.focus(focusHandler);

  };

}(jQuery));