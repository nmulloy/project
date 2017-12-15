

function getuserinfo(){

	var t = getCookie('token');
		fetch('/userinfo?token='+t).then(function(response){
             if(response.status==200)
              return response.text();
            alert(response.body());
        }).then(function(data){
            var json = JSON.parse(data);
			var username   = json.login;
			var aviurl     = json.avatar_url;
			var profileurl = json.html_url;
			$('#username').html(username);
			$('#user-picture').html('<a href="' + profileurl + '"><img id ="aviImg" src="' + aviurl + '" alt="" class="center-block img-circle img-responsive"></a>');
			
			changeData(json);
	
		});
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function changeData(json){
	var fullname   = json.name;
			var username   = json.login;
			var aviurl     = json.avatar_url;
			var profileurl = json.html_url;
			var ghlocation   = json.location;
			var followersnum = json.followers;
			var followingnum = json.following;
			var reposnum     = json.public_repos;
			var bio 		= json.bio;
			var email 		= json.email;
			var company 	= json.company;
			var id 			= json.id;
			var datecreated = json.created_at;
			var numberOfRepos = json.public_repos;

			
			$('#nameHeading').html(fullname);
			$('#ghPicture').html('<a href="' + profileurl + '"><img src="' + aviurl + '" alt="" class="center-block img-circle img-responsive"></a>');
			$('#ghEmail').html(email);
			$('#ghCompany').html(company);
			$('#ghLocation').html(ghlocation);
			$('#ghBio').html(bio);
			$('#ghFollowers').html(followersnum);
			$('#ghFollowing').html(followingnum);
			$('#ghNumberOfRepos').html(numberOfRepos);
			$('#viewProfileButton').html('<a href = "' + profileurl + '"><button class="btn btn-success btn-block"><span class="fa fa-plus-circle"></span> View Profile </button></a>');
			$('#viewFollowersButton').html('<a href= "https://github.com/' + username + '?tab=followers"> <button class="btn btn-info btn-block"><span class="fa fa-user"></span> View Followers </button></a>')
			$('#ghID').html(id);
			
			var repos = 'https://api.github.com/users/'+username+'/repos';
			requestJSON(repos, function(json){
				$('#repos').html("");
				$("#repoChartNames").html('');
				for(var i = 0; i < json.length; i++){
				var repoName = json[i].name;
				var repoUrl = json[i].html_url;
				var languageUrl = json[i].languages_url;
				$('#repos').append('<a href = "' + repoUrl + '"><h5>' + repoName  + '</h5></a>');
				$('#repoChartNames').append( '<button class="chartButtons" data-associateid="' + languageUrl + '">' + repoName + '</button>');
				}
				
				$('.chartButtons').click(function(){
					
					var value = $(this).data('associateid');
					requestJSON(value, function(data){
						showLangs(data);
					});
				});
				
			var i = 0;
			if(json[i].languageUrl == undefined){
				i++;
			}
			
			languageUrl = json[i].languages_url;	
			console.log(languageUrl);
			requestJSON(languageUrl, function(data){
				showLangs(data);
			});
			
			});
			
			
			
        }

		function showLangs(data){
			
						// setup empty dataset array variable for d3
						var dataset = [];
						console.log(data.hasOwnProperty(key));
						// loop through data object and append items to li
						for (var key in data) {
						if (data.hasOwnProperty(key)) { // ensure it is key from data, not prototype being used
							
							// code to display language counts as list - not used at moment
							// $("#langDetails").append("<li>" + key + ": " + data[key] + "</li>");
							
							// push items into dataset array
								var item = new Object();
								item.key = key;
								item.value = data[key];
								dataset.push(item);
						};
					};
						console.log(dataset[0].key,dataset[0].value); // for checking
					$('#chart').empty();
					var chart = d3.select('#chart');
					
					for(var i = 0; i < dataset.length; i++){
						dataset[0].value = +dataset[0].value;
					}
					
					var maxVal = d3.max(dataset, function(d){
						return d.value;
					});
					//console.log(maxVal);
					var bar = chart.selectAll('div')
					.data(dataset)
					.enter().append('div')
					.attr('class','bar')
					.style('width',function(d){
						return Number((d.value/maxVal) * 100 ) + '%';
					});
					
					bar.append('span')
						.attr('class','label')
						.text(function(d){
							return d.value;
						});
					
						bar.append('span')
						.attr('class','keyName')
						.text(function(d){
							return d.key;
						});
					
					
		}
		
function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }
  
  
