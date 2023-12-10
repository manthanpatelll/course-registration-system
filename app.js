var express = require('express');
var http = require('http');
var ejs = require('ejs');
var flash = require('connect-flash');

var db = require('./common/dbutil');
var main = require('./routes/main');
var user = require('./routes/user');
var admin = require('./routes/admin');
var teacher = require('./routes/teacher');
var courseMgr = require('./routes/courseMgr');
var teacherMgr = require('./routes/teacherMgr');
var scheduling = require('./routes/scheduling');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.engine('html', ejs.__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret'));
app.use(express.session());
app.use(flash());
app.use(function (req, res, next) {
    if (req.session.userinfo) {
        res.locals.username = req.session.userinfo.username;
        res.locals.userrole = req.session.userinfo.userrole;
    }
    next();
});
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get("/", main.index);
app.get("/index", main.index);
app.post("/signin", user.signin);
app.get("/signout", user.signout);
app.get("/password/change", user.getChangePasswordPage);
app.post("/password/change", user.updatePassword);

// Course Management
app.get("/admin/home", admin.home);
app.get("/admin/course/list", admin.home);
app.get("/admin/course/add", admin.addCourse);
app.post("/admin/course/add", courseMgr.saveCourse);
app.get("/admin/course/detail/:id", courseMgr.viewCourse);
app.put("/admin/course/:id", courseMgr.updateCourse);
app.del("/admin/course/:id", courseMgr.deleteCourse);
app.post("/admin/course/find", courseMgr.findCourse);

//Teacher management
app.get("/admin/teacher/add", admin.addTeacher);
app.post("/admin/teacher/add", teacherMgr.saveTeacher);
app.get("/admin/teacher/list", teacherMgr.listTeacher);
app.get("/admin/teacher/detail/:id", teacherMgr.viewTeacher);
app.put("/admin/teacher/:id", teacherMgr.updateTeacher);
app.del("/admin/teacher/:id", teacherMgr.deleteTeacher);

//Scheduling
app.get("/admin/assign/teacher", scheduling.chooseCourseToAssign);
app.get("/admin/assign/teacher/:id", scheduling.getAvailableTeacher);
app.post("/admin/assign/teacher/:id", scheduling.assignTeacherToCourse);

app.get("/teacher/home", teacher.home);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
