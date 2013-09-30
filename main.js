$(document).ready(function() {

	var tagAry = [];


	$("#loadBookmarks").submit(getBookmark);

	function getBookmark(event) {
		event.preventDefault();

		$.getJSON('http://feeds.delicious.com/v2/json/tags/'+$("#sourceUser").val()+'?count=100&callback=?', function(data){
			if (data.length!=0) {
				// Clear the canvas & array
				$("#bookmarks").empty();
				$("#bookmark-links ol").empty();
				tagAry = [];

				// Put the tags into tag array
				$.each(data, function(index, value){
					tagAry.push({k:index, v:value});
				});
				tagAry.sort(compare);

				// Normalize the size of the circles
				var total = 0;
				var amount = (Object.keys(data).length<5 ? Object.keys(data).length : 5);

				for (var k=0; k<amount; k++) {
					total += tagAry[k].v;
				}
				// For the top 5 tags, each creates a circle
				for (var i=0; i<amount; i++) {
					var radius = (tagAry[i].v/total)*700;
					var circleColor = ["#185092", "#898989", "#FF9B00", "#393939", "#D6D6D6"]
					$("#bookmarks").append('<div class="circle" id="circle'+i+'">'+'<div class="circle_text">'+tagAry[i].k+'<br>'+tagAry[i].v+'</div>'+'</div>');
					$("#circle"+i).css("width",radius);
					$("#circle"+i).css("height",radius);
					$("#circle"+i).css("cursor","pointer");
					$("#circle"+i).css("background-color", circleColor[i]);
					$("#circle"+i).on("click", openBookmarkInTag);
				}
			}
			else {
				console.log("Fail to get data");
			}
		});
	}

	function openBookmarkInTag() {
		var i = $(this).attr("id")[6];

		$.getJSON('http://feeds.delicious.com/v2/json/'+$("#sourceUser").val()+"/"+tagAry[i].k+'?count=100&callback=?', function(data){
			$("#bookmark-links ol").empty();
			data = data.reverse();
			$.each(data, function(){
				$("#bookmark-links ol").append('<a href="'+this.u+'" target="_blank">'+'<li>'+this.d+'</li></a>');
				$("#left").css("min-height", 600+tagAry[i].v*13);
			});
		});
	}

	function compare(a, b) {
		if (a.v < b.v) return 1;
		if (a.v > b.v) return -1;
		return 0;
	}
});