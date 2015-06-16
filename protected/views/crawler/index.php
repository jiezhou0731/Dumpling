<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <!--   <meta content="IE=edge" http-equiv="X-UA-Compatible"> -->
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta content="" name="description">
    <meta content="" name="author">
    <link href="ico/favicon.ico" rel="shortcut icon">

   <title>DUMPLING</title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="css/bootstrap.css">
    <!-- Bootstrap theme -->
    <!--  <link rel="stylesheet" href="css/bootstrap-theme.min.css"> -->

    <!-- Custom styles for this template -->
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/dripicon.css">
    <link rel="stylesheet" href="css/typicons.css" />
    <link rel="stylesheet" href="css/font-awesome.css" />
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="js/tip/tooltipster.css">
    <link rel="stylesheet" type="text/css" href="js/range-slider/jquery.range2dslider.css" />
    <link rel="stylesheet" href="css/dumpling.css">
    
    <script type='text/javascript' src="js/jquery.js"></script>
	<script type="text/javascript" src="js/skycons/skycons.js"></script>
    <link rel="stylesheet" href="js/tree/jquery.treeview.css" />
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.6/angular.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.6/angular-animate.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-sanitize.min.js"></script>
	<script src="app/crawler/crawler.js"></script>

</head>

<body ng-app="dumplingApp">

    <div id="preloader">
        <div id="status">&nbsp;</div>
    </div>


	<div ng-include="'app/topNavi.html'"></div>
    
    <!-- Container -->
    <div class="container-fluid paper-wrap bevel tlbr">
        <div id="paper-top">
            <div class="row">
				<div class="col-sm-2 no-pad">
					<a class="navbar-brand logo-text" href="#">DUMPLING/DIREWOLF</a>
				</div>

				<!-- menu right -->
				<div class="navbar-right">
                </div>
				<!-- end of menu right -->
				
			</div>
        </div>

        <!-- SIDE MENU -->
        <div class="wrap-sidebar-content">
            <div id="skin-select">
				<a id="toggle"> <span class="fa icon-menu"></span>
				</a>
				<div ng-include="'app/sideMenu.html'"></div>
			</div>
            <!-- #/skin-select -->

            <!-- CONTENT -->
            <div class="wrap-fluid" id="paper-bg">
				<div ng-include="'app/crawler/nyuCrawler.html'"></div>
				<div ng-include="'app/crawler/memexLiveStream.html'"></div>
            </div>
             <!-- / END OF CONTENT -->
        </div>
        <!-- END OF SIDE MENU -->

      

       <div ng-include="'app/footer.html'"></div>
    </div>
    <!-- Container -->




    <!-- 
    ================================================== -->
    <!-- Main jQuery Plugins -->

    <script type='text/javascript' src='js/bootstrap.js'></script>
    <script type='text/javascript' src='js/date.js'></script>
    <script type='text/javascript' src='js/slimscroll/jquery.slimscroll.js'></script>
    <script type='text/javascript' src='js/jquery.nicescroll.min.js'></script>
    <script type='text/javascript' src='js/sliding-menu.js'></script>
    <script type='text/javascript' src='js/scriptbreaker-multiple-accordion-1.js'></script>
    <script type='text/javascript' src='js/tip/jquery.tooltipster.min.js'></script>
    <script type='text/javascript' src="js/donut-chart/jquery.drawDoughnutChart.js"></script>
    <script type='text/javascript' src="js/tab/jquery.newsTicker.js"></script>
    <script type='text/javascript' src="js/tab/app.ticker.js"></script>

    <script type='text/javascript' src='js/vegas/jquery.vegas.js'></script>
    <script type='text/javascript' src='js/image-background.js'></script>
    <script type="text/javascript" src="js/jquery.tabSlideOut.v1.3.js"></script>
    <script type="text/javascript" src="js/bg-changer.js"></script>
    
    <!-- /MAIN EFFECT -->
    <script type='text/javascript' src='js/range-slider/jquery.range2dslider.js'></script>
    <script type="text/javascript" src="js/tree/lib/jquery.cookie.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/tree/jquery.treeview.js" type="text/javascript"></script>


</body>

</html>
