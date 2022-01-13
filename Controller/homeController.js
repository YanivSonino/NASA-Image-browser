/*Checking if user is authorized to visit the pages.*/
exports.check_safe_page = (req, res, next) => {
    if(req.session.isAuth){
        next()
    }
    else{
        req.method = "GET";
        res.redirect("http://localhost:3000");
    }
}

/*Moving user to homepage*/
exports.user_home = (req, res, next) => {
    res.render('home', {title: "Home Page", jsPath: "/js/home.js" , userName: req.session.name})
}

/*When logout button pressed user session is destroyed and user moving to landing page.*/
exports.user_logout = (req,res) =>{
    req.session.destroy((error) => {
        if (error) throw error;
        res.redirect('/');
    });
}