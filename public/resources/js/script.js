$(".hover").mouseleave(
  function () {
    $(this).removeClass("hover");
  }
);
$('.ui.dropdown')
  .dropdown()
;

function sayLoudly() {
    var x = document.getElementById('unlock');
    var y = document.getElementById('lock');
       if (x.style.display === 'none') {
           x.style.display = 'block';
           y.style.display = 'none';
       } else {
           x.style.display = 'none';
           y.style.display = 'block';
       }
}

/* Carousel */
 $('.carousel').carousel({
 interval: 3000
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-65945715-1', 'auto');
ga('send', 'pageview');

function openNav(y) {
    var x = document.getElementById("mySidenav");
       if (x.style.display === 'none') {
           x.style.display = 'block';
           y.classList.remove("fa-bars")
           y.classList.add("fa-arrow-left")
       } else {
           x.style.display = 'none';
           y.classList.add("fa-bars")
       }
}

$(".singer-list").click(function(){
	var singer_name = $(this).text().replace(' ', '+');
	window.location.href= "/list?keyword="+singer_name+"&option=singer";
});
$('.genre-list').click(function(){
	var genre = $(this).text().replace('#', '').toLowerCase();
	if (genre == "art"){
		genre = "art_etc";
	}
	window.location.href= "/list?genre[]="+genre;
});

function checkLoginState() {
    FB.getLoginStatus(function(res) {
		if (res.status === 'connected') {
			var userid= res.authResponse.userID;
 			FB.api('/me?fields=name', function(res) {
				var username= res.name;
				var data={ 
					'userid': userid,
					'username': username
				};
				console.log(data);
				$.ajax({
					url:'/login',
					type: 'POST',
					data: data,
					success:function(res){
						console.log(res);
						window.location = '/';
					}
				});
            });
		}
    });
}

window.fbAsyncInit = function() {
  FB.init({
	appId      : '764345597109457',
	//appId      : '693229240881261',
	cookie     : true,  // enable cookies to allow the server to access
	xfbml      : true,  // parse social plugins on this page
	version    : 'v2.8'
  });
    FB.getLoginStatus(function(res) {
    });
};

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
