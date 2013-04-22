(function($) {

  $.fn.videoLiveSearch = function(options) {

    var settings = $.extend({
      maxResults: 5,
      truncateTitles: 30,
      searchVideos: true,
      searchChannels: false,
      searchTags: false,
      showHeadlines: true,
      domain: undefined
    }, options);

    // Fail if no domain is specified
    if ( !settings.domain ) {
      throw "videoLiveSearch.js: No domain specified."
    }

    var searchField = this;
    var lastSearch = searchField.val();
    var requests = [];
    var vp = Visualplatform(settings.domain);

    var photoEndpoint = "/api/photo/list";
    var albumEndpoint = "/api/album/list";
    var tagEndpoint = "/api/tag/list";
    
    // Create and insert a container for showing search results
    var resultContainer = $("<div></div>").css({
      "display": "none",
      "position": "absolute",
      "z-index": 888
    }).addClass("result-container").insertAfter(searchField);
    

    var insertHeadline = function(headline) {

      resultContainer.append( $("<div></div>").addClass("search-headline").html(headline) );

    };


    var insertResult = function(title, url) {

      resultContainer.append( $("<div></div>").addClass("search-result").attr("data-url", url).html(title.substr(0,settings.truncateTitles)) );

    };

    
    var responseHandler = function(data) {

      searchField.removeClass("searching");

      resultContainer.html("").css({
        display: "block",
        cursor: "pointer"
      });

      if ( data.photos && data.photos.photos.length > 0 ) {
        if ( settings.showHeadlines ) {
          insertHeadline("Videos");
        }
        $(data.photos.photos).each(function() {
          insertResult(this.title, this.one);
        });
      }

      if ( data.albums && data.albums.albums.length > 0 ) {
        if ( settings.showHeadlines ) {
          insertHeadline("Channels");
        }
        $(data.albums.albums).each(function() {
          insertResult(this.title, this.one);
        });
      }

      if ( data.tags && data.tags.tags.length > 0 ) {
        if ( settings.showHeadlines ) {
          insertHeadline("Tags");
        }
        $(data.tags.tags).each(function() {
          insertResult(this.tag, this.url);
        });
      }

    };


    var inputHandler = function(e) {

      var searchValue = searchField.val();

      if ( searchValue !== lastSearch && searchValue !== "" ) {
        searchField.addClass("searching");
        requests = [];

        var search = searchValue;
        var data = {
          "search": search,
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

        vp.concatenate(requests, responseHandler);

      } else if ( searchValue === "" ) {
        resultContainer.html("");
      }

      lastSearch = searchValue;

    };


    // Enable navigation by up/down and enter keys
    var keydownHandler = function(e) {

      if ( e.keyCode === 40 && $(".search-result").size() !== 0 ) {

        if ( $(".result-selected").size() === 0 || $(".result-selected").index() === $(".search-result").last().index() ) {
          $(".result-selected").removeClass("result-selected");
          $(".search-result").first().addClass("result-selected");
        } else {
          $(".result-selected").removeClass("result-selected").nextAll(".search-result").first().addClass("result-selected");
        }
        e.preventDefault();

      } else if (e.keyCode === 38 && $(".search-result").size() !== 0) {

        if ( $(".result-selected").size() === 0 || $(".result-selected").index() === $(".search-result").first().index() ) {
          $(".result-selected").removeClass("result-selected");
          $(".search-result").last().addClass("result-selected");
        } else {
          $(".result-selected").removeClass("result-selected").prevAll(".search-result").first().addClass("result-selected");
        }
        e.preventDefault();

      } else if ( e.keyCode === 13 && $(".result-selected").size() !== 0 ) {

        $(".result-selected").click();
        e.preventDefault();

      }

    };


    $(resultContainer).on("click", ".search-result", function(e) {

      window.location = $(e.target).attr("data-url");

    });


    $(resultContainer).on("mouseenter", ".search-result", function(e) {

      $(".result-selected").removeClass("result-selected");
      $(e.target).addClass("result-selected");

    });


    var blurHandler = function() {

      window.setTimeout(function(){resultContainer.hide();},50);

    };


    var focusHandler = function() {

      resultContainer.show();

    };
    

    searchField.keyup(inputHandler);
    searchField.keydown(keydownHandler);

    searchField.blur(blurHandler);
    searchField.focus(focusHandler);

  };

}(jQuery));