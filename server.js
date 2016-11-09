var express = require('express');
var morgan = require('morgan');
var path = require('path');

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
                    <p>First year undergraduate student at the Department of Civil Engineering, Delhi Technological University, Delhi, India </p>
                    <br/>
                    <h3> Interests: </h3>
                    <ol>
                        <li> Programming </li>
                        <li> Web Development and Designing </li>
                        <li> Technology </li>
                        <li> Internet </li>
                        <li> Music </li>`
                                                },
    'article-two' : { title : 'My Education | Yash Khurana',
        heading : 'Education',
       
        content : ` <div class = "new1">
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
                    </div>
                    `
                    
                    
                    
                    },
    'article-three' : { title : 'Article Three | Yash Khurana',
        heading : 'Article Three',
        
        content : `
                    <p>
                        This is the content for Article Three
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
