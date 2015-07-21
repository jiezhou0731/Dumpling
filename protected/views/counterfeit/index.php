<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="ico/favicon.ico" rel="shortcut icon">
<title>Minerva</title>
<!-- css loader -->
<link rel='stylesheet prefetch' href='http://cdn.rawgit.com/angular/bower-material/v0.10.0/angular-material.css'>
<link rel="stylesheet" href="css/bootstrap.css">
<link rel="stylesheet" href="assets/andrew/andrew.css">
<link rel="stylesheet" href="css/custom.css">
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/dripicon.css">
<link rel="stylesheet" href="css/typicons.css" />
<link rel="stylesheet" href="css/font-awesome.css" />
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="js/tip/tooltipster.css">
<link rel="stylesheet" type="text/css" href="js/vegas/jquery.vegas.css" />
<link rel="stylesheet" type="text/css"
	href="js/number-progress-bar/number-pb.css">
<link rel="stylesheet" href="js/tree/jquery.treeview.css" />
<link rel="stylesheet" href="js/tree/treetable/stylesheets/jquery.treetable.css" />
<link rel="stylesheet" href="js/tree/treetable/stylesheets/jquery.treetable.theme.default.css" />
<link href="js/stackable/stacktable.css" rel="stylesheet" />
<link href="js/stackable/responsive-table.css" rel="stylesheet" />

<link href="js/tree/tabelizer/tabelizer.min.css" media="all" rel="stylesheet" type="text/css" />

<link rel="stylesheet" href="css/dumpling.css">
<!-- js loader -->

<script type='text/javascript' src="js/jquery.js"></script>
<script type='text/javascript' src='js/bootstrap.js'></script>
<script src="js/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="js/flot/jquery.flot.time.min.js" type="text/javascript"></script>

<script type="text/javascript" src="js/tree/lib/jquery.cookie.js" type="text/javascript"></script>
<script type="text/javascript" src="js/tree/jquery.treeview.js" type="text/javascript"></script>


<script type="text/javascript" src="js/tree/tabelizer/jquery-ui-1.10.4.custom.min.js"></script>
<script type="text/javascript" src="js/tree/tabelizer/jquery.tabelizer.js"></script>

<script type="text/javascript" src="js/skycons/skycons.js"></script>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.6/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.6/angular-animate.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>
<script src="assets/angularjs/angular-cookies.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-sanitize.min.js"></script>
<script src='http://cdn.rawgit.com/angular/bower-material/v0.10.0/angular-material.js'></script>
<script src="assets/angularjs/angular-dragdrop.js"></script>

<script src="assets/threejs/three.min.js"></script>
<script src="assets/threejs/Detector.js"></script>
<script src="assets/threejs/stats.min.js"></script>
	<script src="http://malsup.github.com/jquery.form.js"></script> 
<script src="assets/angularjs/angular.country-select.js"></script>

<script src="js/pace/pace.js"></script>
<link href="js/pace/themes/orange/pace-theme-flash.css" rel="stylesheet" />
</head>

<body ng-app="dumplingApp" style="overflow: hidden; height:100vh;padding:0px;">
<div  style="overflow: hidden; height:100vh;  padding: 0px;">
	<!--
<div id="preloader">
		<div id="status">&nbsp;</div>
</div>!-->
	<div ng-include="'app/counterfeit/overlay.html'"></div> 

	<div ng-include="'app/topNavi.html'"></div>
<style>
.index-submit-button{
float:right;
margin-right: 30px;
height:50px;
width:50px;
border-radius: 50%;  
margin-top: -13px;
background-color:#45B6B0; 
border:5px solid #45B6B0;
outline: none;
background-image: url('img/paw.png');
background-size: contain;
background-repeat: no-repeat;
cursor: pointer;
}
.index-submit-button:hover{
    background-color:#36D7B7;
    border:5px solid #36D7B7;
}
</style>

<div ng-include="'app/counterfeit/cubeTestImage.html'" style="position:absolute;margin-left:68vw;margin-top:50vh;"></div>
<div style="position:fixed;right:25vw;;z-index: 100;top: 50px;">
	<div style="text-align: center;" ng-controller="searchBoxController" ng-show="$root.nextInNavi=='search'">
		<div ng-click="clickSubmit();" class="index-submit-button" ></div>
	</div>
	<div style="text-align: center;" ng-controller="dynamicController" ng-show="$root.nextInNavi=='nextPage'">
		<div ng-click="clickNextPage();"  class="index-submit-button"></div>
	</div>
</div>
	<!-- CONTAINER -->
	<div class="container-fluid paper-wrap bevel tlbr" style="margin:0psx;  height: 100vh;">
		
		<!-- SIDE MENU -->
		<div class="wrap-sidebar-content">
			<div id="skin-select">
				<a id="toggle"> <span class="fa icon-menu"></span>
				</a>
				<div ng-include="'app/sideMenu.html'"></div>
			</div>
		
			<!-- CONTENT -->
			<div class="wrap-fluid" id="paper-bg" style="padding-top: 6px;">
				
				<div class="row" style="height:90vh;overflow:hidden; padding-top:15px;">
					<div class="col-sm-4" style="height:82vh;overflow:hidden;padding: 3px;">
						<div class="row">
							<div class="col-sm-12 padding-0 padding-right-5 dynamic-box-show-hide" ng-class="{'col-sm-10':$root.preference.userInteractionPanelDisplay}">
								<div class="container1" style="height:82vh; ">
    								<div class="container2">
										<div ng-include="'app/counterfeit/dynamic.html'"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-5" style="height:82vh;overflow:hidden;padding: 3px;z-index:12">
						<div class="row">
							<div class="container1" style="height:82vh; ">
    							<div class="container2" style="overflow: hidden;">
									<div ng-include="'app/counterfeit/docDetail.html'"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-3" style="padding: 3px;">
						<div class="container1" style="height:90vh;">
    						<div class="container2">
								<div ng-include="'app/counterfeit/topics.html'"></div>
							</div>
						</div>
					</div>
					
				</div>
				
			</div>
		</div>
		<!-- END OF SIDE MENU -->
		
	</div>
	<!-- END OF CONTAINER -->
</div>
<div style="width:50vw;position:fixed;bottom:55px;margin-left:70px;float:left;">
		<div ng-include="'app/counterfeit/searchBox.html'"></div>
</div>
<div class="row" style="width:100vw;left:0px;position:fixed;;bottom:0vh; padding-left:10px; z-index: 2000; overflow:hidden;">
	<div ng-include="'app/counterfeit/userState.html'"></div>
</div>
<script type='text/javascript' src='js/date.js'></script>
<script type='text/javascript'
src='js/slimscroll/jquery.slimscroll.js'></script>
<script type='text/javascript' src='js/jquery.nicescroll.min.js'></script>
<script type='text/javascript' src='js/sliding-menu.js'></script>
<script type='text/javascript'
src='js/scriptbreaker-multiple-accordion-1.js'></script>
<script type='text/javascript' src='js/tip/jquery.tooltipster.min.js'></script>
<script type='text/javascript' src='js/vegas/jquery.vegas.js'></script>
<script type='text/javascript' src='js/image-background.js'></script>
<script type="text/javascript" src="js/jquery.tabSlideOut.v1.3.js"></script>
<script type="text/javascript" src="js/bg-changer.js"></script>
<script type='text/javascript' src="js/button/ladda/spin.min.js"></script>
<script type='text/javascript' src="js/button/ladda/ladda.min.js"></script>
<script type='text/javascript'
src='js/button/progressbutton.jquery.js'></script>
<script type='text/javascript'
src="js/number-progress-bar/jquery.velocity.min.js"></script>
<script type='text/javascript'
src="js/number-progress-bar/number-pb.js"></script>
<script src="js/loader/loader.js" type="text/javascript"></script>
<script src="js/loader/demo.js" type="text/javascript"></script>
<script type="text/javascript" src="js/skycons/skycons.js"></script>
<script type='text/javascript' src='assets/foggy/jquery.foggy.min.js'></script>
<script type="text/javascript" src="js/tree/treetable/vendor/jquery-ui.js"></script>
<script type="text/javascript" src="js/tree/treetable/javascripts/src/jquery.treetable.js"></script>
<script type="text/javascript" src="js/stackable/stacktable.js"></script>
<script src="app/counterfeit/counterfeit.js"></script>

</body>
</html>