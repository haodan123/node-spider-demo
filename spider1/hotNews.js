/**
 * create by yanle
 * create time 2019/4/1 12:13 AM
 */

// 引入所需要的第三方包
const cheerio = require('cheerio');
const superAgent = require('superagent');
const axios = require('axios')


// 获取百度新闻的数据
const getHotNews = (res) => {
    let hotNews = [];
    // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。

    /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
       以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
     */
    let $ = cheerio.load(res.data);
    // 找到目标数据所在的页面元素，获取数据
    $('div#pane-news ul li a').each((idx, ele) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        let news = {
            title: $(ele).text(),        // 获取新闻标题
            href: $(ele).attr('href')    // 获取新闻网页链接
        };
        hotNews.push(news)              // 存入最终结果数组
    });
    return hotNews
};


// 获取虎牙的数据
const getHyResult = (res) => {
    // console.log(res.data);
    let $ = cheerio.load(res.data);
    let list = []

    // 获取虎牙直播列表的数据
    $('ul.live-list li.game-live-item').each((idx, ele) => {
        const live = $(ele)
        // const link = live.find('a.video-info img').src
        const img = live.find('a.video-info img.pic').attr('src')
        const title = live.find('a.title').text()
        
        const user = live.find('span.txt')

        const userDeital = {
            name:user.find('.avatar .nick').text(),
            avatar:user.find('.avatar img').attr('src'),
            gameType:user.find(' .game-type a').text(),
            hotnum:user.find(' .num .js-num').text()
        }
        list.push({
            gid:live.attr('data-gid'),
            lp:live.attr('data-lp'),
            title,
            img,
            userDeital
        })

    });
    // console.log('节点1', list);
    return list
}

const main = async (app) => {
    /**
     * index.js
     * [description] - 使用superAgent.get()方法来访问百度新闻首页
     */
   
    app.get('/', async (req, res, next) => {
        const result= await axios.get('http://news.baidu.com/')
        const hotNews = getHotNews(result);
        res.send({
            hotNews: hotNews,
            localNews: localNews
        });
    });
   
    app.get('/hy', async (req, res, next) => {
        const result = await axios.get('https://www.huya.com/l')
        const hylist = getHyResult(result)

        res.send({
            data: hylist
        })
    });


};

module.exports = main;


