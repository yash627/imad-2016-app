var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
	user: 'yash627',
	database: 'yash627',
	host: 'db.imad.hasura-app.io',
	port: '5432',
	password: process.env.DB_PASSWORD
	         }

var app = express();
app.use(morgan('combined'));

var articles={
    'article-one' : {
        title : 'About me | Yash Khurana',
        heading : 'About Me',
        
        content : `
                    <p>
                        Hi, everyone 
                    </p>
                    <p> My name is <b> Yash Khurana </b> </p>
                    <img src="https://github.com/yash627/imad-2016-app/blob/master/images/pic_3.jpg?raw=true" class="img-about"/>
                    <p>First year undergraduate student at the Department of Civil Engineering, Delhi Technological University, Delhi, India </p>
                    <br/>
                        `
                                                },
    'article-two' : { title : 'My Education | Yash Khurana',
        heading : 'Education',
       
        content : ` 
                    <hr/>
                    <h3> Delhi Technological University </h3>
                    <p>
                    Bachelor of Technology (B.Tech.), Civil Engineering, (2016-2020)
                    </p>
                    <img src="https://upload.wikimedia.org/wikipedia/en/b/b5/DTU%2C_Delhi_official_logo.png" class="img-small"/>
                    <hr/>
                    <h3> Gyan Bharati School,New Delhi </h3>
                    <hr/>
                    <h3>Courses<h3/>
                    <h5>Delhi College of Engineering </h5>
                    <ol>
                    <li>AP 101 </li>
                    <li>MA 101 </li>
                    <li>HU 101 </li>
                    <li>ME 101 </li>
                    <li>ME 103 </li>
                    <li>AC 101 </li>
                    <ol/>
                    <hr/>
                    `
                    },
    
    'article-three' : { title : 'Article Three | Yash Khurana',
        heading : 'Article Three',
        
        content : `
                    <p>
                        <img src="https://team.sdslabs.co/assets/email.png" class="info"/>: <a href = mailto:y.khurana@rediffmail.com>Yash Khurana </a>
                    </p>`}
};
function createTemplate (data) {
 var title = data.title;
 var heading = data.heading;

 var content = data.content;

var htmlTemplate =`
<html>
<head>
    <title>
       ${title}
    </title>
    <meta name="viewport" content ="width-device-width, initial-scale=1 "/>
    <link href="/ui/style.css" rel="stylesheet" />
    
</head>    
       <body>
        <div class= "container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
           
            <div>
               ${content}
            </div>
        </div>
       </body>
    
</html>
`;
return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function(req, res) {
	pool.query("select * from test", function (err, result) {
    	if (err)
			res.status(500).send(err.toString());
		else    
			res.send(JSON.stringify(result.rows));
	});
});

var counter=0;
app.get('/counter',function(req,res)
{
    counter=counter+1;
    res.send(counter.toString());
});

app.get('/:articleName',function (req, res){
    
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

var comments = [];

app.get('/submit-comment', function(req, res) { 
	// Get the name from the request
	var comment = req.query.comment;
	var context = req.query.context;
	
	var d = new Date();
	d.toUTCString();

	var obj = {'comment': comment, 'time': d.toUTCString()};

	if (comments[context] == undefined)
		comments[context] = [];	
	comments[context].push(obj);
	// JSON: Javascript Object Notation
	res.send(JSON.stringify(comments[context]));
});

app.get('/fetchcomments', function(req, res) {
	var context = req.query.context;
  
	if (comments[context] != undefined)
		res.send(JSON.stringify(comments[context]));
	else {
		res.send("null");
	}
});

app.get('/sunrise.jpg', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'sunrise.jpg'));
});

app.get('/articles/:articleName', function (req, res) {
	pool.query("select * from article where title = $1", [req.params.articleName], function (err, result) {
		if (err)
			res.status(500).send(err.toString());
		else {
			if (result.rows.length === 0) 
				res.status(404).send('Article not found');
			else {
				var articleData = result.rows[0];
				res.send(createTemplate(articleData));
			}  
		}   
	});
});

app.get('/createForm', function(req, res) {
	// The form's action is '/' and its method is 'POST',
	// so the `app.post('/', ...` route will receive the
	// result of our form
	var html = '<form action="/" method="post">' +
               'Enter your name:' +
               '<input type="text" name="userName" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
	res.send(html);
});

app.get('/create_article', function (req, res) {
	var title = req.query.title;
	var content = req.query.content;
	pool.query("insert into article(title, heading, date, content) values($1, $2, $3, $4)", [title, title, new Date(), content], function (err, result) {
		if (err)
			res.status(500).send(err.toString());
		else {
			res.status(200).send('Successfully created');
		}   
	});
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
