
exports.getMain = (req, res, next) => {
    console.log('Hello Main')
    res.render('main.ejs', {
        page: {title: 'Main'},
        path: '/main'
    })
}