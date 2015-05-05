<?php

/*
 * public function filters()
	{
		return array(
            array(
                'application.filters.UIDFilter -mechantList'
            ),
		);
	}
 */
class UIDFilter extends CFilter
{
    protected function preFilter($filterChain)
    {
    	if (!isset(Yii::app()->session['user_uid'])){
        	Yii::app()->session['user_uid']=$_GET['uid'];
    	}
        return true;
    }

    protected function postFilter($filterChain)
    {
    }
}
?>