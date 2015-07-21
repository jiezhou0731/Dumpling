<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="ico/favicon.ico" rel="shortcut icon">
<title>Dumpling Search Engine</title>
<!-- css loader -->
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
<link rel="stylesheet" href="css/dumpling.css">
<!-- js loader -->
<script src="js/pace/pace.js"></script>
<link href="js/pace/themes/orange/pace-theme-flash.css" rel="stylesheet" />
<script type='text/javascript' src="js/jquery.js"></script>
<script type='text/javascript' src='js/bootstrap.js'></script>
<script src="js/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="js/flot/jquery.flot.time.min.js" type="text/javascript"></script>

<script type="text/javascript" src="js/skycons/skycons.js"></script>

<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.6/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.6/angular-animate.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-sanitize.min.js"></script>
<script src="app/public/searchEngine.js"></script>

<style>
.click-relevant, .click-off-topic{
	margin:5px 0px;
}
</style>

</head>

<body ng-app="dumplingApp">
<div id="preloader">
		<div id="status">&nbsp;</div>
</div>
	<div ng-include="'app/public/overlay.html'"></div> 

	<div ng-include="'app/topNavi.html'"></div>

	<!-- CONTAINER -->
	<div class="container-fluid paper-wrap bevel tlbr">
		<div id="paper-top">
			<div class="row">
				<div class="col-sm-2 no-pad">
					<a class="navbar-brand logo-text" href="#">DUMPLING/DIREWOLF</a>
				</div>

				<!-- menu right -->
				<div class="navbar-right">
                     <div class="toolbox" ng-include="'app/public/preference.html'"></div>
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
		
			<!-- CONTENT -->
			<div class="wrap-fluid" id="paper-bg">
				<div ng-include="'app/public/searchBox.html'"></div>
				<div class="row">
					<div class="col-sm-12">
						<div class="row">
							<div class="col-sm-12 user-state-box-show-hide padding-bottom-0" ng-show="$root.preference.userStatePanelDisplay">
								<div class="row">
									<div ng-include="'app/public/userState.html'"></div>
								</div>
							</div>
							
							<div class="col-sm-6 padding-0 padding-right-5 public-box-show-hide" ng-class="{'col-sm-5':$root.preference.userInteractionPanelDisplay}">
								<div ng-include="'app/public/static.html'"></div>
							</div>
							<div class="col-sm-6 padding-0 padding-right-5 public-box-show-hide" ng-class="{'col-sm-5':$root.preference.userInteractionPanelDisplay}">
								<div ng-include="'app/public/dynamic.html'"></div>
							</div>
							<div class="col-sm-2 user-interaction-box-show-hide" ng-show="$root.preference.userInteractionPanelDisplay" >
								<div class="row">
									<div class="col-sm-12 padding-0">
										<div ng-include="'app/public/userInteraction.html'"></div>
									</div>
								</div>

								<div class="row">
									<div class="col-sm-12"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- / END OF CONTENT -->
			
			<div ng-include="'app/footer.html'"></div>
		</div>
		<!-- END OF SIDE MENU -->
		
	</div>
	<!-- END OF CONTAINER -->
	
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
</body>
</html>