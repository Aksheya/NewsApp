var express = require("express");
var app = express();
var cors = require('cors');
const axios = require('axios');

const gdapikey = '4a39b499-fbc5-440e-bb6d-a655fc931dc4';
const nytimekey = 'FDkzW7N0xzk5Ka9fCEJaoR9ss9hjzTjv';
const default_ny_image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
const ny_times_base_URL = "https://api.nytimes.com/svc/topstories/v2/";
const default_gd_image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
const gd_base_URL = "https://content.guardianapis.com/";

app.use(cors());


makeAPICallGD = (path,type) => {
    return new Promise((resolve,reject) =>{
        axios.get(gd_base_URL + path + "&show-blocks=all")
        .then(response => {
            var news = {}
            if(response.data && response.data.response && response.data.response.results){
                var results = response.data.response.results;
                news.results = checkParamsGD(results,type);
                resolve(news);
            }
        })
        .catch(error => {
            reject(error);
        })
    });
}



// array
makeAPICall = (path,type) => {
    return new Promise(function(resolve, reject) {
      // Make our async API call here.
      axios.get( ny_times_base_URL + path + nytimekey)
      .then(response => {
          var news = {}
          if(response.data && response.data.results){
              var results = response.data.results;
              news.results = checkParams(results,type);
              resolve(news);
          }
      })
      .catch(error => {
        reject(error);
      });   
    })
}

checkDetails = (docs) => {
    var doc = docs[0];
    var params = ["pub_date","abstract","web_url"];
    var count = 0;
    var article = {};
    var flag = false;
    if(doc === undefined)return article
    params.forEach(param => {
        if(doc && doc[param] && doc[param] !="" && doc[param] !="null")
            count +=1;
    });
    if(count == 3 && doc.headline && doc.headline["main"] && doc.headline["main"]!="" && doc.headline["main"]!="null"){
        article.title  = doc.headline.main;
        article.date = doc.pub_date;
        article.description = doc.abstract;
        article.shareUrl = doc.web_url;
        article.section = doc.news_desk;
        if(article.section === undefined)
            article.section = ""
        article.url = doc.web_url;
        if(doc.multimedia){
            var images = doc.multimedia;
            for(var j in images){
                if(images[j].width && images[j].width >= 2000){
                    article.image = images[j].url;
                    if(!article.image.startsWith("http"))
                        article.image = "https://www.nytimes.com/" + article.image;
                    flag = true;
                    break;
                }
            }
        }
        if(flag == false){
            article.image = default_ny_image
        }
    }
    return article;
}

checkParams = (results, type) => {
    var home_news = []
    var params = ["section","abstract","title","published_date","url"]
    for(var i=0;i<results.length;i++){    
        var article = {}
        var result = results[i];
        var count = 0;
        var flag = false;
        params.forEach(param => {
            if(result[param] && result[param] !="null" && result[param] != "")
                count +=1
          });
        if(count == 5){
            article.section = result.section;
            article.date = result.published_date;
            article.description = result.abstract;
            article.title = result.title;
            article.url = result.url;
            article.shareUrl = result.url;
            if(result.multimedia){
                var images = result.multimedia;
                for(var j in images){
                    if(images[j].width && images[j].width >= 2000){
                        article.image = images[j].url;
                        flag = true;
                        break;
                    }
                }
            }
            if(flag == false){
                article.image = default_ny_image;
            }
            home_news.push(article);
            if(type==="section" && home_news.length == 10)
                break;
        }
    }
    return home_news;
}

checkSearch = (docs) =>{
    var news = [];
    params = ["news_desk","pub_date","web_url"];
    for(var i=0; i<docs.length; i++){
        var article={}
        var doc = docs[i];
        var count = 0;
        var flag = false;
        params.forEach(param => {
            if(doc[param] && doc[param] != "null" && doc[param] != "")
                count += 1
        });
        if(count == 3 && doc.headline && doc.headline["main"] && doc.headline["main"]!="" && doc.headline["main"]!="null"){
            article.title = doc.headline.main;
            article.date = doc.pub_date;
            article.section = doc.news_desk;
            article.url = doc.web_url;
            article.shareUrl = doc.web_url;
            if(doc.multimedia){
                var images = doc.multimedia;
                for(var j in images){
                    if(images[j].width && images[j].width >= 2000){
                        article.image = images[j].url;
                        if(!article.image.startsWith("http"))
                        article.image = "https://www.nytimes.com/" + article.image;
                        flag = true;
                        break;
                    }
                }
            }
            if(flag == false){
                article.image = default_ny_image
            }
            news.push(article);
            if(news.length == 10)
                break;
        }
    }
    return news;
}

checkDetailsGD = (content) => {
    var params = ["webTitle","webPublicationDate","webUrl","id"];
    var count = 0;
    var article = {};
    if(content == undefined)return article;
    params.forEach(param => {
        if(content[param] && content[param] !="" && content[param] !="null")
            count +=1;
    });
    if(count == 4 && content.blocks && content.blocks["body"] && content.blocks["body"][0] && content.blocks["body"][0].bodyTextSummary && 
        content.blocks["body"][0].bodyTextSummary != "" && content.blocks["body"][0].bodyTextSummary !="null"){
        article.date = content.webPublicationDate;
        article.title = content.webTitle;
        article.shareUrl = content.webUrl;
        article.description = content.blocks.body[0].bodyTextSummary;
        article.url = content.id;
        article.section = content.sectionId !== undefined && content.sectionId !== "" ? content.sectionId : content.sectionName
        if(article.section == undefined){
            article.section = ""
        }
        if(content.blocks.main && content.blocks.main.elements && content.blocks.main.elements[0].assets){
            var assets = content.blocks.main.elements[0].assets;
            // console.log(assets,"assets")
            var asset = assets[assets.length - 1];
            if(asset && asset.file && asset.file !="" && asset.file !="null")
                article.image = asset.file;
            else
                article.image = default_gd_image
        }
        else{
            article.image = default_gd_image;
        }

    }
    return article;
}

checkParamsGD = (results,type) => {
    var home_news = []
    var params = ["webTitle","sectionId","webPublicationDate","id","webUrl"]
    for(var i=0;i<results.length;i++){    
        var article = {}
        var result = results[i];
        var count = 0;
        params.forEach(param => {
            if(result[param] && result[param] !="null" && result[param] != "")
                count +=1
          });
        if(count == 5){
            article.section = result.sectionId;
            article.date = result.webPublicationDate;
            article.title = result.webTitle;
            article.url = result.id;
            article.shareUrl = result.webUrl;
            if(result.blocks && result.blocks["body"] && result.blocks["body"][0] && result.blocks["body"][0].bodyTextSummary && 
                result.blocks["body"][0].bodyTextSummary != "" && result.blocks["body"][0].bodyTextSummary !="null"){
                    article.description = result.blocks.body[0].bodyTextSummary;
                    
                    if(result.blocks.main && result.blocks.main.elements && result.blocks.main.elements[0].assets){
                        var assets = result.blocks.main.elements[0].assets;
                        // console.log(assets,"assets")
                        var asset = assets[assets.length - 1];
                        if(asset && asset.file && asset.file !="" && asset.file !="null")
                            article.image = asset.file;
                        else
                            article.image = default_gd_image
                    }
                    else{
                        article.image = default_gd_image;
                    }
                    home_news.push(article);
                    if(type==="section" && home_news.length === 10)break;
                }
        }
    }
    return home_news;
}

app.get("/", (req, res) => {
    res.json();
});

app.get("/ny-home",async(req,res) => {
    try{
        var news = await makeAPICall("home.json?api-key=","home");
        res.send(news)
    }
    catch(error){
        var news={}
        news.results = []
        res.send(news)
        console.log(error)
    }
});

app.get("/ny-world", async(req,res) => {
    try{
        var news = await makeAPICall("world.json?api-key=","section")
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/ny-technology",async(req,res) => {
    try{
        var news = await makeAPICall("technology.json?api-key=","section");
        res.send(news)
    }
   catch(error){
       console.log(error)
   }
});

app.get("/ny-politics",async(req,res) => {
    try{
        var news = await makeAPICall("politics.json?api-key=","section");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/ny-business",async(req,res) => {
    try{
        var news = await makeAPICall("business.json?api-key=","section")
        res.send(news)
    }
   catch(error){
       console.log(error)
   }
});

app.get("/ny-sports",async(req,res,next) =>{ 
    try{
        var news = await makeAPICall("sports.json?api-key=","section")
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/ny-detail-article",(req,res)=>{
    url = req.query.url;
    axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + url + '")&api-key=' + nytimekey)
    .then(response => {
        var news = {}
        if(response.data && response.data.response.docs){
            var docs = response.data.response.docs;
            // console.log(docs)
            news.results = checkDetails(docs);
            res.send(news)
        }
    })
    .catch(error => {
        console.log(error);
    });
});


// array
app.get("/ny-search",(req,res) => {
    keyword = req.query.keyword;
    axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + keyword + '&api-key=' + nytimekey)
    .then(response => {
        var news = {}
        if(response.data && response.data.response.docs){
            var docs = response.data.response.docs;
            news.results = checkSearch(docs);
            res.send(news);
        }
    })
    .catch(error => {
        console.log(error);
        var news={}
        news.results = []
        res.send(news)
    });
});

app.get("/guardian-home",async(req,res) => {
    try{
        var news = await makeAPICallGD("search?api-key=" + gdapikey + "&section=(sport|business|technology|politics)","home");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/guardian-world",async(req,res) => {
    try{
        var news = await makeAPICallGD("world?api-key=" + gdapikey,"section");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/guardian-technology",async(req,res) => {
    try{
        var news = await makeAPICallGD("technology?api-key=" + gdapikey,"section");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/guardian-sport",async(req,res) => {
    try{
        var news = await makeAPICallGD("sport?api-key=" + gdapikey,"section");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/guardian-politics",async(req,res) => {
    try{
        var news = await makeAPICallGD("politics?api-key=" + gdapikey,"section");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});

app.get("/guardian-business",async(req,res) => {
    try{
        var news = await makeAPICallGD("business?api-key=" + gdapikey,"section");
        res.send(news)
    }
    catch(error){
        console.log(error)
    }
});


//object
app.get("/guardian-detail-article", (req,res) => {
    id = req.query.url;
    axios.get(gd_base_URL + id + "?api-key=" + gdapikey + "&show-blocks=all")
    .then(response => {
        var news = {}
        if(response.data && response.data.response && response.data.response.content){
            var content = response.data.response.content;
            news.results = checkDetailsGD(content);
            res.send(news)
        }
    })
    .catch(error => {
        console.log(error);
    });
});

app.get("/guardian-search", async(req,res)=>{
    keyword = req.query.keyword;
    try{
        var news = await makeAPICallGD("search?q=" + keyword + '&api-key=' + gdapikey,"section");
        res.send(news)
    }
    catch(error){
        console.log("guardian erroe")
        console.log(error)
        var news = {}
        news.results = []
        res.send(news)
    }
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});